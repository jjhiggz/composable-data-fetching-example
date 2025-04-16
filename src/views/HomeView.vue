<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserPreferences } from '@/user-preferences/use-user-preferences'
import { useLogout, useOptionalUser } from '@/hooks/use-auth'
import { useTheme } from '@/user-preferences/use-theme'
import { useFirstTimeModal } from '@/user-preferences/use-first-time-modal'
import { useDebounceFn } from '@vueuse/core'
import type { UserPreference } from '@/user-preferences/user-preference.types'
import JsonModal from '@/components/JsonModal.vue'
import BalancesModal from '@/components/BalancesModal.vue'
import type { CharacterFiltersPartial } from '@/characters/get-character'
import { useCharacters } from '@/characters/use-characters'

const router = useRouter()
const { data: userData } = useOptionalUser()
const { mutate: logout, isPending: isLoggingOut } = useLogout()
const {
  data: preferences,
  isLoading: preferencesLoading,
  error: preferencesError,
} = useUserPreferences()
const { themePreference, toggleTheme } = useTheme()
const { currentlyOpenedModalType, closeForever, closeTemporarily } = useFirstTimeModal()
const charactersQuery = useCharacters()

const showModal = ref(false)
const selectedPreference = ref<UserPreference | null>(null)
const searchQuery = ref('')

const updateSearch = useDebounceFn((value: string) => {
  const newObject: CharacterFiltersPartial = {}
  if (value) {
    newObject.name = value
  }
  charactersQuery.filters.value = newObject
}, 300)

const applyFilter = (type: 'alive-female' | 'dead-rick') => {
  switch (type) {
    case 'alive-female':
      charactersQuery.filters.value = {
        gender: 'female',
        status: 'alive',
      }
      break
    case 'dead-rick':
      charactersQuery.filters.value = {
        name: 'rick',
        status: 'dead',
      }
      break
  }
}

const handleSearch = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  updateSearch(value)
}

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
        <div class="section">
          <h2>Characters</h2>
          <div class="filter-buttons">
            <button class="filter-button" @click="applyFilter('alive-female')">
              Alive Females
            </button>
            <button class="filter-button" @click="applyFilter('dead-rick')">Dead Ricks</button>
          </div>
          <div class="search-container">
            <input
              type="search"
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="Search characters..."
              class="search-input"
            />
          </div>
          <div v-if="charactersQuery.query.isLoading.value" class="loading">
            Loading characters...
          </div>
          <div v-else-if="charactersQuery.query.error.value" class="error">
            Error loading characters: {{ charactersQuery.query.error.value?.message }}
          </div>
          <table v-else class="characters-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Gender</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="character in charactersQuery.query.data.value" :key="character.id">
                <td>{{ character.name }}</td>
                <td>
                  <span :class="['status-badge', character.status.toLowerCase()]">
                    {{ character.status }}
                  </span>
                </td>
                <td>{{ character.gender }}</td>
                <td>
                  <span :class="['character-type', character.type]">{{ character.type }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Your Preferences</h2>
          <div v-if="preferencesLoading" class="loading">Loading preferences...</div>
          <div v-else-if="preferencesError" class="error">
            Error loading preferences: {{ preferencesError.message }}
          </div>
          <div v-else-if="!preferences?.length" class="no-data">No preferences found.</div>
          <table v-else class="preferences-table">
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

.section {
  margin-bottom: 3rem;
}

.section h2 {
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  font-size: 1.875rem;
  font-weight: 600;
}

.search-container {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.characters-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: var(--color-background);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.character-type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.character-type.hero {
  background: #dbeafe;
  color: #1e40af;
}

.character-type.villain {
  background: #fee2e2;
  color: #991b1b;
}

.power-bar {
  width: 100%;
  height: 8px;
  background: var(--color-background-soft);
  border-radius: 4px;
  overflow: hidden;
}

.power-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.power-fill.hero {
  background: #3b82f6;
}

.power-fill.villain {
  background: #ef4444;
}

.alignment {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.alignment.good {
  background: #dcfce7;
  color: #166534;
}

.alignment.evil {
  background: #fef2f2;
  color: #991b1b;
}

.alignment.neutral {
  background: #f3f4f6;
  color: #374151;
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

.filter-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-button {
  padding: 0.5rem 1rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-button:hover {
  background: var(--color-background-soft);
  transform: translateY(-1px);
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.alive {
  background: #dcfce7;
  color: #166534;
}

.status-badge.dead {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.unknown {
  background: #f3f4f6;
  color: #374151;
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
