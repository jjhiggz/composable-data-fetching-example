<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { useLogout, useOptionalUser } from '@/hooks/use-auth'
import { useTheme } from '@/user-preferences/use-theme'
import { useFirstTimeModal } from '@/user-preferences/use-first-time-modal'
import type { UserPreference } from '@/user-preferences/user-preference.types'
import JsonModal from '@/components/JsonModal.vue'
import BalancesModal from '@/components/BalancesModal.vue'

const router = useRouter()
const { data: userData } = useOptionalUser()
const { mutate: logout, isPending: isLoggingOut } = useLogout()
const { data: preferences, isLoading, error } = useUserPreferences()
const { themePreference, toggleTheme } = useTheme()
const { currentlyOpenedModalType, closeForever, closeTemporarily } = useFirstTimeModal()

const showModal = ref(false)
const selectedPreference = ref<UserPreference | null>(null)

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
  <main :class="themePreference.theme">
    <div class="container">
      <div class="user-info">
        <div class="user-controls">
          <button
            class="theme-toggle"
            @click="toggleTheme"
            :title="
              themePreference.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
            "
          >
            {{ themePreference.theme === 'dark' ? '🌞' : '🌙' }}
          </button>
          <button @click="handleLogout" class="logout-button" :disabled="isLoggingOut">
            {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
          </button>
        </div>
        <span class="welcome-text">Welcome, {{ userData?.id ?? 'nobody' }}</span>
      </div>

      <div class="content">
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
                  <button @click="openJsonView(preference)" class="view-json-button">
                    View JSON
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <JsonModal v-model="showModal" :json-data="selectedPreference" />
    <BalancesModal
      v-if="currentlyOpenedModalType === 'balances'"
      :on-close-forever="closeForever"
      :on-close-temporarily="closeTemporarily"
    />
  </main>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.content {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 2rem;
  margin-top: 2rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-text {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--color-heading);
}

.user-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.theme-toggle {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 9999px;
  line-height: 1;
  transition: all 0.2s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background: var(--color-background-soft);
  transform: scale(1.05);
}

main {
  min-height: 100vh;
  background: var(--color-background);
  color: var(--color-text);
  transition: all 0.3s;
}

.logout-button {
  padding: 0.625rem 1.25rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.logout-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logout-button:hover:not(:disabled) {
  background-color: #b91c1c;
  transform: translateY(-1px);
}

.preferences-container {
  margin-bottom: 2rem;
}

.preferences-container h2 {
  color: var(--color-heading);
  margin-bottom: 2rem;
  font-size: 1.875rem;
  font-weight: 600;
}

.loading,
.error,
.no-data {
  text-align: center;
  padding: 3rem;
  color: var(--color-text);
  background: var(--color-background);
  border-radius: 8px;
  margin: 1rem 0;
}

.error {
  color: #dc2626;
  background: #fee2e2;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--color-background);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

th {
  background: var(--color-background);
  font-weight: 600;
  color: var(--color-heading);
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background: var(--color-background-soft);
}

.view-json-button {
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.view-json-button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

:root {
  --color-background: #ffffff;
  --color-background-soft: #f8f8f8;
  --color-text: #374151;
  --color-heading: #111827;
  --color-border: #e5e7eb;
}

.dark {
  --color-background: #1a1a1a;
  --color-background-soft: #2a2a2a;
  --color-text: #e5e7eb;
  --color-heading: #f3f4f6;
  --color-border: #4b5563;
}
</style>
