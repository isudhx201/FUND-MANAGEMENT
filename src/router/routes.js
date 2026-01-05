const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'statement', component: () => import('pages/StatementPage.vue') },
      { path: 'submit-proof', component: () => import('pages/SubmitProofPage.vue') },
      { path: 'documents', component: () => import('pages/DocumentsPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'admin/dashboard', component: () => import('pages/AdminDashboardPage.vue'), meta: { requiresAuth: true } },
      { path: 'payment-details', component: () => import('pages/PaymentDetailsPage.vue') },
      { path: 'history', component: () => import('pages/MainFundHistoryPage.vue') },
      { path: 'agreement', component: () => import('pages/AgreementPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
