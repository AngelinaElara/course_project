import {useState, useCallback, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

const storageName = 'userData'

export const useAuth = () => {
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState(null)
  const [role, setRole] = useState(null)
  const navigate = useNavigate()

  const login = useCallback(( id, name, getRole) => {
    setUserId(id)
    setUserName(name)
    setRole(getRole)

    localStorage.setItem(storageName, JSON.stringify({
      userId: id, userName: name, role: getRole
    }))
  }, [])

  const logout = useCallback(() => {
    setUserId(null)
    setUserName(null)
    setRole(null)

    localStorage.removeItem(storageName)
    navigate('/')
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName) || '{}')

    if(data && data.userId) {
      login(data.userId, data.userName, data.role)
    }
  }, [login])

  return {login, logout, userId, userName, role}
}