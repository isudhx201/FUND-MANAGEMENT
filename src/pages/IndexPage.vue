<template>
  <q-page class="bg-grey-1 text-black font-inter">
    <!-- Modern Notice Strip -->
    <div v-if="transactionStore.notice" class="bg-gradient-warning text-black q-py-sm q-px-md text-center text-subtitle2 text-weight-bold row items-center justify-center shadow-2">
       <q-icon name="campaign" size="xs" class="q-mr-sm" />
       {{ transactionStore.notice }}
    </div>

    <!-- Modern Hero Section -->
    <section class="hero-section relative-position flex flex-center text-white overflow-hidden">
      <!-- Background with Overlay -->
      <q-img
        src="~assets/hero-bg.png"
        class="absolute-full hero-bg"
        fit="cover"
        style="z-index: 0;"
      >
        <template v-slot:loading>
          <div class="text-white">Loading...</div>
        </template>
      </q-img>
      
      <!-- Gradient Overlay -->
      <div class="absolute-full bg-gradient-overlay" style="z-index: 1;"></div>

      <!-- Hero Content -->
      <div class="relative-position container q-mx-auto q-px-md full-height flex flex-center column text-center" style="z-index: 2;">
        
        <!-- Glass Card for Balance -->
        <div class="glass-card q-pa-xl q-mb-xl animate-fade-up">
           <div class="text-overline text-uppercase text-weight-bold q-mb-sm text-white opacity-80 ls-2">Total Current Fund</div>
           <h1 class="text-h1 text-weight-bolder q-my-sm hero-balance text-gradient">
             {{ totalFundsFormatted }}
           </h1>
           <div class="text-caption text-grey-3 q-mt-md flex flex-center">
             <div class="q-px-sm q-py-xs bg-white-10 rounded-borders row items-center">
               <q-icon name="update" class="q-mr-xs" size="xs" />
               <span>Last Updated: {{ lastUpdated }}</span>
             </div>
           </div>
        </div>
        
        <!-- Call to Action -->
        <div class="q-gutter-md animate-fade-up delay-100">
          <q-btn 
            to="/payment-details"
            color="white" 
            text-color="primary" 
            size="lg" 
            rounded
            no-caps 
            class="text-weight-bold q-px-xl btn-hover-lift shadow-lg"
          >
            <div class="row items-center">
              <span>View Payment Details</span>
              <q-icon name="arrow_forward" class="q-ml-sm" size="xs" />
            </div>
          </q-btn>
        </div>
      </div>
    </section>

    <!-- Stats Section (Floating Overlap) -->
    <div class="container q-mx-auto q-px-md relative-position" style="margin-top: -80px; z-index: 3;">
       <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-3 col-sm-6 animate-fade-up delay-200">
             <q-card class="stat-card bg-white text-black shadow-3 full-height border-radius-lg">
               <q-card-section class="q-pa-lg">
                 <div class="row items-center justify-between q-mb-md">
                    <div class="icon-box bg-blue-1 text-primary">
                       <q-icon name="account_balance_wallet" size="sm" />
                    </div>
                    <!-- Sparkline placeholder or trend icon -->
                    <q-icon name="trending_up" color="positive" />
                 </div>
                 <div class="text-caption text-grey-7 text-uppercase text-weight-bold ls-1">Fund Balance</div>
                 <div class="text-h5 text-weight-bolder q-mt-xs text-primary">{{ totalFundsFormatted }}</div>
               </q-card-section>
             </q-card>
          </div>
          
          <div class="col-12 col-md-3 col-sm-6 animate-fade-up delay-300">
             <q-card class="stat-card bg-white text-black shadow-3 full-height border-radius-lg">
               <q-card-section class="q-pa-lg">
                 <div class="row items-center justify-between q-mb-md">
                    <div class="icon-box bg-green-1 text-green-7">
                       <q-icon name="savings" size="sm" />
                    </div>
                 </div>
                 <div class="text-caption text-grey-7 text-uppercase text-weight-bold ls-1">Total Collected</div>
                 <div class="text-h5 text-weight-bolder q-mt-xs text-green-8">{{ totalCollectedFormatted }}</div>
               </q-card-section>
             </q-card>
          </div>

          <div class="col-12 col-md-3 col-sm-6 animate-fade-up delay-400">
             <q-card class="stat-card bg-white text-black shadow-3 full-height border-radius-lg">
               <q-card-section class="q-pa-lg">
                 <div class="row items-center justify-between q-mb-md">
                    <div class="icon-box bg-red-1 text-red-7">
                       <q-icon name="payments" size="sm" />
                    </div>
                 </div>
                 <div class="text-caption text-grey-7 text-uppercase text-weight-bold ls-1">Total Spent</div>
                 <div class="text-h5 text-weight-bolder q-mt-xs text-red-8">{{ totalSpentFormatted }}</div>
               </q-card-section>
             </q-card>
          </div>

          <div class="col-12 col-md-3 col-sm-6 animate-fade-up delay-500">
             <q-card class="stat-card bg-white text-black shadow-3 full-height border-radius-lg">
               <q-card-section class="q-pa-lg">
                 <div class="row items-center justify-between q-mb-md">
                    <div class="icon-box bg-orange-1 text-orange-8">
                       <q-icon name="groups" size="sm" />
                    </div>
                    <div class="text-caption text-orange-8 bg-orange-1 q-px-sm rounded-borders text-weight-bold">{{ participationRate }}% Active</div>
                 </div>
                 <div class="text-caption text-grey-7 text-uppercase text-weight-bold ls-1">Activity</div>
                 <div class="text-h5 text-weight-bolder q-mt-xs">{{ activeStudentsCount }} / {{ totalStudentsCount }}</div>
               </q-card-section>
             </q-card>
          </div>
       </div>
    </div>

    <!-- Dashboard Main Content -->
    <div class="q-py-xl bg-grey-1">
      <div class="container q-mx-auto q-px-md">
        
        <div class="row items-center q-mb-xl">
          <div class="col-12 text-center">
            <h2 class="text-h3 text-weight-bolder q-mb-sm text-primary">Live Dashboard</h2>
            <div class="text-subtitle1 text-grey-7" style="max-width: 600px; margin: 0 auto;">
              Transparency is our priority. Monitor real-time fund flow and growth.
            </div>
            <div class="h-1 w-20 bg-primary q-mx-auto q-mt-md rounded-borders"></div>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Recent Transactions Feed -->
           <div class="col-12 col-md-5">
            <q-card class="bg-white shadow-soft full-height border-radius-lg overflow-hidden">
              <q-card-section class="q-pa-lg row items-center justify-between bg-grey-1 border-bottom">
                 <div class="text-h6 text-weight-bold text-blue-grey-9">Recent Activity</div>
                 <q-btn flat dense no-caps color="primary" label="View All" icon-right="arrow_forward" to="/history" class="text-weight-bold" />
              </q-card-section>
              
              <q-card-section class="q-pa-none">
                 <div v-if="transactionStore.allTransactions.length === 0" class="text-center text-grey-5 q-py-xl column flex-center">
                   <q-icon name="receipt" size="lg" class="q-mb-sm opacity-50" />
                   <div>No transactions recorded yet.</div>
                 </div>
                 <q-list separator v-else>
                    <q-item v-for="tx in transactionStore.allTransactions.slice(0, 5)" :key="tx.id" class="q-py-md hover-bg-grey transition-base">
                       <q-item-section avatar>
                          <div class="avatar-icon flex flex-center" :class="tx.type === 'Credit' ? 'bg-green-1 text-green-7' : 'bg-red-1 text-red-7'">
                             <q-icon :name="tx.type === 'Credit' ? 'arrow_downward' : 'arrow_upward'" size="xs" />
                          </div>
                       </q-item-section>
                       <q-item-section>
                          <q-item-label class="text-weight-bold text-subtitle2">{{ tx.description }}</q-item-label>
                          <q-item-label caption class="text-grey-6">{{ tx.date }}</q-item-label>
                       </q-item-section>
                       <q-item-section side>
                          <div class="text-weight-bold" :class="tx.type === 'Credit' ? 'text-green-7' : 'text-red-7'">
                             {{ tx.type === 'Credit' ? '+' : '-' }}{{ tx.amount.toLocaleString() }}
                          </div>
                       </q-item-section>
                    </q-item>
                 </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- Growth Chart -->
          <div class="col-12 col-md-4">
             <q-card class="bg-white shadow-soft full-height border-radius-lg overflow-hidden">
              <q-card-section class="q-pa-lg border-bottom bg-grey-1">
                <div class="text-h6 text-weight-bold text-blue-grey-9">Fund Growth</div>
              </q-card-section>
              <q-card-section class="q-pa-md relative-position">
                <div style="height: 350px;">
                  <Line :data="chartData" :options="chartOptions" />
                </div>
              </q-card-section>
            </q-card>
          </div>
          
           <!-- Tools / Quick Links -->
          <div class="col-12 col-md-3">
             <q-card class="bg-gradient-primary text-white full-height shadow-lg border-radius-lg overflow-hidden relative-position">
               <!-- Decorative Circles -->
               <div class="absolute-top-right bg-white-10 rounded-full" style="width: 150px; height: 150px; top: -50px; right: -50px;"></div>
               <div class="absolute-bottom-left bg-white-10 rounded-full" style="width: 100px; height: 100px; bottom: -20px; left: -20px;"></div>

              <q-card-section class="q-pa-lg flex column justify-between full-height" style="z-index: 1;">
                <div>
                  <div class="row items-center q-mb-lg">
                     <div class="q-pa-sm bg-white-20 rounded-borders q-mr-md">
                        <q-icon name="verified_user" size="sm" />
                     </div>
                     <div class="text-h6 text-weight-bold">Document Vault</div>
                  </div>
                  <p class="text-grey-3 text-body2 line-height-relaxed">
                    Access verified monthly PDF reports, meeting minutes, and digital receipts securely.
                  </p>
                </div>
                
                <div class="q-mt-xl">
                  <q-list dark separator class="rounded-borders bg-white-10">
                    <q-item clickable v-ripple to="/documents">
                      <q-item-section avatar>
                         <q-icon name="description" size="sm" />
                      </q-item-section>
                      <q-item-section class="text-weight-medium">Monthly Reports</q-item-section>
                      <q-item-section side>
                        <q-icon name="arrow_forward_ios" size="xs" color="white" />
                      </q-item-section>
                    </q-item>
                     <q-item clickable v-ripple to="/documents">
                      <q-item-section avatar>
                         <q-icon name="receipt_long" size="sm" />
                      </q-item-section>
                      <q-item-section class="text-weight-medium">Receipts</q-item-section>
                       <q-item-section side>
                        <q-icon name="arrow_forward_ios" size="xs" color="white" />
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
    <div class="bg-dark text-white q-py-xl">
      <div class="container q-mx-auto q-px-md text-center">
        <div class="text-h5 text-weight-bold q-mb-md font-inter">Batch Fund 2026</div>
        <div class="text-grey-5 q-mb-lg text-body2" style="max-width: 500px; margin: 0 auto;">
          Empowering our batch with transparent financial management. Every rupee accounted for.
        </div>
        <q-separator dark class="q-my-lg opacity-20" />
        <div class="text-caption text-grey-6">
          &copy; 2026 Batch Fund Management System. All rights reserved.
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
/* Fonts */
.font-inter {
  font-family: 'Inter', 'Roboto', sans-serif;
}

