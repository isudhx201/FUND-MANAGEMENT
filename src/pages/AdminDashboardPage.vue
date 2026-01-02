<template>
  <q-page class="q-pa-md bg-grey-1 font-inter">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold q-my-none text-primary">Admin Dashboard</h1>
        <div class="text-subtitle2 text-grey-7 q-mt-xs">Manage funds, notices, and verifying documents</div>
      </div>
      <div class="q-gutter-sm">
        <q-btn 
          label="Master History" 
          icon="history" 
          unelevated 
          class="bg-white text-primary border-primary"
          to="/history?mode=admin" 
          no-caps 
        />
        <q-btn 
          label="Logout" 
          icon="logout" 
          color="red-1" 
          text-color="negative"
          unelevated
          @click="logout" 
          no-caps 
        />
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Notice Board Manager -->
      <div class="col-12 col-md-6">
        <q-card class="shadow-soft border-radius-lg bg-white h-full">
           <q-card-section class="q-pa-md border-bottom row items-center justify-between bg-grey-1">
              <div class="text-subtitle1 text-weight-bold">
                 <q-icon name="campaign" class="q-mr-sm text-primary" /> Notice Board
              </div>
              <q-btn label="Update Notice" color="primary" unelevated size="sm" @click="saveNotice" />
           </q-card-section>
           <q-card-section class="q-pa-md">
              <q-input 
                outlined 
                v-model="noticeText" 
                label="Public Announcement" 
                placeholder="Enter important announcements here..." 
                hint="Visible on the homepage top banner."
                autogrow
                bg-color="white"
              />
           </q-card-section>
        </q-card>
      </div>

      <!-- Quick Actions -->
      <div class="col-12 col-md-6">
        <q-card class="shadow-soft border-radius-lg bg-white h-full">
           <q-card-section class="q-pa-md border-bottom bg-grey-1">
              <div class="text-subtitle1 text-weight-bold">
                 <q-icon name="bolt" class="q-mr-sm text-warning" /> Quick Actions
              </div>
           </q-card-section>
           <q-card-section class="q-pa-md text-center row flex-center" style="min-height: 120px;">
              <div class="q-gutter-md">
                 <q-btn icon="add_circle" label="Add Income" color="green-6" unelevated Stack class="q-px-lg q-py-sm" @click="openTxDialog('Credit')" />
                 <q-btn icon="remove_circle" label="Add Expense" color="red-5" unelevated Stack class="q-px-lg q-py-sm" @click="openTxDialog('Debit')" />
              </div>
           </q-card-section>
        </q-card>
      </div>

      <!-- Student Records -->
      <div class="col-12">
        <q-card class="shadow-soft border-radius-lg bg-white">
          <q-card-section class="q-pa-md border-bottom row items-center justify-between bg-grey-1">
            <div class="row items-center">
               <q-icon name="table_chart" class="q-mr-sm text-grey-7" />
               <div class="text-subtitle1 text-weight-bold">Student Payment Records</div>
            </div>
            <div class="q-gutter-sm">
               <q-btn 
                 dense flat icon="refresh" color="primary" 
                 @click="fetchData" :loading="loading" 
               >
                 <q-tooltip>Refresh Data</q-tooltip>
               </q-btn>
               <q-btn 
                 label="Go to Sheet" 
                 icon-right="open_in_new" 
                 dense flat 
                 no-caps 
                 text-color="grey-8" 
                 href="https://docs.google.com/spreadsheets/d/e/2PACX-1vT_eEKqV-Aolo5VsDjcFXhrXxZcFIgNVGE2dy0r1ESZ4TFEzwZWA8DmFWrY04kY6VRFaUtEcDF_RWHW/pubhtml"
                 target="_blank"
               />
            </div>
          </q-card-section>
          
          <q-card-section class="q-pa-none">
            <q-table
              :rows="students"
              :columns="columns"
              row-key="id"
              flat
              class="sticky-header-table modern-table"
              :rows-per-page-options="[10, 20, 50]"
              :loading="loading"
              virtual-scroll
              style="max-height: 500px;"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props" class="bg-grey-1 text-grey-8">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props" class="hover-bg-grey">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <span v-if="col.name !== 'regNo' && col.name !== 'name' && props.row[col.field] > 0" class="text-green-7 text-weight-bold">
                       {{ props.row[col.field] }}
                    </span>
                    <span v-else>{{ props.row[col.field] }}</span>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

       <!-- Special Transactions Manager -->
      <div class="col-12">
        <q-card class="shadow-soft border-radius-lg bg-white">
           <q-card-section class="q-pa-md border-bottom bg-grey-1">
              <div class="text-subtitle1 text-weight-bold">Recent Special Transactions</div>
           </q-card-section>
           <q-card-section class="q-pa-none">
              <q-table
                :rows="transactionStore.sortedTransactions"
                :columns="txColumns"
                row-key="id"
                flat
                class="modern-table"
              >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th v-for="col in props.cols" :key="col.name" :props="props" class="bg-grey-1 text-grey-8">
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>

                 <template v-slot:body="props">
                    <q-tr :props="props" class="hover-bg-grey">
                       <q-td key="date" :props="props">{{ props.row.date }}</q-td>
                       <q-td key="description" :props="props" class="text-weight-medium">{{ props.row.description }}</q-td>
                       <q-td key="type" :props="props">
                          <q-chip :color="props.row.type === 'Credit' ? 'green-1' : 'red-1'" :text-color="props.row.type === 'Credit' ? 'green-9' : 'red-9'" size="sm" class="text-weight-bold">
                             {{ props.row.type }}
                          </q-chip>
                       </q-td>
                       <q-td key="amount" :props="props" class="text-right">
                          <span :class="props.row.type === 'Credit' ? 'text-positive' : 'text-negative'">
                             {{ props.row.amount }}
                          </span>
                       </q-td>
                        <q-td key="proof" :props="props">
                           <q-btn v-if="props.row.proofName" icon="description" flat round dense color="primary" size="sm">
                             <q-tooltip>{{ props.row.proofName }}</q-tooltip>
                           </q-btn>
                        </q-td>
                        <q-td key="actions" :props="props">
                          <div class="row justify-end q-gutter-sm">
                            <q-btn flat round dense icon="edit" size="sm" color="grey-7" @click="editTx(props.row)" />
                            <q-btn flat round dense icon="delete" size="sm" color="negative" @click="deleteTx(props.row.id)" />
                          </div>
                        </q-td>
                    </q-tr>
                 </template>
              </q-table>
           </q-card-section>
        </q-card>
      </div>

      <!-- Document Upload Section -->
      <div class="col-12 col-md-4">
        <q-card class="shadow-soft border-radius-lg bg-white h-full">
          <q-card-section class="q-pa-md border-bottom bg-grey-1">
            <div class="text-subtitle1 text-weight-bold">Upload Center</div>
          </q-card-section>
          
          <q-card-section class="q-pa-md">
            <q-file 
              outlined 
              v-model="file" 
              label="Select Document" 
              counter
              dense
            >
              <template v-slot:prepend><q-icon name="cloud_upload" /></template>
            </q-file>
            
            <q-select 
              outlined 
              v-model="linkedTx" 
              :options="txOptions"
              label="Link to Transaction"
              class="q-mt-md"
              dense
              options-dense
            />
            
            <q-btn 
              label="Upload & Link" 
              color="black" 
              class="full-width q-mt-md" 
              unelevated
              @click="uploadFile"
              :disable="!file"
            />
          </q-card-section>
        </q-card>
      </div>

    </div>

    <!-- Transaction Dialog -->
    <q-dialog v-model="txDialog">
      <q-card style="width: 500px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Edit' : 'Add' }} Transaction</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
           <q-input filled v-model="txForm.date" label="Date" type="date" stack-label />
           <q-input filled v-model="txForm.description" label="Description" />
           <!-- Type is pre-set by the action button -->
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
import { ref, onMounted, reactive, computed } from 'vue'

