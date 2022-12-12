import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {useState, useEffect, useContext} from 'react'
import { Context } from '../../context/Context'
import {useHttp} from '../../hooks/http.hook'
import {Link, useNavigate} from 'react-router-dom'
import {GoogleLogin} from 'react-google-login'
import { gapi } from 'gapi-script'

const Login = () => {
  const [inputEmailValue, setInputEmailValue] = useState('')
  const [inputPasswordValue, setInputPasswordValue] = useState('')

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId: '821249073341-h8c7v2inrg8gsrvj5qjkpg7bfge1ubn6.apps.googleusercontent.com',
        scope: ''
      })
    }
  }, [])

  const {loading, request} = useHttp()
  const context = useContext(Context)

  const navigate = useNavigate()

  const handleFormSubmit = async () => {
    try {
      const form = {
        email: inputEmailValue,
        password: inputPasswordValue
      }     
      const data = await request('/auth/login', 'POST', form)
      context.login(data.token, data.UserId, data.name)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  const onSucces = async (res) => {
    console.log('Success', res.profileObj)
    try {
      const form = {
        name: res.profileObj.givenName,
        email: res.profileObj.email,
      }
      const data = await request('auth/register', 'POST', form)
      context.login(data.token, data.UserId, data.name)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  const onFailure = (res) => {
    console.log('Login failed', res)
  }

  return (
    <div className='d-flex flex-column justify-content-center align-items-center'>
      <h1 className='text-secondary'>Login</h1>
      <Form className='d-flex flex-column justify-content-center align-items-center border p-3 rounded shadow-lg mb-5'>
        <Form.Control 
          className='m-2 p-2 shadow-sm border border-light rounded' 
          style={{height: '40px'}} 
          type={'email'} 
          placeholder='E-mail'
          name='email'
          value={inputEmailValue}
          onChange={(event) => setInputEmailValue(event.target.value)}
        />
        <Form.Control 
          className='m-2  p-2 shadow-sm border border-light rounded' 
          style={{height: '40px'}} 
          type={'password'} 
          placeholder='Password'
          name='password'
          value={inputPasswordValue}
          onChange={(event) => setInputPasswordValue(event.target.value)}
        />

        <Button 
          variant='secondary'
          className='m-2' 
          onClick={handleFormSubmit}
        >
          Login
        </Button>
      </Form>
      <p>Don't have an account? <Link to='/authorization'>Authorization</Link></p>
      <GoogleLogin 
        clientId={'821249073341-h8c7v2inrg8gsrvj5qjkpg7bfge1ubn6.apps.googleusercontent.com'}
        onSuccess={onSucces}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  )
}

export default Login