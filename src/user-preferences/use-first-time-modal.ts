import { createUserPreference, useUserPreferences } from '@/user-preferences/use-user-preferences'
import {
  allKnownModals,
  type FirstTimeModalPreference,
  type KnownModal,
  type UserPreference,
} from './user-preference.types'
import { computed, ref, type ComputedRef } from 'vue'
import type { Optional } from 'ts-toolbelt/out/Object/Optional'
import { useOptionalUser, type User } from '@/hooks/use-auth'

type FirstTimeModalPreferenceOptional = Optional<FirstTimeModalPreference, 'id'>

// Separated logic, can be tested
export const _computeFirstTimeModalPreference = ({
  userData,
  userPreferences,
}: {
  userData: User | null | undefined
  userPreferences: UserPreference[] | undefined
}): FirstTimeModalPreferenceOptional => {
  if (!userData) {
    throw new Error('Cannot use first time modal preference without user')
  }
  const existingPreference = userPreferences?.find(
    (preference) => preference.group === 'first-time-modal',
  ) as FirstTimeModalPreference | undefined
  if (existingPreference) {
    return existingPreference
  }
  return {
    group: 'first-time-modal',
    user: userData.id,
    preferences: [],
  }
}

// Separated logic, can be tested
export const _computeCurrentlyOpenedModalType = ({
  isLoading,
  firstTimeModalPreference,
  temporarilyClosed,
}: {
  isLoading: boolean
  firstTimeModalPreference: FirstTimeModalPreferenceOptional
  temporarilyClosed: KnownModal[]
}): KnownModal | undefined => {
  if (isLoading) {
    return undefined
  }

  return allKnownModals.find((modalType) => {
    const isClosedForever = firstTimeModalPreference.preferences.some(
      (pref) => pref.key === modalType && pref.value === 'true',
    )
    const isClosedTemporarily = temporarilyClosed.includes(modalType)
    return !isClosedForever && !isClosedTemporarily
  })
}

// Separated logic, can be tested
export const _getCloseForeverDTO = ({
  modalId,
  existingPreference,
}: {
  modalId: KnownModal
  existingPreference: FirstTimeModalPreferenceOptional
}): FirstTimeModalPreferenceOptional => {
  return {
    ...existingPreference,
    preferences: [...existingPreference.preferences, { key: modalId, value: 'true' }],
  }
}

export const useFirstTimeModal = ({
  closeMode = 'show-in-sequence',
}: {
  closeMode?: 'show-in-sequence' | 'only-show-one'
} = {}) => {
  const preferencesQuery = useUserPreferences()
  const { mutateAsync: updateUserPreference } = createUserPreference()
  const { data: userData } = useOptionalUser()
  const temporarilyClosed = ref<KnownModal[]>([])

  const firstTimeModalPreference = computed(() =>
    _computeFirstTimeModalPreference({
      userData: userData.value,
      userPreferences: preferencesQuery.data?.value,
    }),
  )

  const currentlyOpenedModalType = computed(() =>
    _computeCurrentlyOpenedModalType({
      isLoading: preferencesQuery.isLoading.value,
      firstTimeModalPreference: firstTimeModalPreference.value,
      temporarilyClosed: temporarilyClosed.value,
    }),
  )

  const closeForever = async (modalId: KnownModal) => {
    await updateUserPreference(
      _getCloseForeverDTO({
        modalId,
        existingPreference: firstTimeModalPreference.value,
      }),
    )
    if (closeMode === 'only-show-one') {
      temporarilyClosed.value = allKnownModals
    }
  }

  const closeTemporarily = (modalId: KnownModal) => {
    temporarilyClosed.value = [...temporarilyClosed.value, modalId]
  }

  return {
    firstTimeModalPreference,
    closeForever,
    closeTemporarily,
    currentlyOpenedModalType,
  }
}
