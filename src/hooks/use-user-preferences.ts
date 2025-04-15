import { getUserPreferences, upsertUserPreference } from '@/fetch/get-user-preferences'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useRequiredUser } from './use-auth'
export const useUserPreferences = () => {
  const { user } = useRequiredUser()
  const result = useQuery({
    queryKey: ['preferences'],
    queryFn: () => getUserPreferences(user.value.id),
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
