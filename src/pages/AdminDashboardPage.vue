<template>
  <q-page class="font-inter" :class="$q.dark.isActive ? 'bg-blue-grey-10 text-white' : 'bg-indigo-1'">
    <!-- Header -->
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <h1 class="text-h4 text-weight-bold q-my-none" :class="$q.dark.isActive ? 'text-white' : 'text-indigo-9'">Admin Portal <span class="text-subtitle1 text-weight-regular vertical-middle q-ml-sm q-pl-sm" :class="$q.dark.isActive ? 'text-grey-4 border-left-dark' : 'text-indigo-4 border-left-indigo'">Dashboard</span></h1>
        <div class="text-subtitle2 q-mt-xs" :class="$q.dark.isActive ? 'text-grey-4' : 'text-indigo-5'">Manage funds, notices, and verifying documents</div>
      </div>
      <div class="q-gutter-sm">
        <q-btn 
          label="Master History" 
          icon="history" 
          unelevated 
          :class="$q.dark.isActive ? 'bg-blue-grey-8 text-white shadow-3' : 'bg-indigo-6 text-white shadow-3 hover-scale'"
          to="/history?mode=admin" 
          rounded 
        />
        <q-btn 
          label="Settings" 
          icon="settings" 
          unelevated 
          :class="$q.dark.isActive ? 'bg-blue-grey-9 text-grey-3 border-dark' : 'bg-white text-indigo-9 border-indigo'"
          @click="openSettings" 
          rounded
          no-caps 
        />
        <q-btn 
          label="Logout" 
          icon="logout" 
          :color="$q.dark.isActive ? 'red-9' : 'red-1'" 
          :text-color="$q.dark.isActive ? 'red-1' : 'red-7'"
          unelevated
          rounded
          @click="logout" 
          no-caps 
        />
      </div>
    </div>

    <div class="row q-col-gutter-lg">
      <!-- Notice Board Manager -->
      <div class="col-12 col-md-6">
        <q-card class="shadow-soft border-radius-lg h-full" :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white' : 'bg-white'">
          <q-card-section class="q-pa-md row items-center justify-between" :class="$q.dark.isActive ? 'bg-blue-grey-10 border-bottom-dark' : 'bg-white border-bottom-indigo'">
              <div class="text-subtitle1 text-weight-bold" :class="$q.dark.isActive ? 'text-white' : 'text-indigo-9'">
                 <div class="d-inline-block q-mr-sm q-pa-xs rounded-borders" :class="$q.dark.isActive ? 'bg-white-10' : 'bg-indigo-1'"><q-icon name="campaign" :class="$q.dark.isActive ? 'text-white' : 'text-indigo-6'" /></div> Notice Board
              </div>
              <q-btn label="Update Notice" :color="$q.dark.isActive ? 'grey-8' : 'indigo-6'" unelevated rounded size="sm" @click="saveNotice" />
           </q-card-section>
           <q-card-section class="q-pa-md">
              <q-input 
                outlined 
                v-model="noticeText" 
                label="Public Announcement" 
                placeholder="Enter important announcements here..." 
                hint="Visible on the homepage top banner."
                autogrow
                :bg-color="$q.dark.isActive ? 'blue-grey-10' : 'white'"
                :label-color="$q.dark.isActive ? 'grey-4' : 'grey-7'"
                :input-class="$q.dark.isActive ? 'text-white' : ''"
              />
           </q-card-section>
        </q-card>
      </div>

      <!-- Quick Actions -->
      <div class="col-12 col-md-6">
        <q-card class="shadow-soft border-radius-lg h-full" :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white' : 'bg-white'">
           <q-card-section class="q-pa-md" :class="$q.dark.isActive ? 'bg-blue-grey-10 border-bottom-dark' : 'bg-white border-bottom-indigo'">
              <div class="text-subtitle1 text-weight-bold" :class="$q.dark.isActive ? 'text-white' : 'text-indigo-9'">
                 <div class="d-inline-block q-mr-sm q-pa-xs rounded-borders" :class="$q.dark.isActive ? 'bg-white-10' : 'bg-amber-1'"><q-icon name="bolt" :class="$q.dark.isActive ? 'text-amber-4' : 'text-amber-8'" /></div> Quick Actions
              </div>
           </q-card-section>
           <q-card-section class="q-pa-md text-center row flex-center" style="min-height: 120px;">
              <div class="q-gutter-md">
                  <q-btn icon="add_circle" label="Add Income" color="green-6" unelevated rounded class="q-px-lg q-py-sm shadow-2 hover-scale" @click="openTxDialog('Credit')" />
                  <q-btn icon="remove_circle" label="Add Expense" color="deep-orange-5" unelevated rounded class="q-px-lg q-py-sm shadow-2 hover-scale" @click="openTxDialog('Debit')" />
              </div>
           </q-card-section>
        </q-card>
      </div>

      <!-- Student Records -->
      <div class="col-12">
        <q-card class="shadow-soft border-radius-lg" :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white' : 'bg-white'">
          <q-card-section class="q-pa-md row items-center justify-between" :class="$q.dark.isActive ? 'bg-blue-grey-10 border-bottom-dark' : 'bg-grey-1 border-bottom'">
             <div class="row items-center">
                <div class="d-inline-block q-mr-sm q-pa-xs rounded-borders" :class="$q.dark.isActive ? 'bg-white-10' : 'bg-indigo-1'"><q-icon name="table_chart" :class="$q.dark.isActive ? 'text-white' : 'text-indigo-6'" /></div>
                <div class="text-subtitle1 text-weight-bold" :class="$q.dark.isActive ? 'text-white' : 'text-indigo-9'">Student Payment Records</div>
             </div>
            <div class="q-gutter-sm">
               <q-btn 
                 dense flat icon="refresh" :color="$q.dark.isActive ? 'white' : 'indigo-6'"   
                 @click="fetchData" :loading="loading" 
               >
                 <q-tooltip>Refresh Data</q-tooltip>
               </q-btn>
               <q-btn 
                 label="Go to Sheet" 
                 icon-right="open_in_new" 
                 dense flat 
                 no-caps 
                 :text-color="$q.dark.isActive ? 'grey-4' : 'indigo-5'"  
                 href="https://docs.google.com/spreadsheets/d/11n36pHHwUtBPZ3RhO3mR4Eip7n9SVmD8HApfVNvAXBE/edit?usp=sharing"
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
              :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white' : ''"
              :rows-per-page-options="[10, 20, 50]"
              :loading="loading"
              virtual-scroll
              style="max-height: 500px;"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props" :class="$q.dark.isActive ? 'bg-blue-grey-10 text-grey-4' : 'bg-eef2ff text-indigo-9'">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props" :class="$q.dark.isActive ? 'hover-bg-dark' : 'hover-bg-grey'">
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <span v-if="col.name !== 'regNo' && col.name !== 'name' && props.row[col.field] > 0" class="text-weight-bold" :class="$q.dark.isActive ? 'text-green-4' : 'text-green-7'">
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
        <q-card class="shadow-soft border-radius-lg" :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white' : 'bg-white'">
           <q-card-section class="q-pa-md" :class="$q.dark.isActive ? 'bg-blue-grey-10 border-bottom-dark' : 'bg-white border-bottom-indigo'">
              <div class="text-subtitle1 text-weight-bold" :class="$q.dark.isActive ? 'text-white' : 'text-indigo-9'">Recent Special Transactions</div>
           </q-card-section>
           <q-card-section class="q-pa-none">
              <q-table
                :rows="transactionStore.sortedTransactions"
                :columns="txColumns"
                row-key="id"
                flat
                class="modern-table"
                :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white' : ''"
              >
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th v-for="col in props.cols" :key="col.name" :props="props" :class="$q.dark.isActive ? 'bg-blue-grey-10 text-grey-4' : 'bg-eef2ff text-indigo-9'">
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>

                 <template v-slot:body="props">
                    <q-tr :props="props" :class="$q.dark.isActive ? 'hover-bg-dark' : 'hover-bg-grey'">
                       <q-td key="date" :props="props">{{ props.row.date }}</q-td>
                       <q-td key="description" :props="props" class="text-weight-medium">{{ props.row.description }}</q-td>
                       <q-td key="type" :props="props">
                          <q-chip :color="props.row.type === 'Credit' ? ($q.dark.isActive ? 'green-9' : 'green-1') : ($q.dark.isActive ? 'red-9' : 'red-1')" :text-color="props.row.type === 'Credit' ? ($q.dark.isActive ? 'green-1' : 'green-9') : ($q.dark.isActive ? 'red-1' : 'red-9')" size="sm" class="text-weight-bold shadow-1">
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
        <q-card class="shadow-soft border-radius-lg h-full" :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white' : 'bg-white'">
          <q-card-section class="q-pa-md" :class="$q.dark.isActive ? 'bg-blue-grey-10 border-bottom-dark' : 'bg-white border-bottom-indigo'">
            <div class="text-subtitle1 text-weight-bold" :class="$q.dark.isActive ? 'text-white' : 'text-indigo-9'">Upload Center</div>
          </q-card-section>
          
          <q-card-section class="q-pa-md">
            <q-file 
              outlined 
              v-model="file" 
              label="Select Document" 
              counter
              dense
              :bg-color="$q.dark.isActive ? 'blue-grey-10' : 'white'"
              :label-color="$q.dark.isActive ? 'grey-4' : 'grey-7'"
              :input-class="$q.dark.isActive ? 'text-white' : ''"
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
              :bg-color="$q.dark.isActive ? 'blue-grey-10' : 'white'"
              :label-color="$q.dark.isActive ? 'grey-4' : 'grey-7'"
              :input-class="$q.dark.isActive ? 'text-white' : ''"
            />
            
            <q-btn 
              label="Upload & Link" 
              :color="$q.dark.isActive ? 'grey-8' : 'indigo-9'"  
              class="full-width q-mt-md shadow-2" 
              unelevated
              rounded
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
          <q-btn flat label="Cancel" v-close-popup :color="$q.dark.isActive ? 'white' : 'dark'" />
          <q-btn flat label="Save" :color="$q.dark.isActive ? 'amber-5' : 'indigo-6'" @click="saveTx" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Settings Dialog -->
    <q-dialog v-model="settingsDialog">
      <q-card style="width: 400px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Admin Settings</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <div class="text-subtitle2 text-grey-7">Verify Identity</div>
          <q-input filled v-model="settingsForm.currentUsername" label="Current Username" />
          <q-input 
            filled 
            v-model="settingsForm.currentPassword" 
            label="Current Password" 
            type="password" 
          />

          <q-separator class="q-my-sm" />
          
          <div class="text-subtitle2 text-grey-7">New Credentials (Standard Admin)</div>
          <q-input filled v-model="settingsForm.newUsername" label="New Username" />
          <q-input 
            filled 
            v-model="settingsForm.newPassword" 
            label="New Password" 
            type="password" 
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup :color="$q.dark.isActive ? 'white' : 'dark'" />
          <q-btn flat label="Update" :color="$q.dark.isActive ? 'amber-5' : 'indigo-6'" @click="saveSettings" />
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

