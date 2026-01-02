<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="container q-mx-auto">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <h1 class="text-h4 text-weight-bold q-my-sm">Main Fund History</h1>
          <div class="text-subtitle2 text-grey-7">Detailed chronological record of all fund activities</div>
        </div>
        <q-btn 
          label="Back to Home" 
          icon="arrow_back" 
          flat 
          no-caps 
          to="/" 
          color="black" 
        />
      </div>

      <q-card flat bordered class="bg-white">
        <q-card-section>
          <q-table
            :rows="transactionStore.allTransactions"
            :columns="columns"
            row-key="id"
            flat
            :pagination="{ rowsPerPage: 20 }"
          >
            <template v-slot:body-cell-type="props">
              <q-td :props="props">
                <q-chip 
                  :color="props.row.type === 'Credit' ? 'green-1' : 'red-1'" 
                  :text-color="props.row.type === 'Credit' ? 'green-9' : 'red-9'"
                  dense 
                  square
                  class="text-weight-bold"
                >
                  {{ props.row.type === 'Credit' ? 'Income' : 'Expense' }}
                </q-chip>
              </q-td>
            </template>
            <template v-slot:body-cell-amount="props">
              <q-td :props="props" class="text-weight-bold">
                {{ props.row.type === 'Credit' ? '+' : '-' }} LKR {{ props.row.amount.toLocaleString() }}
              </q-td>
            </template>
            <template v-slot:body-cell-proof="props">
              <q-td :props="props">
                 <q-btn 
                   v-if="props.row.proofName" 
                   icon="download" 
                   label="Download" 
                   flat 
                   dense 
                   no-caps 
                   color="primary" 
                   size="sm"
                   @click="viewDocument(props.row)"
                 />
                 <span v-else class="text-grey-5">-</span>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <div v-if="userStore.isAdmin && route.query.mode === 'admin' && !props.row.isAggregate" class="q-gutter-sm">
                   <q-btn flat round dense icon="edit" color="grey-8" @click="editTx(props.row)" />
                   <q-btn flat round dense icon="delete" color="negative" @click="deleteTx(props.row.id)" />
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <!-- Transaction Dialog (For Admin Edits) -->
    <q-dialog v-model="txDialog">
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Edit Transaction</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
           <q-input filled v-model="txForm.date" label="Date" type="date" stack-label />
           <q-input filled v-model="txForm.description" label="Description" />
           <!-- Type is usually fixed but let's allow change if editing logic allows -->
           <q-select filled v-model="txForm.type" :options="['Credit', 'Debit']" label="Type" />
           <q-input filled v-model.number="txForm.amount" label="Amount" type="number" />
           <q-file filled v-model="txProofFile" label="Proof Document (Optional)">
              <template v-slot:prepend><q-icon name="attach_file" /></template>
           </q-file>
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveTx" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useTransactionStore } from 'stores/transaction-store'
import { useUserStore } from 'stores/user-store'
import { useQuasar } from 'quasar'

const transactionStore = useTransactionStore()
const userStore = useUserStore()
const route = useRoute()
const $q = useQuasar()

const columns = [
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'description', label: 'Description', field: 'description', align: 'left' },
  { name: 'type', label: 'Type', field: 'type', align: 'center' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right' },
  { name: 'proof', label: 'Proof / Document', field: 'proofName', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

// Edit Handling
const txDialog = ref(false)
const isEditing = ref(false)
const txProofFile = ref(null)
const txForm = reactive({
  id: null,
  date: '',
  description: '',
  type: 'Credit',
  amount: ''
})

function editTx(row) {
  isEditing.value = true
  txForm.id = row.id
  txForm.date = row.date
  txForm.description = row.description
  txForm.type = row.type
  txForm.amount = row.amount
  txDialog.value = true
}

function deleteTx(id) {
  $q.dialog({
    title: 'Confirm',
    message: 'Are you sure you want to delete this transaction?',
    cancel: true,
    persistent: true
  }).onOk(() => {
    transactionStore.deleteTransaction(id)
  })
}

function saveTx() {
  if (txProofFile.value) {
    // Size check
    if (txProofFile.value.size > 2 * 1024 * 1024) {
      alert('File is too large for local storage demonstration (Limit: 2MB).')
      return;
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const docData = e.target.result
      const payload = { 
        ...txForm, 
        proofName: txProofFile.value.name,
        proofData: docData
      }
      
      commitTx(payload)
    }
    reader.readAsDataURL(txProofFile.value)
  } else {
    // No new file - preserve old data if editing
    let existingData = null
    let existingName = null
    
    if (isEditing.value) {
      const original = transactionStore.transactions.find(t => t.id === txForm.id)
      if (original) {
        existingName = original.proofName
        existingData = original.proofData
      }
    }

    const payload = { 
      ...txForm, 
      proofName: existingName,
      proofData: existingData
    }
    commitTx(payload)
  }
}

function commitTx(payload) {
  if (isEditing.value) {
    transactionStore.updateTransaction(payload)
  } else {
    transactionStore.addTransaction(payload)
  }
  txDialog.value = false
}

function viewDocument(row) {
  if (!row.proofName) return;

  if (row.proofData) {
     // Create a temporary link to trigger download
     const link = document.createElement('a')
     link.href = row.proofData
     link.download = row.proofName
     document.body.appendChild(link)
     link.click()
     document.body.removeChild(link)
     $q.notify({ type: 'positive', message: 'Download started...' })
  } else {
    // Fallback for older records without data
    $q.dialog({
      title: 'Document Unavailable',
      message: `Filename: ${row.proofName}<br/><br/>The actual file content is not available for this legacy record.`,
      html: true,
      ok: { label: 'Close', color: 'primary' }
    })
  }
}

onMounted(() => {
  if (transactionStore.students.length === 0) {
    transactionStore.fetchSheetData()
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
