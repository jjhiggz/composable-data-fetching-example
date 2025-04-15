import { createUserPreference, useUserPreferences } from '@/hooks/use-user-preferences'
import type { ThemePreference } from './user-preference.types'
import { computed, type ComputedRef } from 'vue'
import type { Optional } from 'ts-toolbelt/out/Object/Optional'
import { useOptionalUser } from '@/hooks/use-auth'

export const useTheme = () => {
  const preferencesQuery = useUserPreferences()
  const { mutateAsync: updateUserPreference } = createUserPreference()
  const { data: userData } = useOptionalUser()

  type ThemePreferenceOptional = Optional<ThemePreference, 'id'>
  const themePreference: ComputedRef<ThemePreferenceOptional> = computed(() => {
    if (!userData.value) {
      throw new Error('Cannot use theme preference without user')
    }
    const existingPreference = preferencesQuery.data?.value?.find(
      (preference) => preference.group === 'theme',
    )
    if (existingPreference) {
      return existingPreference
    }
    return {
      group: 'theme',
      user: userData.value.id,
      theme: 'light',
    }
  })

  const toggleTheme = () => {
    updateUserPreference({
      ...themePreference.value,
      theme: themePreference.value.theme === 'dark' ? 'light' : 'dark',
    })
  }

  return {
    themePreference,
    toggleTheme,
  }
}
