import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [userName, setUserName] = useState(null)

  const login = useCallback((jwtToken, id, name) => {
    setToken(jwtToken)
    setUserId(id)
    setUserName(name)

    localStorage.setItem(storageName, JSON.stringify({
      userId: id, token: jwtToken, userName: name
    }))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUserId(null)
    setUserName(null)

    localStorage.removeItem(storageName)
  }, [])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName) || '{}')

    if(data && data.token) {
      login(data.token, data.userId, data.userName)
      console.log(userName)
    }
  }, [login])

  return {token, login, logout, userId, userName}
}