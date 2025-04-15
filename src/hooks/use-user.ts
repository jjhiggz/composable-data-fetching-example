export const useRequiredUser = () => {
  const userId = localStorage.getItem('userId')
  if (!userId) throw new Error('Need a user id')
  return {
    userId,
  }
}
