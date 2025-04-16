import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

export interface User {
  id: string
}

const USER_QUERY_KEY = ['user'] as const

const getStoredUser = (): User | null => {
  const userId = localStorage.getItem('userId')
  return userId ? { id: userId } : null
}

export const useOptionalUser = () => {
  return useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: getStoredUser,
    staleTime: Infinity, // User data won't go stale until explicitly invalidated
    gcTime: Infinity, // Keep the data in cache indefinitely
  })
}

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => {
      localStorage.setItem('userId', userId)
      return Promise.resolve({ id: userId })
    },
    onSuccess: (user) => {
      queryClient.setQueryData(USER_QUERY_KEY, user)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => {
      localStorage.removeItem('userId')
      return Promise.resolve()
    },
    onSuccess: () => {
      queryClient.setQueryData(USER_QUERY_KEY, null)
      // Invalidate all queries that might depend on the user
      queryClient.invalidateQueries()
    },
  })
}
