import {useState} from 'react'
import { useRoutes } from './routes/routes'
import {useAuth} from './hooks/auth.hook'
import {useReview} from './hooks/reviews.hook'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import { Context } from './context/Context'
import Header from './components/Header'

const App = () => {
  const [lightTheme, setLightTheme] = useState(JSON.parse(localStorage.getItem('theme') || true))
  const [isImage, setIsImage] = useState(false)
  const {token, login, logout, userId, userName} = useAuth()
  const {ratingAuth, imageUrl} = useReview()
  const isAuth = !!token
  const routes = useRoutes(isAuth)

  const styleBody = lightTheme 
    ? {maxHeight: '100vh', overflowY: 'auto', background: 'lavender', color: 'black'} 
    : {maxHeight: '100vh', overflowY: 'auto', background: '#505050', color: 'white'}

  return (
    <Context.Provider value={{
      userName, token, userId, login, logout, isAuth, ratingAuth, imageUrl, isImage, lightTheme
    }}>
      <div 
        style={styleBody} 
        className='position-fixed fixed-top fixed-right fixed-left fixed-bottom'
      >
        <Header isLightTheme={lightTheme} setIsLightTheme={setLightTheme}/>
        {routes}
      </div>
    </Context.Provider>
  )
}
  
export default App