import {useState} from 'react'
import { useRoutes } from './routes/routes'
import {useAuth} from './hooks/auth.hook'
import {useReview} from './hooks/reviews.hook'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './components/Header'
import { Context } from './context/Context'

const App = () => {
  const [lightTheme, setLightTheme] = useState(JSON.parse(localStorage.getItem('theme') || true))
  const [language, setLanguage] = useState(JSON.parse(localStorage.getItem('language')) || 'en')
  const [data, setData] = useState([])
  const [isImage, setIsImage] = useState(false)
  const [tagsList, setTagsList] = useState([])
  const {login, logout, userId, userName, role} = useAuth()
  const {ratingAuth, imageUrl} = useReview()
  const isAuth = !!userId
  const routes = useRoutes(isAuth, role)
  const styleBody = lightTheme 
    ? {maxHeight: '100vh', overflowY: 'auto', background: 'lavender', color: 'black'} 
    : {maxHeight: '100vh', overflowY: 'auto', background: '#505050', color: 'white'}

  return (
    <Context.Provider value={{
      userName, userId, login, logout, isAuth, ratingAuth, imageUrl, isImage, lightTheme, language, role, tagsList
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