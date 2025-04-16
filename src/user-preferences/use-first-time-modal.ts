import { createUserPreference, useUserPreferences } from '@/user-preferences/use-user-preferences'
import {
  allKnownModals,
  type FirstTimeModalPreference,
  type KnownModal,
} from './user-preference.types'
import { computed, ref, type ComputedRef } from 'vue'
import type { Optional } from 'ts-toolbelt/out/Object/Optional'
import { useOptionalUser } from '@/hooks/use-auth'

export const useFirstTimeModal = ({
  closeMode = 'show-in-sequence',
}: {
  closeMode?: 'show-in-sequence' | 'only-show-one'
} = {}) => {
  const preferencesQuery = useUserPreferences()
  const { mutateAsync: updateUserPreference } = createUserPreference()
  const { data: userData } = useOptionalUser()
  const temporarilyClosed = ref<KnownModal[]>([])

  type FirstTimeModalPreferenceOptional = Optional<FirstTimeModalPreference, 'id'>
  const firstTimeModalPreference: ComputedRef<FirstTimeModalPreferenceOptional> = computed(() => {
    if (!userData.value) {
      throw new Error('Cannot use first time modal preference without user')
    }
    const existingPreference = preferencesQuery.data?.value?.find(
      (preference) => preference.group === 'first-time-modal',
    )
    if (existingPreference) {
      return existingPreference as FirstTimeModalPreference
    }
    return {
      group: 'first-time-modal',
      user: userData.value.id,
      preferences: [],
    }
  })

  const currentlyOpenedModalType = computed(() => {
    return allKnownModals.find((modalType) => {
      if (preferencesQuery.isLoading.value) {
        return false
      }
      if (
        firstTimeModalPreference.value.preferences.some(
          (pref) => pref.key === modalType && pref.value === 'true',
        )
      ) {
        return false
      }
      if (temporarilyClosed.value.includes(modalType)) {
        return false
      }
      return true
    })
  })

  const closeForever = async (modalId: KnownModal) => {
    await updateUserPreference({
      ...firstTimeModalPreference.value,
      preferences: [...firstTimeModalPreference.value.preferences, { key: modalId, value: 'true' }],
    })
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
