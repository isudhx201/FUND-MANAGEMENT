<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="row q-col-gutter-lg">
      <div class="col-12 row items-center justify-between">
        <h1 class="text-h4 text-weight-bold q-my-sm">Admin Dashboard</h1>
         <q-btn label="View Master History" icon="history" outline color="black" to="/history?mode=admin" no-caps />
      </div>

      <!-- Notice Board Manager -->
      <div class="col-12">
        <q-card flat bordered class="bg-white">
           <q-card-section class="row items-center justify-between">
              <div class="text-h6 text-weight-bold">Notice Board Manager</div>
              <q-btn label="Update Notice" color="black" icon="campaign" @click="saveNotice" />
           </q-card-section>
           <q-card-section>
              <q-input 
                filled 
                v-model="noticeText" 
                label="Public Notice Message" 
                placeholder="Enter important announcements here..." 
                hint="This message will appear at the top of the homepage."
                autogrow
              />
           </q-card-section>
        </q-card>
      </div>

      <!-- Document Upload Section -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-white">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">Upload & Link Documents</div>
            <q-file 
              filled 
              bottom-slots 
              v-model="file" 
              label="Select File" 
              counter
              color="black"
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" @click.stop.prevent />
              </template>
              <template v-slot:append>
                <q-icon name="close" @click.stop.prevent="file = null" class="cursor-pointer" />
              </template>
            </q-file>
            
            <q-select 
              filled 
              v-model="linkedTx" 
              :options="txOptions"
              label="Link to Transaction (Optional)"
              class="q-mt-md"
              color="black"
              menu-anchor="bottom left"
              menu-self="top left"
            />
            
            <q-btn 
              label="Upload & Link" 
              color="black" 
              class="full-width q-mt-md" 
              @click="uploadFile"
              :disable="!file"
            />
          </q-card-section>
          
          <q-separator />
          
          <q-card-section>
            <div class="text-subtitle2 q-mb-sm">Recent Uploads</div>
            <q-list separator dense>
              <q-item v-for="doc in uploadedDocs" :key="doc.id">
                <q-item-section avatar>
                  <q-icon name="description" color="grey-7" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ doc.name }}</q-item-label>
                  <q-item-label caption>{{ doc.type }} - {{ doc.date }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Student Details Excel Sheet -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="bg-white">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6 text-weight-bold">Student Payment Records (Live Verification)</div>
            <div class="q-gutter-sm">
               <q-btn icon="refresh" label="Refresh Data" dense flat no-caps color="primary" @click="fetchData" :loading="loading" />
               <q-btn 
                 icon="open_in_new" 
                 label="Edit Sheet" 
                 dense 
                 outline 
                 no-caps 
                 color="black" 
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
              class="sticky-header-table"
              :rows-per-page-options="[10, 20, 0]"
              :loading="loading"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td v-for="col in columns" :key="col.name" :props="props">
                    {{ props.row[col.field] }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>

       <!-- Special Transactions Manager -->
      <div class="col-12">
        <q-card flat bordered class="bg-white">
           <q-card-section class="row items-center justify-between">
              <div class="text-h6 text-weight-bold">Special Transactions (Expenses / Other Income)</div>
              <div class="q-gutter-sm">
                <q-btn icon="add_circle" label="Add New Payment" color="green-7" no-caps @click="openTxDialog('Credit')" />
                <q-btn icon="remove_circle" label="Add New Receipt" color="red-7" no-caps @click="openTxDialog('Debit')" />
              </div>
           </q-card-section>
           <q-card-section>
              <q-table
                :rows="transactionStore.sortedTransactions"
                :columns="txColumns"
                row-key="id"
                flat
              >
                <template v-slot:body-cell-proof="props">
                  <q-td :props="props">
                     <q-btn v-if="props.row.proofName" icon="description" flat round dense color="primary" :title="props.row.proofName" />
                     <span v-else>-</span>
                  </q-td>
                </template>
                <template v-slot:body-cell-actions="props">
                  <q-td :props="props">
                    <q-btn flat round dense icon="edit" color="grey-8" @click="editTx(props.row)" />
                    <q-btn flat round dense icon="delete" color="negative" @click="deleteTx(props.row.id)" />
                  </q-td>
                </template>
              </q-table>
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
import axios from 'axios'
import { useTransactionStore } from 'stores/transaction-store'
import { date, useQuasar } from 'quasar'

const transactionStore = useTransactionStore()

// ... (Existing variables for file, docType, uploadedDocs, loading, students, columns, SHEET_URL) ...
const file = ref(null)
const docType = ref('Monthly Report')
const linkedTx = ref(null)
const uploadedDocs = ref([
  { id: 1, name: 'Dec_2025_Report.pdf', type: 'Monthly Report', date: '2026-01-01' },
])
const loading = ref(false)
const students = ref([])
const columns = ref([])

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_eEKqV-Aolo5VsDjcFXhrXxZcFIgNVGE2dy0r1ESZ4TFEzwZWA8DmFWrY04kY6VRFaUtEcDF_RWHW/pub?output=csv'
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

// ... (Existing parseCSV, fetchData, uploadFile, onMounted) ...
function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Generate columns dynamically
  const cols = headers.map((h, index) => {
    // Basic mapping
    let label = h;
    let field = h.toLowerCase().replace(/[\s.]/g, '_'); // simple slug
    
    // Explicit mappings based on known structure
    if (h === 'Registration No.') field = 'regNo';
    if (h === 'Name') field = 'name';
    
    return {
      name: field,
      label: label,
      field: field,
      sortable: true,
      align: index === 0 ? 'left' : (index === 1 ? 'left' : 'right')
    }
  });

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length < headers.length) continue; // Skip malformed lines

    const row = { id: i };
    headers.forEach((h, index) => {
      let field = cols[index].field;
      row[field] = currentLine[index]?.trim() || '';
    });
    rows.push(row);
  }
  
  return { cols, rows };
}

async function fetchData() {
  loading.value = true;
  try {
    const response = await axios.get(SHEET_URL + '&t=' + Date.now());
    const { cols, rows } = parseCSV(response.data);
    columns.value = cols;
    students.value = rows;
  } catch (error) {
    console.error('Error fetching sheet data:', error);
  } finally {
    loading.value = false;
  }
}

function uploadFile() {
  if (file.value) {
    // Size check (Limit to 2MB for localStorage safety)
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
        // Pass the base64 data to the store
        transactionStore.linkDocument(linkedTx.value.value, docName, docData)
        linkedTx.value = null
      }

      file.value = null
    }
    
    reader.readAsDataURL(file.value)
  }
}

onMounted(() => {
  fetchData();
  noticeText.value = transactionStore.notice
})
</script>
