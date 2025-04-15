<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserPreferences } from '@/hooks/use-user-preferences'
import { useRequiredUser, useLogout } from '@/hooks/use-auth'
import type { UserPreference } from '@/user-preferences/user-preference.types'

const router = useRouter()
const { user } = useRequiredUser()
const { mutate: logout, isPending: isLoggingOut } = useLogout()

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

const handleLogout = () => {
  logout(undefined, {
    onSuccess: () => router.push('/login'),
  })
}

const formatPreference = (pref: UserPreference) => {
  // Remove common fields to make the output more concise
  const { id: _, user: __, group: ___, ...relevantData } = pref
  return JSON.stringify(relevantData, null, 2)
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

      <div v-else class="preferences-groups">
        <div v-for="(prefs, group) in groupedPreferences" :key="group" class="preference-group">
          <h3>{{ group.replace('-', ' ') }}</h3>
          <pre v-for="pref in prefs" :key="pref.id" class="preference-item">{{
            formatPreference(pref)
          }}</pre>
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

.logout-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logout-button:hover:not(:disabled) {
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
  padding: 1rem;
  color: var(--color-text);
  background: var(--color-background);
  border-radius: 4px;
  margin: 0.5rem 0;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
