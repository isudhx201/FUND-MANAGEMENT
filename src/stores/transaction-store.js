import { defineStore } from 'pinia'
import axios from 'axios'

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_eEKqV-Aolo5VsDjcFXhrXxZcFIgNVGE2dy0r1ESZ4TFEzwZWA8DmFWrY04kY6VRFaUtEcDF_RWHW/pub?output=csv'
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

export const useTransactionStore = defineStore('transactions', {
  state: () => ({
    transactions: JSON.parse(localStorage.getItem('batch_fund_transactions')) || [], // Load from local storage
    notice: localStorage.getItem('batch_fund_notice') || '',
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
        const dateStr = `2026-${String(monthIndex + 1).padStart(2, '0')}-28`
        
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
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
    },
    specialExpenses(state) {
      return state.transactions
        .filter(t => t.type === 'Debit')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0)
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
       // Manual transactions always use numeric timestamp IDs
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
           
           // 2. If same date, sort by ID DESC (Newest created first)
           // Manual transactions have numeric IDs (timestamp). Aggregates have string IDs.
           const idA = a.id
           const idB = b.id
           const typeA = typeof idA
           const typeB = typeof idB
           
           // If types differ (one manual, one aggregate), prioritize Manual (Number)
           if (typeA === 'number' && typeB !== 'number') return -1 // A is number -> A comes first (Top)
           if (typeB === 'number' && typeA !== 'number') return 1  // B is number -> B comes first

           // If both numbers (Manual txs on same day), larger timestamp first
           if (typeA === 'number' && typeB === 'number') return idB - idA

           // If both strings (Aggregates on same day?? Unlikely but safe fallback), alpha sort
           return String(idB).localeCompare(String(idA))
        })
    }
  },
  actions: {
    async fetchSheetData() {
      this.loading = true
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
            let field = h.toLowerCase().replace(/[\s.]/g, '_')
            if (h === 'Registration No.') field = 'regNo'
            if (h === 'Name') field = 'name'
            row[field] = currentLine[index]?.trim() || ''
          })
          rows.push(row)
        }
        this.students = rows
      } catch (error) {
        console.error('Error fetching sheet:', error)
      } finally {
        this.loading = false
      }
    },
    addTransaction(transaction) {
      // Ensure generated ID overwrites any null ID passed in the payload
      this.transactions.push({
        ...transaction,
        id: Date.now()
      })
      this.saveToStorage()
    },
    updateTransaction(updatedTx) {
      const index = this.transactions.findIndex(t => t.id === updatedTx.id)
      if (index !== -1) {
        this.transactions[index] = updatedTx
        this.saveToStorage()
      }
    },
    deleteTransaction(id) {
       this.transactions = this.transactions.filter(t => t.id !== id)
       this.saveToStorage()
    },
    linkDocument(txId, docName, docData) {
      const tx = this.transactions.find(t => t.id === txId)
      if (tx) {
        tx.proofName = docName
        tx.proofData = docData
        this.saveToStorage()
      }
    },
    saveToStorage() {
      localStorage.setItem('batch_fund_transactions', JSON.stringify(this.transactions))
    },
    updateNotice(text) {
      this.notice = text
      localStorage.setItem('batch_fund_notice', text)
    }
  }
})
