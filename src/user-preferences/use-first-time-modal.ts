import { createUserPreference, useUserPreferences } from '@/hooks/use-user-preferences'
import {
  allKnownModals,
  type FirstTimeModalPreference,
  type KnownModal,
} from './user-preference.types'
import { computed, ref, type ComputedRef } from 'vue'
import type { Optional } from 'ts-toolbelt/out/Object/Optional'
import { useOptionalUser } from '@/hooks/use-auth'

export const useFirstTimeModal = () => {
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
      seenModals: [],
    }
  })

  const currentlyOpenedModalType = computed(() => {
    return allKnownModals.find((modalType) => {
      if (firstTimeModalPreference.value.seenModals.includes(modalType)) {
        return false
      }
      if (temporarilyClosed.value.includes(modalType)) {
        return false
      }
      return true
    })
  })

  const closeForever = async (modalId: KnownModal) => {
    const updatedSeenModals = [...firstTimeModalPreference.value.seenModals, modalId]
    await updateUserPreference({
      ...firstTimeModalPreference.value,
      seenModals: updatedSeenModals,
    })
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
