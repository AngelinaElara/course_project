import { useRoutes } from './routes/routes'
import {useAuth} from './hooks/auth.hook'
import {useReview} from './hooks/reviews.hook'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import { Context } from './context/Context'

const App = () => {
  const {token, login, logout, userId, userName} = useAuth()
  const {ratingAuth, imageUrl} = useReview()
  const isAuth = !!token
  const routes = useRoutes(isAuth)

  return (
    <Context.Provider value={{
      userName, token, userId, login, logout, isAuth, ratingAuth, imageUrl
    }}>
      <div style={{background: 'lavender'}}>
        {routes}
      </div>
    </Context.Provider>
  )
}

export default App