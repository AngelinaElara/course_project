import {useState, useCallback, useEffect, useMemo, useContext} from 'react'
import { useRoutes } from './routes/routes'
import { useHttp } from './hooks/http.hook'
import {useAuth} from './hooks/auth.hook'
import {useReview} from './hooks/reviews.hook'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import Header from './components/Header'
import { Context } from './context/Context'
import { useAuth0 } from '@auth0/auth0-react'

const App = () => {
  const [lightTheme, setLightTheme] = useState(JSON.parse(localStorage.getItem('theme') || true))
  const [data, setData] = useState([])
  const [isImage, setIsImage] = useState(false)
  const {request} = useHttp()
  const {token, login, logout, userId, userName} = useAuth()
  const {ratingAuth, imageUrl} = useReview()
  const isAuth = !!token
  const routes = useRoutes(isAuth)
  const styleBody = lightTheme 
    ? {maxHeight: '100vh', overflowY: 'auto', background: 'lavender', color: 'black'} 
    : {maxHeight: '100vh', overflowY: 'auto', background: '#505050', color: 'white'}

  const fetchAllReviews = useCallback(async () => {
    try { 
      let getData = await request('/review', 'GET') 
      setData(getData)
    } catch (e) {
      console.error(e)
    }  
  }, [request])

  useEffect(() => {
    fetchAllReviews()
  }, [fetchAllReviews])

  return (
    <Context.Provider value={{
      userName, token, userId, login, logout, isAuth, ratingAuth, imageUrl, isImage, lightTheme
    }}>
      <div 
        style={styleBody} 
        className='position-fixed fixed-top fixed-right fixed-left fixed-bottom'
      >
        <Header isLightTheme={lightTheme} setIsLightTheme={setLightTheme} data={data}/>
        {routes}
      </div>
    </Context.Provider>
  )
}
  
export default App