import {useState} from 'react'
import { useRoutes } from './routes/routes'
import {useAuth} from './hooks/auth.hook'
import {useReview} from './hooks/reviews.hook'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import { Context } from './context/Context'
import Header from './components/Header'

const App = () => {
  const [isLightTheme, setIsLightTheme] = useState(true)
  const {token, login, logout, userId, userName} = useAuth()
  const {ratingAuth, imageUrl} = useReview()
  const isAuth = !!token
  const routes = useRoutes(isAuth)

  return (
    <Context.Provider value={{
      userName, token, userId, login, logout, isAuth, ratingAuth, imageUrl, isLightTheme
    }}>
      <div style={{background: 'lavender'}} className='position-fixed fixed-top fixed-right fixed-left fixed-bottom'>
        <Header />
        {routes}
      </div>
    </Context.Provider>
  )
}
  
export default App