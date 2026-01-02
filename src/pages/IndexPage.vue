<template>
  <q-page class="bg-white text-black">
    <!-- Notice Strip -->
    <div v-if="transactionStore.notice" class="bg-amber-9 text-black q-py-sm q-px-md text-center text-subtitle1 text-weight-bold row items-center justify-center">
       <q-icon name="campaign" size="sm" class="q-mr-sm" />
       {{ transactionStore.notice }}
    </div>

    <!-- Hero Section / Fund Status -->
    <div class="hero-section relative-position flex flex-center text-center text-white overflow-hidden">
      <q-img
        src="~assets/hero-bg.png"
        class="absolute-full hero-bg"
        fit="cover"
      >
        <div class="absolute-full bg-black-overlay flex flex-center column">
          <div class="q-mb-md animate-fade-up">
            <div class="text-subtitle1 text-uppercase text-weight-bold q-mb-sm text-grey-4 ls-2">Total Current Balance</div>
            <h1 class="text-h1 text-weight-bolder q-mt-none q-mb-sm hero-balance">
              {{ totalFundsFormatted }}
            </h1>
            <div class="text-caption text-grey-4 q-mb-xl">
              <q-icon name="update" class="q-mr-xs" />
              Last Updated: {{ lastUpdated }}
            </div>
          </div>
          
          <div class="q-gutter-md animate-fade-up delay-200">
            <q-btn 
              to="/payment-details"
              color="white" 
              text-color="black" 
              size="lg" 
              label="View Payment Details" 
              no-caps 
              class="text-weight-bold q-px-xl btn-hover-scale"
            />
          </div>
        </div>
      </q-img>
    </div>

    <!-- Live Transparency Dashboard -->
    <div class="q-py-xl bg-grey-2">
      <div class="container q-mx-auto q-px-md">
        
        <!-- Summary Cards (At a Glance) -->
        <div class="row q-col-gutter-md q-mb-xl animate-fade-up">
          <div class="col-12 col-sm-6 col-md-3">
             <q-card flat class="bg-white text-black text-center shadow-1 full-height">
               <q-card-section>
                 <q-icon name="account_balance_wallet" size="md" color="primary" class="q-mb-sm" />
                 <div class="text-subtitle2 text-uppercase text-grey-7">Total Fund Balance</div>
                 <div class="text-h4 text-weight-bold q-mt-xs">{{ totalFundsFormatted }}</div>
               </q-card-section>
             </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
             <q-card flat class="bg-white text-black text-center shadow-1 full-height">
               <q-card-section>
                 <q-icon name="savings" size="md" color="green-7" class="q-mb-sm" />
                 <div class="text-subtitle2 text-uppercase text-grey-7">Total Collected</div>
                 <div class="text-h4 text-weight-bold q-mt-xs">{{ totalCollectedFormatted }}</div>
               </q-card-section>
             </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
             <q-card flat class="bg-white text-black text-center shadow-1 full-height">
               <q-card-section>
                 <q-icon name="payments" size="md" color="red-7" class="q-mb-sm" />
                 <div class="text-subtitle2 text-uppercase text-grey-7">Total Spent</div>
                 <div class="text-h4 text-weight-bold q-mt-xs">{{ totalSpentFormatted }}</div>
               </q-card-section>
             </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
             <q-card flat class="bg-white text-black text-center shadow-1 full-height">
               <q-card-section>
                 <q-icon name="groups" size="md" color="orange-8" class="q-mb-sm" />
                 <div class="text-subtitle2 text-uppercase text-grey-7">Participation Rate</div>
                 <div class="text-h4 text-weight-bold q-mt-xs">{{ participationRate }}%</div>
                 <div class="text-caption text-grey-6">{{ activeStudentsCount }} / {{ totalStudentsCount }} Students</div>
               </q-card-section>
             </q-card>
          </div>
        </div>

        <div class="row items-center q-mb-lg">
          <div class="col">
            <h2 class="text-h4 text-weight-bold q-my-none">Live Transparency Dashboard</h2>
            <div class="text-subtitle2 text-grey-7">Real-time proof of fund management</div>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Recent Transactions -->
           <div class="col-12 col-md-5">
            <q-card flat class="bg-white full-height shadow-1">
              <q-card-section>
                <div class="row items-center justify-between q-mb-md">
                   <div class="text-h6 text-weight-bold">Recent Transactions</div>
                   <q-btn flat dense no-caps color="primary" label="Show More" icon-right="arrow_forward" to="/history" />
                </div>
                
                <div v-if="transactionStore.allTransactions.length === 0" class="text-center text-grey-6 q-py-xl">
                  No transactions recorded yet.
                </div>
                <q-table
                  v-else
                  :rows="transactionStore.allTransactions.slice(0, 5)"
                  :columns="columns"
                  row-key="id"
                  flat
                  hide-pagination
                  :rows-per-page-options="[0]"
                  class="transaction-table"
                >
                  <template v-slot:body-cell-type="props">
                    <q-td :props="props">
                      <q-chip 
                        :color="props.row.type === 'Credit' ? 'black' : 'grey-4'" 
                        :text-color="props.row.type === 'Credit' ? 'white' : 'black'"
                        dense 
                        square
                        class="text-weight-bold"
                      >
                        {{ props.row.type }}
                      </q-chip>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-amount="props">
                    <q-td :props="props" class="text-weight-bold">
                       {{ props.row.type === 'Credit' ? '+' : '-' }}{{ props.row.amount.toLocaleString() }}
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>

          <!-- Fund Status Graph -->
          <div class="col-12 col-md-4">
             <q-card flat class="bg-white full-height shadow-1">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">Fund Growth</div>
                <div style="height: 300px; position: relative;">
                  <Line :data="chartData" :options="chartOptions" />
                </div>
              </q-card-section>
            </q-card>
          </div>
          
           <!-- Key Features / Tools (Short) -->
          <div class="col-12 col-md-3">
             <q-card flat class="bg-black text-white full-height shadow-1">
              <q-card-section class="flex column justify-between full-height">
                <div>
                  <div class="row items-center q-mb-md">
                     <q-icon name="lock" size="sm" class="q-mr-sm" />
                     <div class="text-h6 text-weight-bold">Document Vault</div>
                  </div>
                  <p class="text-grey-4 text-body2">
                    Access monthly PDF reports, meeting minutes, and verify receipts for every large purchase securely.
                  </p>
                </div>
                <div class="q-mt-md">
                  <q-list dark>
                    <q-item clickable v-ripple to="/documents">
                      <q-item-section avatar>
                         <q-icon name="description" />
                      </q-item-section>
                      <q-item-section>Monthly Reports</q-item-section>
                      <q-item-section side>
                        <q-icon name="chevron_right" color="white" />
                      </q-item-section>
                    </q-item>
                    <q-separator dark inset />
                     <q-item clickable v-ripple to="/documents">
                      <q-item-section avatar>
                         <q-icon name="receipt_long" />
                      </q-item-section>
                      <q-item-section>Receipts</q-item-section>
                       <q-item-section side>
                        <q-icon name="chevron_right" color="white" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-card-section>
            </q-card>
          </div>

        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="bg-black text-white q-py-lg text-center">
      <div class="text-subtitle2 q-mb-sm">Batch Fund Management System &copy; 2026</div>
      <div class="text-caption text-grey-5">Designed for Excellence</div>
    </div>
  </q-page>
