import { describe, it, expect } from 'vitest'
import {
  computeFirstTimeModalPreference,
  computeCurrentlyOpenedModalType,
  getCloseForeverDTO,
} from './use-first-time-modal'
import {
  allKnownModals,
  type FirstTimeModalPreference,
  type KnownModal,
} from './user-preference.types'
import type { Optional } from 'ts-toolbelt/out/Object/Optional'

type FirstTimeModalPreferenceOptional = Optional<FirstTimeModalPreference, 'id'>

describe('computeFirstTimeModalPreference', () => {
  const mockUser = { id: 'test-user' }

  it('throws error when user is not provided', () => {
    expect(() =>
      computeFirstTimeModalPreference({
        userData: null,
        userPreferences: [],
      }),
    ).toThrow('Cannot use first time modal preference without user')
  })

  it('returns existing modal preference when found', () => {
    const existingPreference: FirstTimeModalPreference = {
      id: '1',
      group: 'first-time-modal',
      user: 'test-user',
      preferences: [{ key: 'balances', value: 'true' }],
    }

    const result = computeFirstTimeModalPreference({
      userData: mockUser,
      userPreferences: [existingPreference],
    })

    expect(result).toEqual(existingPreference)
  })

  it('returns new modal preference when none exists', () => {
    const result = computeFirstTimeModalPreference({
      userData: mockUser,
      userPreferences: [],
    })

    expect(result).toEqual({
      group: 'first-time-modal',
      user: 'test-user',
      preferences: [],
    })
  })
})

describe('computeCurrentlyOpenedModalType', () => {
  const basePreference: FirstTimeModalPreferenceOptional = {
    group: 'first-time-modal',
    user: 'test-user',
    preferences: [],
  }

  it('returns undefined when loading', () => {
    const result = computeCurrentlyOpenedModalType({
      isLoading: true,
      firstTimeModalPreference: basePreference,
      temporarilyClosed: [],
    })

    expect(result).toBeUndefined()
  })

  it('returns first unclosed modal', () => {
    const result = computeCurrentlyOpenedModalType({
      isLoading: false,
      firstTimeModalPreference: basePreference,
      temporarilyClosed: [],
    })

    // Should return the first modal from allKnownModals since none are closed
    expect(result).toBeDefined()
  })

  it('skips permanently closed modals', () => {
    const preference: FirstTimeModalPreferenceOptional = {
      ...basePreference,
      preferences: [{ key: 'balances' as KnownModal, value: 'true' }],
    }

    const result = computeCurrentlyOpenedModalType({
      isLoading: false,
      firstTimeModalPreference: preference,
      temporarilyClosed: [],
    })

    // Should not return 'balances' since it's permanently closed
    expect(result).not.toBe('balances')
  })

  it('skips temporarily closed modals', () => {
    const result = computeCurrentlyOpenedModalType({
      isLoading: false,
      firstTimeModalPreference: basePreference,
      temporarilyClosed: ['balances' as KnownModal],
    })

    // Should not return 'balances' since it's temporarily closed
    expect(result).not.toBe('balances')
  })

  it('returns undefined when all modals are closed', () => {
    const preference: FirstTimeModalPreferenceOptional = {
      ...basePreference,
      preferences: [{ key: 'balances' as KnownModal, value: 'true' }],
    }

    const result = computeCurrentlyOpenedModalType({
      isLoading: false,
      firstTimeModalPreference: preference,
      temporarilyClosed: allKnownModals,
    })

    // If all modals in allKnownModals are either permanently or temporarily closed
    expect(result).toBeUndefined()
  })
})

describe('getCloseForeverDTO', () => {
  it('adds modal to closed preferences', () => {
    const existingPreference: FirstTimeModalPreferenceOptional = {
      group: 'first-time-modal',
      user: 'test-user',
      preferences: [],
    }

    const result = getCloseForeverDTO({
      modalId: 'balances' as KnownModal,
      existingPreference,
    })

    expect(result).toEqual({
      group: 'first-time-modal',
      user: 'test-user',
      preferences: [{ key: 'balances', value: 'true' }],
    })
  })

  it('preserves existing closed preferences', () => {
    const existingPreference: FirstTimeModalPreferenceOptional = {
      group: 'first-time-modal',
      user: 'test-user',
      preferences: [{ key: 'other-modal' as KnownModal, value: 'true' }],
    }

    const result = getCloseForeverDTO({
      modalId: 'balances' as KnownModal,
      existingPreference,
    })

    expect(result.preferences).toHaveLength(2)
    expect(result.preferences).toContainEqual({ key: 'other-modal', value: 'true' })
    expect(result.preferences).toContainEqual({ key: 'balances', value: 'true' })
  })

  it('preserves existing preference structure', () => {
    const existingPreference: FirstTimeModalPreference = {
      id: '1',
      group: 'first-time-modal',
      user: 'test-user',
      preferences: [],
    }

    const result = getCloseForeverDTO({
      modalId: 'balances' as KnownModal,
      existingPreference,
    })

    expect(result).toEqual({
      id: '1',
      group: 'first-time-modal',
      user: 'test-user',
      preferences: [{ key: 'balances', value: 'true' }],
    })
  })
})