// Settings
const settingsDialog = ref(false)
const settingsForm = reactive({
  currentUsername: '',
  currentPassword: '',
  newUsername: '',
  newPassword: ''
})

function openSettings() {
  settingsForm.currentUsername = ''
  settingsForm.currentPassword = ''
  settingsForm.newUsername = userStore.username
  settingsForm.newPassword = userStore.password // Pre-fill with current standard (optional convenience)
  settingsDialog.value = true
}

function saveSettings() {
  if (settingsForm.newUsername && settingsForm.newPassword) {
    const success = userStore.updateCredentials(
      settingsForm.currentUsername, 
      settingsForm.currentPassword, 
      settingsForm.newUsername, 
      settingsForm.newPassword
    )
    
    if (success) {
      $q.notify({ type: 'positive', message: 'Credentials updated successfully!' })
      settingsDialog.value = false
    } else {
      $q.notify({ type: 'negative', message: 'Verification failed. Checks credentials.' })
    }
  } else {
    $q.notify({ type: 'warning', message: 'New fields cannot be empty' })
  }
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
.border-left {
  border-left: 2px solid #e5e7eb;
}
.border-bottom {
  border-bottom: 1px solid #e5e7eb;
}
.border-grey {
  border: 1px solid #e5e7eb;
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

.hover-scale {
  transition: transform 0.2s;
}
.hover-scale:hover {
  transform: translateY(-2px);
}
.border-left-indigo {
  border-left: 2px solid #a5b4fc; /* indigo-3 */
}
.border-left-dark {
  border-left: 2px solid #94a3b8; /* slate-400 */
}
.border-bottom-indigo {
  border-bottom: 1px solid #e0e7ff; /* indigo-1/2 */
}
.border-bottom-dark {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.border-indigo {
  border: 1px solid #c7d2fe;
}
.border-dark {
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.modern-table :deep(th) {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  /* Colors handled dymamically in template now */
}
.bg-eef2ff {
  background-color: #eef2ff;
}
.hover-bg-dark:hover {
  background-color: rgba(255, 255, 255, 0.05); /* Slight light on hover */
}
.bg-white-10 {
  background-color: rgba(255, 255, 255, 0.1);
}
.d-inline-block { display: inline-block; }
</style>
