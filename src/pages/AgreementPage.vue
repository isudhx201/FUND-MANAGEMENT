<template>
  <q-page class="font-inter q-pa-md q-pa-lg-xl" :class="$q.dark.isActive ? 'bg-blue-grey-10 text-white' : 'bg-indigo-1'">
    <div class="container q-mx-auto">
      <!-- Header Section -->
      <div class="text-center q-mb-xl animate-fade-in">
        <div class="inline-block q-pa-sm rounded-borders q-mb-md" :class="$q.dark.isActive ? 'bg-white-10' : 'bg-indigo-1'">
          <q-icon name="gavel" size="lg" :class="$q.dark.isActive ? 'text-white' : 'text-indigo-6'" />
        </div>
        <h1 class="text-h3 text-weight-bolder q-my-none" :class="$q.dark.isActive ? 'text-white' : 'text-indigo-9'">
          Batch Fund Agreement <span class="text-weight-light">& Policy</span>
        </h1>
        <div class="text-subtitle1 q-mt-md opacity-70">Official legal framework and guidelines for the University of Vavuniya FBS 2023 Batch Fund.</div>
      </div>

      <!-- Main Content Card -->
      <q-card class="shadow-24 border-radius-xl overflow-hidden animate-slide-up" :class="$q.dark.isActive ? 'bg-blue-grey-9 text-white border-dark' : 'bg-white border-indigo'">
        <q-card-section class="q-pa-lg q-pa-md-xl">
          
          <!-- Introduction -->
          <div class="policy-section q-mb-xl">
            <h2 class="text-h5 text-weight-bold q-mb-md flex items-center">
              <q-icon name="info" class="q-mr-sm text-indigo-4" /> 1. Introduction
            </h2>
            <p class="text-body1 line-height-relaxed opacity-90">
              The University of Vavuniya FBS 2023 Batch Fund is established to support academic activities, social events, and emergency needs of the batch members. This agreement outlines the responsibilities of members, management of funds, and dispute resolution mechanisms.
            </p>
          </div>

          <!-- Contribution Policy -->
          <div class="policy-section q-mb-xl">
            <h2 class="text-h5 text-weight-bold q-mb-md flex items-center">
              <q-icon name="savings" class="q-mr-sm text-green-4" /> 2. Contribution Policy
            </h2>
            <ul class="policy-list text-body1 opacity-90">
              <li>Each member is required to contribute a monthly fee of LKR [Amount] by the 5th of every month.</li>
              <li>Late payments may incur a nominal penalty fee of LKR [Amount] if not communicated in advance.</li>
              <li>Special contributions may be requested for large-scale events based on a majority vote.</li>
            </ul>
          </div>

          <!-- Transparency & Audit -->
          <div class="policy-section q-mb-xl">
            <h2 class="text-h5 text-weight-bold q-mb-md flex items-center">
              <q-icon name="visibility" class="q-mr-sm text-amber-4" /> 3. Transparency & Audit
            </h2>
            <p class="text-body1 line-height-relaxed opacity-90">
              The fund management team is committed to 100% transparency. All transactions, including income and expenses, are recorded in this portal and accessible to all members at any time. A full audit will be conducted at the end of each semester.
            </p>
          </div>

          <!-- Usage of Funds -->
          <div class="policy-section q-mb-xl">
            <h2 class="text-h5 text-weight-bold q-mb-md flex items-center">
              <q-icon name="trending_up" class="q-mr-sm text-blue-4" /> 4. Usage of Funds
            </h2>
            <ul class="policy-list text-body1 opacity-90">
              <li>Funds shall strictly be used for activities beneficial to the entire batch or designated charity events.</li>
              <li>Emergency withdrawals for individual members must be approved by the executive committee.</li>
              <li>Every expense above LKR [Amount] requires prior approval through a batch poll.</li>
            </ul>
          </div>

          <!-- Termination -->
          <div class="policy-section q-mb-xl">
            <h2 class="text-h5 text-weight-bold q-mb-md flex items-center">
              <q-icon name="cancel" class="q-mr-sm text-red-4" /> 5. Termination of Membership
            </h2>
            <p class="text-body1 line-height-relaxed opacity-90">
              Members who fail to contribute for three consecutive months without prior notice may face suspension of fund privileges, subject to a review by the committee.
            </p>
          </div>

          <q-separator class="q-my-xl" :class="$q.dark.isActive ? 'bg-white-10' : 'bg-indigo-1'" />

          <!-- Approval Footer -->
          <div class="row items-center justify-between q-gutter-md">
            <div class="text-subtitle1 italic opacity-60">
              Approved by the Batch on <span class="text-weight-bold text-indigo-4">January 01, 2026</span>
            </div>
            <div>
               <q-btn 
                icon="download" 
                label="Download Full Agreement (PDF)" 
                color="indigo-7" 
                unelevated 
                rounded 
                class="q-px-lg q-py-ms shadow-4 hover-scale"
                @click="downloadFullPDF"
              />
            </div>
          </div>

        </q-card-section>
      </q-card>

      <!-- Back Button -->
      <div class="text-center q-mt-xl">
        <q-btn flat no-caps icon="arrow_back" label="Back to Home" to="/" color="grey-6" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar'

const $q = useQuasar()

function downloadFullPDF() {
  // Placeholder for the actual file link
  $q.notify({
    type: 'info',
    message: 'The full PDF version will be available soon. Link pending.',
    position: 'bottom'
  })
}
</script>

<style scoped>
.font-inter {
  font-family: 'Inter', 'Roboto', sans-serif;
}
.container {
  max-width: 900px;
}
.border-radius-xl {
  border-radius: 24px;
}
.bg-white-10 {
  background-color: rgba(255, 255, 255, 0.1);
}
.border-dark {
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.border-indigo {
  border: 1px solid #e0e7ff;
}
.line-height-relaxed {
  line-height: 1.8;
}
.policy-list {
  padding-left: 1.5rem;
}
.policy-list li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}
.hover-scale {
  transition: transform 0.2s ease;
}
.hover-scale:hover {
  transform: translateY(-2px);
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}
.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.policy-section h2 {
  font-size: 1.5rem;
  letter-spacing: -0.02em;
}
</style>