/* Hero Section */
.hero-section {
  height: 90vh; /* Taller hero */
  width: 100%;
}

.bg-gradient-overlay {
  background: linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(79, 70, 229, 0.8) 100%);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #4f46e5 0%, #818cf8 100%);
}

.bg-gradient-warning {
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
}

/* Glass Card */
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  display: inline-block;
}

.hero-balance {
  font-size: 5rem;
  line-height: 1;
  letter-spacing: -1px;
}

@media (max-width: 900px) {
  .hero-balance {
    font-size: 3.5rem;
  }
}
@media (max-width: 600px) {
  .hero-balance {
    font-size: 2.5rem;
  }
  .hero-section {
    height: 100vh;
  }
}

/* Utilities */
.ls-1 { letter-spacing: 1px; }
.ls-2 { letter-spacing: 2px; }
.opacity-80 { opacity: 0.8; }
.opacity-50 { opacity: 0.5; }
.opacity-20 { opacity: 0.2; }

.bg-white-10 { background: rgba(255,255,255, 0.1); }
.bg-white-20 { background: rgba(255,255,255, 0.2); }

.rounded-borders { border-radius: 8px; }
.border-radius-lg { border-radius: 16px; }
.rounded-full { border-radius: 50%; }

.border-bottom { border-bottom: 1px solid #f0f0f0; }

.text-gradient {
  background: linear-gradient(to right, #ffffff, #c7d2fe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.shadow-soft {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.btn-hover-lift {
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
}

.stat-card {
  transition: transform 0.3s;
}
.stat-card:hover {
  transform: translateY(-5px);
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.avatar-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.hover-bg-grey:hover {
  background-color: #f9fafb;
}

.transition-base {
  transition: all 0.2s;
}

.h-1 { height: 4px; }
.w-20 { width: 80px; }
.line-height-relaxed { line-height: 1.6; }
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { date } from 'quasar'
import { useTransactionStore } from 'stores/transaction-store'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const transactionStore = useTransactionStore()

const students = computed(() => transactionStore.students)
const lastUpdated = ref(date.formatDate(Date.now(), 'MMM DD, YYYY'))

// Stats Logic
const sheetCollected = computed(() => {
  let sum = 0
  students.value.forEach(row => {
    Object.keys(row).forEach(key => {
      // MONTHS check or exclude core
      if (['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].includes(key)) {
        const val = row[key]
        if (val && !isNaN(val)) sum += val
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
      if (['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'].includes(key)) {
         const val = row[key]
         if (val && !isNaN(val)) s += val
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
  const dataPoints = months.map((_, index) => {
     const monthKey = fullMonths[index]
     const agg = transactionStore.monthlyAggregations.find(a => a.id === `monthly-${monthKey}`)
     const aggAmount = agg ? agg.amount : 0
     
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
    datasets: [{
      label: 'Total Fund Balance',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      borderColor: '#000000',
      data: dataPoints,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#000000'
    }]
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



onMounted(() => {
  transactionStore.fetchAllData()
})
</script>
