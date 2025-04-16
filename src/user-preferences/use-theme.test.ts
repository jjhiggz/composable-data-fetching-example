import { describe, it, expect } from 'vitest'
import { _computeTheme, _computeThemePreference, _getUpdateThemeDTO } from './use-theme'
import type { ThemePreference, UserPreference } from './user-preference.types'
import type { Optional } from 'ts-toolbelt/out/Object/Optional'

type UpsertThemePreferenceDTO = Optional<ThemePreference, 'id'>

describe('computeTheme', () => {
  it('returns light theme when no preference exists', () => {
    const result = _computeTheme(undefined)
    expect(result).toBe('light')
  })

  it('returns light theme when preferences array is empty', () => {
    const result = _computeTheme({
      group: 'theme',
      user: 'test-user',
      preferences: [],
    } as UpsertThemePreferenceDTO)
    expect(result).toBe('light')
  })

  it('returns the theme value from preferences when it exists', () => {
    const result = _computeTheme({
      group: 'theme',
      user: 'test-user',
      preferences: [{ key: 'theme', value: 'dark' }],
    } as UpsertThemePreferenceDTO)
    expect(result).toBe('dark')
  })
})

describe('computeThemePreference', () => {
  const mockUser = { id: 'test-user' }

  it('throws error when user is not provided', () => {
    expect(() =>
      _computeThemePreference({
        userData: null,
        userPreferences: [],
      }),
    ).toThrow('Cannot use theme preference without user')
  })

  it('returns existing theme preference when found', () => {
    const existingPreference: ThemePreference = {
      id: '1',
      group: 'theme',
      user: 'test-user',
      preferences: [{ key: 'theme', value: 'dark' }],
    }

    const result = _computeThemePreference({
      userData: mockUser,
      userPreferences: [existingPreference],
    })

    expect(result).toEqual(existingPreference)
  })

  it('returns new theme preference when none exists', () => {
    const result = _computeThemePreference({
      userData: mockUser,
      userPreferences: [],
    })

    expect(result).toEqual({
      group: 'theme',
      user: 'test-user',
      preferences: [],
    } as UpsertThemePreferenceDTO)
  })
})

describe('getUpdateThemeDTO', () => {
  it('toggles from light to dark', () => {
    const existingPreference: UpsertThemePreferenceDTO = {
      group: 'theme',
      user: 'test-user',
      preferences: [{ key: 'theme', value: 'light' }],
    }

    const result = _getUpdateThemeDTO({
      theme: 'light',
      existingPreference,
    })

    expect(result).toEqual({
      group: 'theme',
      user: 'test-user',
      preferences: [{ key: 'theme', value: 'dark' }],
    })
  })

  it('toggles from dark to light', () => {
    const existingPreference: UpsertThemePreferenceDTO = {
      group: 'theme',
      user: 'test-user',
      preferences: [{ key: 'theme', value: 'dark' }],
    }

    const result = _getUpdateThemeDTO({
      theme: 'dark',
      existingPreference,
    })

    expect(result).toEqual({
      group: 'theme',
      user: 'test-user',
      preferences: [{ key: 'theme', value: 'light' }],
    })
  })

  it('preserves existing preference structure', () => {
    const existingPreference: ThemePreference = {
      id: '1',
      group: 'theme',
      user: 'test-user',
      preferences: [{ key: 'theme', value: 'light' }],
    }

    const result = _getUpdateThemeDTO({
      theme: 'light',
      existingPreference,
    })

    expect(result).toEqual({
      ...existingPreference,
      preferences: [{ key: 'theme', value: 'dark' }],
    })
  })
})
