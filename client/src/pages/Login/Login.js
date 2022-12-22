import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {useState, useEffect, useContext} from 'react'
import { Context } from '../../context/Context'
import {useHttp} from '../../hooks/http.hook'
import {Link, useNavigate} from 'react-router-dom'
import { gapi } from 'gapi-script'
import OAuth from '../../components/OAuth/OAuth'

const Login = () => {
  const [inputEmailValue, setInputEmailValue] = useState('')
  const [inputPasswordValue, setInputPasswordValue] = useState('')
  const {request} = useHttp()
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

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_ID,
        scope: ''
      })
    }
  }, [])

  return (
    <div className='d-flex flex-column justify-content-center align-items-center' style={{padding: '80px 0'}}>
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
      <OAuth />
    </div>
  )
}

export default Login