<template>
  <q-page class="q-pa-md bg-grey-1">
    <div class="container q-mx-auto">
       <div class="row items-center justify-between q-mb-lg">
          <div>
            <h1 class="text-h4 text-weight-bold q-my-sm">Payment Details</h1>
            <div class="text-subtitle2 text-grey-7">Transparency Report - Student Contributions</div>
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
        <!-- Search and Filter (Optional) -->
        <q-card-section>
          <q-input 
            v-model="filter" 
            filled 
            dense 
            placeholder="Search by Name or Reg No..." 
            color="black"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <q-table
            :rows="students"
            :columns="columns"
            row-key="id"
            flat
            :filter="filter"
            :loading="loading"
            :pagination="{ rowsPerPage: 25 }"
          >
             <template v-slot:body-cell-status="props">
                <q-td :props="props">
                   <q-chip 
                    :color="props.value === 'Paid' ? 'green-2' : 'grey-3'" 
                    size="sm" 
                    dense
                  >
                    {{ props.value }}
                  </q-chip>
                </q-td>
             </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_eEKqV-Aolo5VsDjcFXhrXxZcFIgNVGE2dy0r1ESZ4TFEzwZWA8DmFWrY04kY6VRFaUtEcDF_RWHW/pub?output=csv'

const loading = ref(true)
const students = ref([])
const columns = ref([])
const filter = ref('')

// Helper to check if a string is a month name
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

function parseCSV(csvText) {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  // Separate core columns from month columns
  const coreHeaders = []
  const monthHeaders = []
  
  headers.forEach((h, index) => {
    if (MONTHS.includes(h.toLowerCase())) {
        monthHeaders.push({ name: h, index })
    } else {
        coreHeaders.push({ name: h, index })
    }
  })

  // Sort months: Reorder to show the "Recent" (Last in the sheet usually) first.
  // Assuming the sheet adds months L->R, we reverse them.
  monthHeaders.reverse();

  // Reconstruct headers order: Reg No, Name, [Latest Month], [Prev Month]...
  const sortedHeadersIndices = [
      ...coreHeaders.map(ch => ch.index),
      ...monthHeaders.map(mh => mh.index)
  ]

  // Generate QTable columns
  const cols = sortedHeadersIndices.map(originalIndex => {
    const h = headers[originalIndex];
    let field = h.toLowerCase().replace(/[\s.]/g, '_');
    
    if (h === 'Registration No.') field = 'regNo';
    if (h === 'Name') field = 'name';
    
    // For months, we generally assume they are numbers (Fees)
    const isMonth = MONTHS.includes(h.toLowerCase());

    return {
      name: field,
      label: h,
      field: field,
      sortable: true,
      align: isMonth ? 'right' : 'left',
      // Format numeric values
      format: isMonth ? (val) => (val ? `LKR ${val}` : '-') : undefined
    }
  });

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length < headers.length) continue;

    const row = { id: i };
    // Map using the original headers structure first
    headers.forEach((h, index) => {
      let field = h.toLowerCase().replace(/[\s.]/g, '_');
      if (h === 'Registration No.') field = 'regNo';
      if (h === 'Name') field = 'name';
      
      row[field] = currentLine[index]?.trim() || '';
    });
    rows.push(row);
  }
  
  return { cols, rows };
}

async function fetchData() {
  try {
    const response = await axios.get(SHEET_URL)
    const { cols, rows } = parseCSV(response.data)
    columns.value = cols
    students.value = rows
    loading.value = false
  } catch (error) {
    console.error('Error loading sheet data:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
