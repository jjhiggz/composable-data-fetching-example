<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import type { UserPreference } from '@/user-preferences/user-preference.types'

const router = useRouter()
const userId = ref('')

const { data: preferences, isLoading, error } = useUserPreferences()

const groupedPreferences = computed(() => {
  if (!preferences.value) return {}

  return preferences.value.reduce<Record<string, UserPreference[]>>((acc, pref) => {
    if (!acc[pref.group]) {
      acc[pref.group] = []
    }
    acc[pref.group].push(pref)
    return acc
  }, {})
})

onMounted(() => {
  userId.value = localStorage.getItem('userId') || ''
})

const handleLogout = () => {
  localStorage.removeItem('userId')
  router.push('/login')
}

const formatPreferenceValue = (preference: UserPreference) => {
  switch (preference.group) {
    case 'first-time-modal':
      return `Seen modals: ${preference.seenModals.join(', ')}`
    case 'theme':
      return `Theme: ${preference.theme}`
    case 'preferred-payment':
      return `Payment method: ${preference.preferredPaymentMethod}`
    default:
      return 'Unknown preference type'
  }
}
</script>

<template>
  <main>
    <div class="user-info">
      <span>Welcome, {{ userId }}</span>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>

    <div class="preferences-container">
      <h2>Your Preferences</h2>

      <div v-if="isLoading" class="loading">Loading preferences...</div>

      <div v-else-if="error" class="error">Error loading preferences: {{ error.message }}</div>

      <div v-else-if="!preferences?.length" class="no-data">No preferences found.</div>

      <div v-else class="preferences-groups">
        <div v-for="(prefs, group) in groupedPreferences" :key="group" class="preference-group">
          <h3>{{ group.replace('-', ' ') }}</h3>
          <ul>
            <li v-for="pref in prefs" :key="pref.id" class="preference-item">
              {{ formatPreferenceValue(pref) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
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

.logout-button:hover {
  background-color: #b91c1c;
}

.preferences-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.preferences-container h2 {
  color: var(--color-heading);
  margin-bottom: 2rem;
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

.preferences-groups {
  display: grid;
  gap: 2rem;
}

.preference-group {
  background: var(--color-background-soft);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.preference-group h3 {
  color: var(--color-heading);
  text-transform: capitalize;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.preference-item {
  padding: 0.5rem 0;
  color: var(--color-text);
  list-style: none;
}

ul {
  margin: 0;
  padding: 0;
}
</style>
