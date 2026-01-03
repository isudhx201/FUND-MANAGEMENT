import { defineStore } from 'pinia'
import axios from 'axios'
import { supabase } from 'src/supabase'

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_eEKqV-Aolo5VsDjcFXhrXxZcFIgNVGE2dy0r1ESZ4TFEzwZWA8DmFWrY04kY6VRFaUtEcDF_RWHW/pub?output=csv'
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    notice: '',
    students: [], // Sheet data
    loading: false
  }),
  getters: {
    monthlyAggregations(state) {
      if (state.students.length === 0) return []
      
      const sums = {}
      state.students.forEach(row => {
        Object.keys(row).forEach(key => {
           if (MONTHS.includes(key)) {
             const val = parseFloat(row[key])
             if (!isNaN(val) && val > 0) {
               sums[key] = (sums[key] || 0) + val
             }
           }
        })
      })

      return Object.keys(sums).map(month => {
        const monthIndex = MONTHS.indexOf(month)
        const currentYear = new Date().getFullYear()
        const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-28`
        
        return {
          id: `monthly-${month}`,
          date: dateStr,
          description: `${month.charAt(0).toUpperCase() + month.slice(1)} Student Collections`,
          type: 'Credit',
          amount: sums[month],
          isAggregate: true
        }
      })
    },
    specialIncome(state) {
      return state.transactions
        .filter(t => t.type === 'Credit')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
    },
    specialExpenses(state) {
      return state.transactions
        .filter(t => t.type === 'Debit')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)
    },
    totalFunds() {
      // Access other getters via 'this'
      const aggregates = this.monthlyAggregations.reduce((sum, t) => sum + t.amount, 0)
      const specialInc = this.specialIncome
      const specialExp = this.specialExpenses
      return aggregates + specialInc - specialExp
    },
    sortedTransactions(state) {
       // Just the special transactions, sorted (for Admin Dashboard)
       return [...state.transactions].sort((a, b) => {
         const dateDiff = b.date.localeCompare(a.date)
         if (dateDiff !== 0) return dateDiff
         return (b.id || 0) - (a.id || 0)
       })
    },
    allTransactions(state) {
        // Combined list for History Page
        const combined = [...state.transactions, ...this.monthlyAggregations]
        return combined.sort((a, b) => {
           // 1. Sort by Date DESC
           const dateDiff = b.date.localeCompare(a.date)
           if (dateDiff !== 0) return dateDiff
           
           // 2. If same date, sort by ID DESC
           const idA = a.id
           const idB = b.id
           
           // We try to keep numeric IDs (Manual) on top of string IDs (Aggregate)
           // If types differ
           const typeA = typeof idA
           const typeB = typeof idB
           
           if (typeA === 'number' && typeB !== 'number') return -1 
           if (typeB === 'number' && typeA !== 'number') return 1 

           if (typeA === 'number' && typeB === 'number') return idB - idA
           return String(idB).localeCompare(String(idA))
        })
    }
  },
  actions: {
    async fetchAllData() {
      this.loading = true
      await Promise.all([
        this.fetchSheetData(),
        this.fetchTransactions(),
        this.fetchNotice()
      ])
      this.loading = false
    },
    
    async fetchSheetData() {
      try {
        const response = await axios.get(SHEET_URL + '&t=' + Date.now())
        const lines = response.data.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        
        const rows = []
        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].split(',')
          if (currentLine.length < headers.length) continue
    
          const row = { id: i }
          headers.forEach((h, index) => {
            const cleanHeader = h.trim()
            let field = cleanHeader.toLowerCase().replace(/[\s.]/g, '_')
            if (cleanHeader === 'Registration No.') field = 'regNo'
            if (cleanHeader === 'Name') field = 'name'
            
            let value = currentLine[index] ? currentLine[index].trim() : ''
            
            if (MONTHS.includes(field)) {
              const numVal = parseFloat(value)
              row[field] = isNaN(numVal) ? 0 : numVal
            } else {
              row[field] = value
            }
          })
          rows.push(row)
        }
        this.students = rows
      } catch (error) {
        console.error('Error fetching sheet:', error)
      }
    },

    async fetchTransactions() {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
      
      if (error) {
        console.error('Error fetching transactions:', error)
      } else if (data) {
        this.transactions = data.map(t => ({
          ...t,
          // Ensure both exist for compatibility
          proofName: t.proofName || t.proof_name || null,
          proofData: t.proofData || t.proof_data || null
        }))
      }
    },

    async fetchNotice() {
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', 'notice')
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is 'Row not found' which is fine
        console.error('Error fetching notice:', error)
      } else if (data) {
        this.notice = data.value
      }
    },

    async addTransaction(transaction) {
      this.loading = true
      // We omit ID and let DB generate it via Identity Column
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            date: transaction.date,
            description: transaction.description,
            type: transaction.type,
            amount: transaction.amount,
            proof_name: transaction.proofName || null,
            proof_data: transaction.proofData || null
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error adding transaction:', error)
        alert('Failed to save transaction')
      } else if (data) {
        // Map the DB fields back to the local state format
        const localTx = {
          ...data,
          proofName: data.proof_name,
          proofData: data.proof_data
        }
        this.transactions.push(localTx)
      }
      this.loading = false
    },

    async updateTransaction(updatedTx) {
      const { error } = await supabase
        .from('transactions')
        .update({
             date: updatedTx.date,
             description: updatedTx.description,
             type: updatedTx.type,
             amount: updatedTx.amount,
             proof_name: updatedTx.proofName,
             proof_data: updatedTx.proofData
        })
        .eq('id', updatedTx.id)

      if (error) {
        console.error('Error updating transaction:', error)
        alert('Failed to update transaction')
      } else {
        const index = this.transactions.findIndex(t => String(t.id) === String(updatedTx.id))
        if (index !== -1) {
          // Ensure we preserve the camelCase naming in local state
          this.transactions[index] = {
            ...updatedTx,
            proofName: updatedTx.proofName,
            proofData: updatedTx.proofData
          }
        }
      }
    },

    async deleteTransaction(id) {
       const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
      
       if (error) {
         console.error('Error deleting transaction:', error)
         alert('Failed to delete transaction')
       } else {
         this.transactions = this.transactions.filter(t => t.id !== id)
       }
    },

    async linkDocument(txId, docName, docData) {
      const { error } = await supabase
        .from('transactions')
        .update({
          proof_name: docName,
          proof_data: docData
        })
        .eq('id', txId)
      
      if (error) {
         console.error('Link doc error', error)
      } else {
        const index = this.transactions.findIndex(t => String(t.id) === String(txId))
        if (index !== -1) {
          // Replace object to ensure reactivity
          this.transactions[index] = {
            ...this.transactions[index],
            proofName: docName,
            proofData: docData
          }
        }
      }
    },

    async updateNotice(text) {
      this.notice = text
      
      const { error } = await supabase
        .from('system_settings')
        .upsert({ key: 'notice', value: text })
      
      if (error) {
        console.error('Error updating notice:', error)
        alert('Failed to save notice')
      }
    }
  }
})