import { useRouter } from 'vue-router'
import { useTransactionStore } from 'stores/transaction-store'
import { useUserStore } from 'stores/user-store'
import { date, useQuasar } from 'quasar'

const transactionStore = useTransactionStore()
const userStore = useUserStore()
const router = useRouter()

// ... (Existing variables for file, docType, uploadedDocs, loading, students, columns, SHEET_URL) ...
const file = ref(null)
const docType = ref('Monthly Report')
const linkedTx = ref(null)
const uploadedDocs = ref([
  { id: 1, name: 'Dec_2025_Report.pdf', type: 'Monthly Report', date: '2026-01-01' },
])



const $q = useQuasar()

const txOptions = computed(() => {
  return transactionStore.sortedTransactions.map(t => ({
    label: `${t.date} - ${t.description} (${t.amount})`,
    value: t.id
  }))
})

// Notice Management
const noticeText = ref('')

function saveNotice() {
  transactionStore.updateNotice(noticeText.value)
  $q.notify({ type: 'positive', message: 'Notice updated successfully!' })
}

function logout() {
  userStore.logout()
  router.push('/login')
}

// Transaction Management
const txDialog = ref(false)
const isEditing = ref(false)
const txProofFile = ref(null)
const txForm = reactive({
  id: null,
  date: date.formatDate(Date.now(), 'YYYY-MM-DD'),
  description: '',
  type: 'Debit',
  amount: ''
})

