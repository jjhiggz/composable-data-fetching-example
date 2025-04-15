import { getUserPreferences, upsertUserPreference } from '@/fetch/get-user-preferences'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useRequiredUser } from './use-user'
export const useUserPreferences = () => {
  const { userId } = useRequiredUser()
  const result = useQuery({
    queryKey: ['preferences'],
    queryFn: () => getUserPreferences(userId),
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
