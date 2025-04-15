import { getUserPreferences, upsertUserPreference } from '@/fetch/get-user-preferences'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useOptionalUser } from './use-auth'
import { computed } from 'vue'

export const useUserPreferences = () => {
  const { data } = useOptionalUser()
  const userId = computed(() => data.value?.id ?? '')

  const result = useQuery({
    queryKey: ['preferences', userId],
    queryFn: () => getUserPreferences(userId.value),
  })

  return result
}

export const createUserPreference = () => {
  const { refetch } = useUserPreferences()
  const mutation = useMutation({
    mutationFn: upsertUserPreference,
    onSuccess: () => {
      refetch()
    },
  })

  return mutation
}
