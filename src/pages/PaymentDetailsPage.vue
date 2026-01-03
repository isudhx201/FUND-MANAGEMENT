<template>
  <q-page class="font-inter" :class="$q.dark.isActive ? 'bg-blue-grey-10 text-white' : 'bg-grey-1'">
    <!-- Header -->
    <div class="q-py-lg border-bottom q-mb-lg" :class="$q.dark.isActive ? 'bg-blue-grey-9 border-bottom-dark' : 'bg-white border-bottom'">
       <div class="container q-mx-auto q-px-md">
          <div class="row items-center justify-between">
            <div>
              <h1 class="text-h4 text-weight-bold q-my-none" :class="$q.dark.isActive ? 'text-white' : 'text-primary'">Payment Details</h1>
              <div class="text-subtitle2 q-mt-xs" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-7'">Transparency Report - Student Contributions</div>
            </div>
            <q-btn 
              label="Back to Home" 
              icon="arrow_back" 
              outline 
              rounded
              :color="$q.dark.isActive ? 'white' : 'primary'"
              no-caps 
              to="/" 
            />
          </div>
       </div>
    </div>

    <div class="container q-mx-auto q-px-md q-pb-xl">
      <q-card class="shadow-soft border-radius-lg overflow-hidden" :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white border-dark-mode' : 'bg-white'">
        <!-- Modern Search Bar -->
        <q-card-section class="q-pa-md border-bottom" :class="$q.dark.isActive ? 'bg-blue-grey-10 border-bottom-dark' : 'bg-grey-1'">
          <div class="row justify-between items-center">
             <div class="text-h6 text-weight-bold">Batch 2026 List</div>
             <q-input 
                v-model="filter" 
                outlined 
                dense 
                placeholder="Search by Name or Reg No..." 
                class="search-input"
                :bg-color="$q.dark.isActive ? 'blue-grey-9' : 'white'"
                :label-color="$q.dark.isActive ? 'grey-4' : 'grey-7'"
                :input-class="$q.dark.isActive ? 'text-white' : ''"
                rounded
                :dark="$q.dark.isActive"
              >
                <template v-slot:prepend>
                  <q-icon name="search" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-5'" />
                </template>
              </q-input>
          </div>
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
            class="modern-table"
            :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white' : ''"
          >
             <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-bold" :class="$q.dark.isActive ? 'bg-blue-grey-10 text-grey-4' : 'text-grey-8 bg-grey-1'">
                    {{ col.label }}
                  </q-th>
                </q-tr>
             </template>

             <template v-slot:body-cell-status="props">
                <q-td :props="props">
                   <q-chip 
                    :color="props.value === 'Paid' ? ($q.dark.isActive ? 'green-9' : 'green-1') : ($q.dark.isActive ? 'grey-8' : 'grey-2')" 
                    :text-color="props.value === 'Paid' ? ($q.dark.isActive ? 'green-1' : 'green-9') : ($q.dark.isActive ? 'grey-4' : 'grey-7')"
                    size="sm" 
                    class="text-weight-bold"
                  >
                    {{ props.value }}
                  </q-chip>
                </q-td>
             </template>
             
             <!-- Custom formatting for month columns to show checks -->
             <template v-slot:body="props">
               <q-tr :props="props" class="transition-base" :class="$q.dark.isActive ? 'hover-bg-dark' : 'hover-bg-grey'">
                 <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <template v-if="isMonthColumn(col.name)">
                       <div v-if="props.row[col.field] > 0" class="flex flex-center" :class="$q.dark.isActive ? 'text-green-4' : 'text-green-6'">
                          <q-icon name="check_circle" size="xs" />
                          <span class="q-ml-xs text-caption">{{ props.row[col.field] }}</span>
                       </div>
                       <div v-else class="text-center" :class="$q.dark.isActive ? 'text-grey-7' : 'text-grey-3'">-</div>
                    </template>
                    <template v-else>
                       {{ props.row[col.field] }}
                    </template>
                 </q-td>
               </q-tr>
             </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useTransactionStore } from 'stores/transaction-store'

const transactionStore = useTransactionStore()
const filter = ref('')

const loading = computed(() => transactionStore.loading)
const students = computed(() => transactionStore.students)
const columns = computed(() => {
  if (students.value.length === 0) return []
  
  // Get keys from first student or define them
  // Better use the logic from your current parseCSV but map to store
  return generateColumns()
})

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

function generateColumns() {
  if (students.value.length === 0) return []
  
  // We need the original headers. Since the store parses them into fields, 
  // we'll infer columns from student data fields or a standard list.
  // The store currently maps headers to fields like 'regNo', 'name', 'january' etc.
  
  const coreFields = [
    { name: 'regNo', label: 'Reg No.', field: 'regNo', align: 'left', sortable: true },
    { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true }
  ]
  
  const monthCols = []
  MONTHS.forEach(m => {
    // Check if any student has a payment for this month
    const hasPayment = students.value.some(row => row[m] > 0)
    if (hasPayment) {
      monthCols.push({
        name: m,
        label: m.charAt(0).toUpperCase() + m.slice(1),
        field: m,
        align: 'right',
        sortable: true,
        format: (val) => (val > 0 ? `LKR ${val.toLocaleString()}` : '-')
      })
    }
  })
  
  // Sort months recent first
  monthCols.reverse()
  
  return [...coreFields, ...monthCols]
}

const MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

function isMonthColumn(colName) {
  return MONTH_NAMES.includes(colName.toLowerCase())
}

onMounted(() => {
  if (transactionStore.students.length === 0) {
    transactionStore.fetchSheetData()
  }
})
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', 'Roboto', sans-serif;
}
.container {
  max-width: 1300px;
}
.border-bottom {
  border-bottom: 1px solid #e5e7eb;
}
.shadow-soft {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.border-radius-lg {
  border-radius: 12px;
}
.search-input {
  width: 300px;
}
.modern-table :deep(th) {
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #6b7280;
}
.hover-bg-grey:hover {
  background-color: #f9fafb;
}
.transition-base {
  transition: background-color 0.2s;
}
</style>
