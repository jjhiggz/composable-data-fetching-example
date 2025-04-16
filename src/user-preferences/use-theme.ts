import { createUserPreference, useUserPreferences } from '@/user-preferences/use-user-preferences'
import type { ThemePreference, UserPreference } from './user-preference.types'
import { computed, type ComputedRef } from 'vue'
import type { Optional } from 'ts-toolbelt/out/Object/Optional'
import { useOptionalUser, type User } from '@/hooks/use-auth'

// Separated logic, can be tested
export const _computeTheme = (
  themePreference: UpsertThemePreferenceDTO | undefined,
): 'light' | 'dark' => {
  return themePreference?.preferences.find((p) => p.key === 'theme')?.value ?? 'light'
}

// separated logic, can be tested
export const _computeThemePreference = ({
  userData,
  userPreferences,
}: {
  userPreferences: UserPreference[] | undefined
  userData: User | null | undefined
}): UpsertThemePreferenceDTO => {
  if (!userData) {
    throw new Error('Cannot use theme preference without user')
  }
  const existingPreference = userPreferences?.find((preference) => preference.group === 'theme')
  if (existingPreference) {
    return existingPreference
  }
  return {
    group: 'theme',
    user: userData.id,
    preferences: [],
  }
}

export const _getUpdateThemeDTO = ({
  theme,
  existingPreference,
}: {
  theme: 'light' | 'dark'
  existingPreference: UpsertThemePreferenceDTO
}): UpsertThemePreferenceDTO => {
  const newTheme = theme === 'light' ? 'dark' : 'light'
  return {
    ...existingPreference,
    preferences: [{ key: 'theme', value: newTheme }],
  }
}

type UpsertThemePreferenceDTO = Optional<ThemePreference, 'id'>
export const useTheme = () => {
  const preferencesQuery = useUserPreferences()
  const { mutateAsync: updateUserPreference } = createUserPreference()
  const { data: userData } = useOptionalUser()

  const themePreference: ComputedRef<UpsertThemePreferenceDTO> = computed(() =>
    _computeThemePreference({
      userData: userData.value,
      userPreferences: preferencesQuery.data.value,
    }),
  )

  const theme = computed(() => _computeTheme(themePreference.value))

  const toggleTheme = () => {
    updateUserPreference(
      _getUpdateThemeDTO({
        existingPreference: themePreference.value,
        theme: theme.value,
      }),
    )
  }

  return {
    theme,
    toggleTheme,
  }
}