</template>

<style scoped>
.hero-section {
  height: 85vh;
  width: 100%;
}

.bg-black-overlay {
  background: rgba(0, 0, 0, 0.7);
}

.container {
  max-width: 1400px;
}

.ls-2 {
  letter-spacing: 3px;
}

.hero-balance {
  font-size: 4rem;
  line-height: 1.1;
}

@media (max-width: 600px) {
  .hero-balance {
    font-size: 2.5rem;
  }
}

.btn-hover-scale {
  transition: transform 0.2s;
}

.btn-hover-scale:hover {
  transform: scale(1.05);
}

.transaction-table :deep(th) {
  font-weight: bold;
  font-size: 0.9rem;
  color: #424242; /* secondary color value */
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { date } from 'quasar'
import { useTransactionStore } from 'stores/transaction-store'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const transactionStore = useTransactionStore()
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_eEKqV-Aolo5VsDjcFXhrXxZcFIgNVGE2dy0r1ESZ4TFEzwZWA8DmFWrY04kY6VRFaUtEcDF_RWHW/pub?output=csv'

const loading = ref(true)
const students = ref([])
const lastUpdated = ref(date.formatDate(Date.now(), 'MMM DD, YYYY'))

// Stats Logic
const sheetCollected = computed(() => {
  let sum = 0
  students.value.forEach(row => {
    Object.keys(row).forEach(key => {
      if (key !== 'id' && key !== 'name' && key !== 'regNo') {
        const val = parseFloat(row[key])
        if (!isNaN(val)) sum += val
      }
    })
  })
  return sum
})

const totalCollected = computed(() => sheetCollected.value + transactionStore.specialIncome)
const totalSpent = computed(() => transactionStore.specialExpenses)
const totalFunds = computed(() => totalCollected.value - totalSpent.value)

// Formatters
const totalFundsFormatted = computed(() => 'LKR ' + totalFunds.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
const totalCollectedFormatted = computed(() => 'LKR ' + totalCollected.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
const totalSpentFormatted = computed(() => 'LKR ' + totalSpent.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))

// Participation Stats
const totalStudentsCount = computed(() => students.value.length || 0)

const activeStudentsCount = computed(() => {
  return students.value.filter(row => {
    let s = 0
    Object.keys(row).forEach(key => {
      if (key !== 'id' && key !== 'name' && key !== 'regNo') {
         const val = parseFloat(row[key])
         if (!isNaN(val)) s += val
      }
    })
    return s > 0
  }).length
})

const participationRate = computed(() => {
  if (totalStudentsCount.value === 0) return 0
  return ((activeStudentsCount.value / totalStudentsCount.value) * 100).toFixed(1)
})

// Chart Data (Cumulative Monthly Balance)
const chartData = computed(() => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const fullMonths = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
  
  let currentBalance = 0
  const dataPoints = months.map((m, index) => {
     const monthKey = fullMonths[index]
     
     // 1. Sheet Aggregates for this month
     // Find aggregate in store
     const agg = transactionStore.monthlyAggregations.find(a => a.id === `monthly-${monthKey}`)
     const aggAmount = agg ? agg.amount : 0
     
     // 2. Special Transactions for this month
     // Filter transactions where date is in this month (assuming 2026? or current year)
     // Store dates are YYYY-MM-DD.
     // Simple check: month index + 1
     const targetMonth = String(index + 1).padStart(2, '0')
     const specialCredits = transactionStore.transactions
       .filter(t => t.date.substring(5, 7) === targetMonth && t.type === 'Credit')
       .reduce((s, t) => s + parseFloat(t.amount || 0), 0)
       
     const specialDebits = transactionStore.transactions
       .filter(t => t.date.substring(5, 7) === targetMonth && t.type === 'Debit')
       .reduce((s, t) => s + parseFloat(t.amount || 0), 0)
       
     currentBalance += (aggAmount + specialCredits - specialDebits)
     return currentBalance
  })

  return {
    labels: months,
    datasets: [
      {
        label: 'Total Fund Balance',
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Black/Grey theme
        borderColor: '#000000',
        data: dataPoints,
        fill: true,
        tension: 0.4, // Smooth curve
        pointRadius: 3,
        pointBackgroundColor: '#000000'
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { 
       mode: 'index', 
       intersect: false,
       callbacks: {
         label: (context) => ' LKR ' + context.parsed.y.toLocaleString()
       }
    }
  },
  scales: {
    x: { grid: { display: false } },
    y: { 
       grid: { color: '#f0f0f0' },
       ticks: { callback: (val) => val >= 1000 ? (val/1000) + 'k' : val }
    }
  }
}

const columns = [
  { name: 'date', align: 'left', label: 'Date', field: 'date' },
  { name: 'desc', align: 'left', label: 'Description', field: 'description' },
  { name: 'type', align: 'center', label: 'Type', field: 'type' },
  { name: 'amount', align: 'right', label: 'Amount (LKR)', field: 'amount' },
]

async function fetchData() {
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
    students.value = rows
    loading.value = false
  } catch (error) {
    console.error('Error loading sheet data:', error)
  }
}

onMounted(() => {
  fetchData()
  transactionStore.fetchSheetData()
})
</script>
