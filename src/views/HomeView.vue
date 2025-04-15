<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { useRequiredUser, useLogout } from '@/hooks/use-auth'
import type {
  UserPreference,
  FirstTimeModalPreference,
  ThemePreference,
  PreferredPayment,
} from '@/user-preferences/user-preference.types'

const router = useRouter()
const { user } = useRequiredUser()
const { mutate: logout, isPending: isLoggingOut } = useLogout()
const { data: preferences, isLoading, error } = useUserPreferences()

const showModal = ref(false)
const selectedPreference = ref<UserPreference | null>(null)

const preferencesByType = computed(() => {
  if (!preferences.value) return {}

  return {
    firstTimeModals: preferences.value.filter(
      (p): p is FirstTimeModalPreference => p.group === 'first-time-modal',
    ),
    themes: preferences.value.filter((p): p is ThemePreference => p.group === 'theme'),
    payments: preferences.value.filter(
      (p): p is PreferredPayment => p.group === 'preferred-payment',
    ),
  }
})

const handleLogout = () => {
  logout(undefined, {
    onSuccess: () => router.push('/login'),
  })
}

const openJsonView = (preference: UserPreference) => {
  selectedPreference.value = preference
  showModal.value = true
}
</script>

<template>
  <main>
    <div class="user-info">
      <span>Welcome, {{ user.id }}</span>
      <button @click="handleLogout" class="logout-button" :disabled="isLoggingOut">
        {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
      </button>
    </div>

    <div class="preferences-container">
      <h2>Your Preferences</h2>

      <div v-if="isLoading" class="loading">Loading preferences...</div>
      <div v-else-if="error" class="error">Error loading preferences: {{ error.message }}</div>
      <div v-else-if="!preferences?.length" class="no-data">No preferences found.</div>
    </div>
    <div class="table-section">
      <table class="preferences-table">
        <thead>
          <tr>
            <th>Group</th>
            <th>ID</th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="preference in preferences" :key="preference.id">
            <td>{{ preference.group }}</td>
            <td>{{ preference.id }}</td>
            <td>{{ preference.user }}</td>
            <td>
              <button @click="openJsonView(preference)" class="view-json-button">View JSON</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <JsonModal v-model="showModal" :data="selectedPreference" />
  </main>
</template>

<style scoped>
.user-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.logout-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logout-button:hover:not(:disabled) {
  background-color: #b91c1c;
}

.preferences-container {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.preferences-container h2 {
  color: var(--color-heading);
  margin-bottom: 2rem;
}

.table-section {
  margin-bottom: 2rem;
}

.table-section h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.loading,
.error,
.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--color-text);
}

.error {
  color: #dc2626;
}

.table-container {
  overflow-x: auto;
  background: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

th {
  background: var(--color-background);
  font-weight: 600;
  color: var(--color-heading);
}

tr:last-child td {
  border-bottom: none;
}

.view-json-button {
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.view-json-button:hover {
  background: #1d4ed8;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  margin-right: 0.5rem;
  background: var(--color-background);
  color: var(--color-text);
}

.tag.light {
  background: #f3f4f6;
  color: #111827;
}

.tag.dark {
  background: #374151;
  color: #f9fafb;
}

.tag.payment {
  background: #dbeafe;
  color: #1e40af;
}

.tag:last-child {
  margin-right: 0;
}
</style>
