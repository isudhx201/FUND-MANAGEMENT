<template>
  <q-page class="font-inter" :class="$q.dark.isActive ? 'bg-blue-grey-10 text-white' : 'bg-grey-1'">
    <div class="q-py-lg text-white q-mb-lg shadow-2" :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-gradient-primary'">
       <div class="container q-mx-auto q-px-md">
          <div class="row items-center justify-between q-gutter-y-sm">
            <div class="col-12 col-sm-auto">
              <h1 class="text-h4 text-weight-bold q-my-none">Transaction History</h1>
              <div class="text-subtitle2 opacity-80 q-mt-xs">Detailed chronological record of all fund activities</div>
            </div>
            <div class="col-12 col-sm-auto">
              <q-btn 
                label="Back to Home" 
                icon="arrow_back" 
                flat 
                dense
                rounded
                class="bg-white-20 text-white q-px-md"
                no-caps 
                to="/" 
              />
            </div>
          </div>
       </div>
    </div>

    <div class="container q-mx-auto q-px-md q-pb-xl">
      <q-card class="shadow-soft border-radius-lg overflow-hidden" :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white border-dark-mode' : 'bg-white'">
        <q-card-section class="q-pa-none">
          <q-table
            :rows="transactionStore.allTransactions"
            :columns="columns"
            row-key="id"
            flat
            :pagination="{ rowsPerPage: 20 }"
            class="modern-table"
            :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white' : ''"
            :grid="$q.screen.xs"
          >
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-bold" :class="$q.dark.isActive ? 'bg-blue-grey-10 text-grey-4' : 'text-grey-8 bg-grey-1'">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props" class="transition-base" :class="$q.dark.isActive ? 'hover-bg-dark' : 'hover-bg-grey'">
                <q-td key="date" :props="props">
                   <div class="text-weight-medium" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">{{ props.row.date }}</div>
                </q-td>
                <q-td key="description" :props="props">
                   <div class="text-weight-bold">{{ props.row.description }}</div>
                   <div class="text-caption" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'" v-if="props.row.category">{{ props.row.category }}</div>
                </q-td>
                <q-td key="type" :props="props">
                  <div 
                    class="badge-pill" 
                    :class="props.row.type === 'Credit' ? ($q.dark.isActive ? 'bg-green-9 text-green-1' : 'bg-green-1 text-green-8') : ($q.dark.isActive ? 'bg-red-9 text-red-1' : 'bg-red-1 text-red-8')"
                  >
                    <q-icon :name="props.row.type === 'Credit' ? 'arrow_downward' : 'arrow_upward'" size="xs" class="q-mr-xs" />
                    {{ props.row.type === 'Credit' ? 'Income' : 'Expense' }}
                  </div>
                </q-td>
                <q-td key="amount" :props="props">
                  <div class="text-weight-bold" :class="props.row.type === 'Credit' ? 'text-green-7' : 'text-red-7'">
                    {{ props.row.type === 'Credit' ? '+' : '-' }} LKR {{ props.row.amount.toLocaleString() }}
                  </div>
                </q-td>
                  <q-td key="proof" :props="props">
                    <q-btn 
                      v-if="props.row.proofName" 
                      icon="description" 
                      :label="$q.screen.gt.xs ? 'View Proof' : ''" 
                      flat 
                      dense 
                      no-caps 
                      size="sm"
                      :class="$q.dark.isActive ? 'bg-blue-grey-8 text-blue-2' : 'bg-blue-1 text-blue-8'"
                      @click="viewDocument(props.row)"
                      class="q-px-sm"
                    >
                      <q-tooltip v-if="$q.screen.xs">View Proof</q-tooltip>
                    </q-btn>
                    <span v-else class="text-caption italic" :class="$q.dark.isActive ? 'text-grey-6' : 'text-grey-4'">No document</span>
                 </q-td>
                <q-td key="actions" :props="props">
                  <div v-if="userStore.isAdmin && route.query.mode === 'admin' && !props.row.isAggregate" class="q-gutter-sm">
                     <q-btn flat round dense icon="edit" size="sm" :class="$q.dark.isActive ? 'bg-grey-8 text-white' : 'bg-grey-2 text-grey-8'" @click="editTx(props.row)" />
                     <q-btn flat round dense icon="delete" size="sm" class="bg-red-1 text-negative" @click="deleteTx(props.row.id)" />
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <!-- Transaction Dialog (For Admin Edits) -->
    <q-dialog v-model="txDialog" transition-show="scale" transition-hide="scale">
      <q-card style="width: 500px; max-width: 90vw;" class="border-radius-lg">
        <q-card-section class="text-white" :class="$q.dark.isActive ? 'bg-blue-grey-9' : 'bg-primary'">
          <div class="text-h6">Edit Transaction</div>
        </q-card-section>

        <q-card-section class="q-gutter-md q-pt-lg">
           <q-input outlined v-model="txForm.date" label="Date" type="date" stack-label />
           <q-input outlined v-model="txForm.description" label="Description" />
           <div class="row q-col-gutter-sm">
              <div class="col-6">
                <q-select outlined v-model="txForm.type" :options="['Credit', 'Debit']" label="Type" />
              </div>
              <div class="col-6">
                <q-input outlined v-model.number="txForm.amount" label="Amount" type="number" prefix="LKR" />
              </div>
           </div>
           
           <q-file outlined v-model="txProofFile" label="Proof Document (Optional)" class="q-mt-sm">
              <template v-slot:prepend><q-icon name="cloud_upload" /></template>
           </q-file>
        </q-card-section>
        
        <q-card-actions align="right" class="q-pa-md" :class="$q.dark.isActive ? 'bg-blue-grey-10' : 'bg-grey-1'">
          <q-btn flat label="Cancel" :color="$q.dark.isActive ? 'white' : 'grey'" v-close-popup />
          <q-btn unelevated label="Save Changes" color="primary" @click="saveTx" />
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
  transactionStore.fetchAllData()
})
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', 'Roboto', sans-serif;
}
.container {
  max-width: 1200px;
}
.bg-gradient-primary {
  background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
}
.bg-white-20 {
  background: rgba(255, 255, 255, 0.2);
}
.opacity-80 { opacity: 0.8; }
.shadow-soft {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}
.border-radius-lg {
  border-radius: 12px;
}
.modern-table :deep(th) {
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.badge-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
}
.hover-bg-grey:hover {
  background-color: #f9fafb;
}
.transition-base {
  transition: background-color 0.2s;
}
.italic { font-style: italic; }
</style>
