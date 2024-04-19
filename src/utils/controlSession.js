import { useSessionStore } from '../stores/session'

export const checkIfNotLogged = () => {
  const data = useSessionStore()
  return !data.username || !data.password
}
