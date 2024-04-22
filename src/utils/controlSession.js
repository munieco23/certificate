import { useSessionStore } from '../stores/session'

export const checkIfNotLogged = () => {
  const data = useSessionStore()
  return !data.stored.username || !data.stored.password
}
