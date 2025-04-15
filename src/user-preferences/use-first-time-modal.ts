import { createUserPreference, useUserPreferences } from '@/hooks/use-user-preferences'
import type { FirstTimeModalPreference, KnownModals } from './user-preference.types'
import { computed, ref, type ComputedRef } from 'vue'
import type { Optional } from 'ts-toolbelt/out/Object/Optional'
import { useOptionalUser } from '@/hooks/use-auth'

export const useFirstTimeModal = () => {
  const preferencesQuery = useUserPreferences()
  const { mutateAsync: updateUserPreference } = createUserPreference()
  const { data: userData } = useOptionalUser()
  const temporarilyClosed = ref<KnownModals[]>([])

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

  const isModalMap = computed(() => {
    const seenModals = firstTimeModalPreference.value.seenModals

    // @ts-expect-error KnownModals is an enum, Object.values returns unknown[]
    return Object.values(KnownModals).reduce(
      (acc, modalId) => ({
        // @ts-expect-error KnownModals is an enum, Object.values returns unknown[]
        ...acc,
        // @ts-expect-error KnownModals is an enum, Object.values returns unknown[]
        [modalId]: !seenModals.includes(modalId) && !temporarilyClosed.value.includes(modalId),
      }),
      {} as Record<KnownModals, boolean>,
    )
  })

  const closeForever = async (modalId: KnownModals) => {
    const updatedSeenModals = [...firstTimeModalPreference.value.seenModals, modalId]
    await updateUserPreference({
      ...firstTimeModalPreference.value,
      seenModals: updatedSeenModals,
    })
  }

  const closeTemporarily = (modalId: KnownModals) => {
    temporarilyClosed.value = [...temporarilyClosed.value, modalId]
  }

  return {
    firstTimeModalPreference,
    isModalMap,
    closeForever,
    closeTemporarily,
  }
}