const txColumns = [
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'description', label: 'Description', field: 'description', align: 'left' },
  { name: 'type', label: 'Type', field: 'type', align: 'center' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right' },
  { name: 'proof', label: 'Proof', field: 'proofName', align: 'center' },
  { name: 'actions', label: 'Actions', align: 'right' }
]

function openTxDialog(type = 'Debit') {
  isEditing.value = false
  txForm.id = null
  txForm.date = date.formatDate(Date.now(), 'YYYY-MM-DD')
  txForm.description = ''
  txForm.type = type
  txForm.amount = ''
  txProofFile.value = null
  txDialog.value = true
}

function editTx(row) {
  isEditing.value = true
  txForm.id = row.id
  txForm.date = row.date
  txForm.description = row.description
  txForm.type = row.type
  txForm.amount = row.amount
  txProofFile.value = null // reset file input on edit, keep old if not changed? simplistic link for now
  txDialog.value = true
}

function deleteTx(id) {
  if(confirm('Are you sure?')) {
     transactionStore.deleteTransaction(id)
  }
}

function saveTx() {
  if (txProofFile.value) {
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
    // Preserve existing proof data if editing and no new file selected
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
      // If adding new without file, proofName is null
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

const students = computed(() => transactionStore.students)
const loading = computed(() => transactionStore.loading)
const columns = computed(() => {
  if (students.value.length === 0) return []
  
  const coreFields = [
    { name: 'regNo', label: 'Registration No.', field: 'regNo', align: 'left', sortable: true },
    { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true }
  ]
  
  const MONTH_LIST = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
  const monthCols = []
  
  MONTH_LIST.forEach(m => {
    const hasPayment = students.value.some(row => row[m] > 0)
    if (hasPayment) {
      monthCols.push({
        name: m,
        label: m.charAt(0).toUpperCase() + m.slice(1),
        field: m,
        align: 'right',
        sortable: true
      })
    }
  })
  
  return [...coreFields, ...monthCols]
})

function uploadFile() {
  if (file.value) {
    if (file.value.size > 2 * 1024 * 1024) {
      alert('File is too large for local storage demonstration (Limit: 2MB).')
      return;
    }

    const docName = file.value.name
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const docData = e.target.result
      
      uploadedDocs.value.unshift({
        id: Date.now(),
        name: docName,
        type: docType.value,
        date: new Date().toISOString().split('T')[0]
      })
      
      if (linkedTx.value) {
        transactionStore.linkDocument(linkedTx.value.value, docName, docData)
        linkedTx.value = null
      }

      file.value = null
    }
    
    reader.readAsDataURL(file.value)
  }
}

function fetchData() {
  transactionStore.fetchAllData()
}

onMounted(async () => {
  await transactionStore.fetchAllData()
  noticeText.value = transactionStore.notice
})
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', 'Roboto', sans-serif;
}
.shadow-soft {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.border-radius-lg {
  border-radius: 12px;
}
.border-bottom {
  border-bottom: 1px solid #e5e7eb;
}
.border-primary {
  border: 1px solid #4f46e5;
}
.h-full { height: 100%; }
.modern-table :deep(th) {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.hover-bg-grey:hover {
  background-color: #f9fafb;
}
</style>
