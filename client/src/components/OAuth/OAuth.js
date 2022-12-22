import { useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Context } from '../../context/Context'
import Button from 'react-bootstrap/Button'
import {ReactComponent as GoogleIcon} from '../../ui/googleIcon.svg'

const OAuth = () => {
  const context = useContext(Context)
  const navigate = useNavigate('/')

  const fetchAuthUser = async (route) => {
    const response = await axios
      .get(`http://5-180-180-221.cloud-xip.com:5000/${route}`, { withCredentials: true })
      .catch((err) => {
        navigate('/login/error')
      })

    if (response && response.data) {
      context.login(response.data.token, response.data.UserId, response.data.name)
      window.location.reload()
    }
  }

  const handleGoogleClick = async () => {
    let timer
    const login = 'http://5-180-180-221.cloud-xip.com:5000/api/v1/login/google'
    const newWindow = window.open(login, '_blank', 'width=500,height=600')
    if (newWindow) {
      timer = setInterval(() => {
        if (newWindow.closed) {
          fetchAuthUser('api/v1/auth/user')
          navigate('/')
          if (timer) clearInterval(timer)
        }
      }, 500)
    }
  } 

  const handleVKClick = () => {
    let timer
    const login = 'http://5-180-180-221.cloud-xip.com:5000/api/login/vk'
    const newWindow = window.open(login, '_blank', 'width=500,height=600')
    if (newWindow) {
      timer = setInterval(() => {
        if (newWindow.closed) {
          fetchAuthUser('api/auth/user')
          if (timer) clearInterval(timer)
          navigate('/')
        }
      }, 500)
    }
  }

  return (
    <div className='d-flex flex-column gap-2'>
      <Button    
        variant='light' 
        onClick={handleGoogleClick} 
        className='d-flex align-items-center justify-content-between flex-row gap-3'
      >
        <div>
          <GoogleIcon style={{width: '30px', height: '30px'}}/>
        </div>
        <span>Sing in with Google</span>
      </Button>
      <Button    
        onClick={handleVKClick} 
        className='d-flex align-items-center justify-content-center flex-row gap-3'
      >
        <span>Sing in with Vkontakte</span>
      </Button>
    </div>
  ) 

}

export default OAuth