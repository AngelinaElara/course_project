import {useState, useEffect, useContext} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useHttp} from '../../hooks/http.hook'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import {
  validateInputNameValue,
  validateInputEmailValue,
  validateInputPasswordValue
} from '../../utils/helpers'
import { Context } from '../../context/Context'
import { useAuth } from '../../hooks/auth.hook'
import {GoogleLogin} from 'react-google-login'
import { gapi } from 'gapi-script'

const Authorization = () => {
  const [inputNameValue, setInputNameValue] = useState('')
  const [inputEmailValue, setInputEmailValue] = useState('')
  const [inputPasswordValue, setInputPasswordValue] = useState('')
  const [inputConfirmPasswordValue, setInputConfirmPasswordValue] = useState('')
  const [isFormReset, setIsFormReset] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(true)
  const {loading, error, request} = useHttp()
  const context = useContext(Context)
  const navigate = useNavigate()

  const inputNameClassName = inputNameValue.length
    ? ` m-2 p-2 shadow-sm rounded ${validateInputNameValue(inputNameValue)
      ? 'border-success'
      : 'border-danger'
    }`
    : 'm-2 p-2 shadow-sm rounded border border-light'

  const inputEmailClassName = inputEmailValue.length
    ? ` m-2 p-2 shadow-sm rounded ${validateInputEmailValue(inputEmailValue)
      ? 'border-success'
      : 'border-danger'
    }`
    : 'm-2 p-2 shadow-sm rounded border border-light'

  const inputPasswordClassName = inputPasswordValue.length
    ? ` m-2 p-2 shadow-sm rounded ${validateInputPasswordValue(inputPasswordValue)
      ? 'border-success'
      : 'border-danger'
    }`
    : 'm-2 p-2 shadow-sm rounded border border-light'

  const inputConfirmPasswordClassName = inputConfirmPasswordValue.length
    ? inputConfirmPasswordValue === inputPasswordValue
      ? 'm-2 p-2 shadow-sm rounded border-success'
      : 'm-2 p-2 shadow-sm rounded border-danger'
    : 'm-2 p-2 shadow-sm rounded border border-light'

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    try {
      if (inputPasswordValue === inputConfirmPasswordValue) {
        const form = {
          name: inputNameValue,
          email: inputEmailValue,
          password: inputPasswordValue,
        }
        const data = await request('auth/register', 'POST', form)
        console.log(data)
        setIsFormReset(true)
        context.login(data.token, data.UserId, data.name)
        navigate('/')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onSucces = async (res) => {
    console.log('Success')
    try {
      const form = {
        name: res.profileObj.givenName,
        email: res.profileObj.email,
      }
      const data = await request('google/auth/login', 'POST', form)
      context.login(data.token, data.UserId, data.name)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  const onFailure = (res) => {
    console.log('Login failed', res)
  }

  useEffect(() => {
    if (isFormReset) {
      setInputNameValue('')
      setInputEmailValue('')
      setInputPasswordValue('')
      setInputConfirmPasswordValue('')
    }
  }, [isFormReset])

  useEffect(() => {
    if( validateInputNameValue(inputNameValue)
      && validateInputEmailValue(inputEmailValue)
      && validateInputPasswordValue(inputPasswordValue)
      && inputPasswordValue === inputConfirmPasswordValue) {
        setIsButtonDisabled(false)
    } else {
      setIsButtonDisabled(true)
    }
  }, [
    inputNameValue,
    inputEmailValue,
    inputPasswordValue,
    inputConfirmPasswordValue
  ])

  useEffect(() => {
    const start = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_ID,
        scope: ''
      })
    }
  }, [])

  return (
    <div className='d-flex flex-column justify-content-center align-items-center'>
      <h1 className='text-secondary'>Authorization</h1>
      <Form className='d-flex flex-column justify-content-center align-items-center border p-3 rounded shadow-lg mb-5'>
        <input 
          className={inputNameClassName}
          style={{height: '40px', outline: 'none'}} 
          type={'text'} 
          placeholder='Name'
          name='name'
          value={inputNameValue}
          onChange={(event) => setInputNameValue(event.target.value)}
        />
        <input
          className={inputEmailClassName}
          style={{height: '40px', outline: 'none'}} 
          type={'email'} 
          placeholder='E-mail'
          name='email'
          value={inputEmailValue}
          onChange={(event) => setInputEmailValue(event.target.value)}
        />
        <input
          className={inputPasswordClassName}
          style={{height: '40px', outline: 'none'}} 
          type={'password'} 
          placeholder='Password'
          name='password'
          value={inputPasswordValue}
          onChange={(event) => setInputPasswordValue(event.target.value)}
        />
        <input
          className={inputConfirmPasswordClassName} 
          style={{height: '40px', outline: 'none'}} 
          type={'password'} 
          placeholder='Confirm password'
          name='confirmPassword'
          value={inputConfirmPasswordValue}
          onChange={(event) => setInputConfirmPasswordValue(event.target.value)}
        />
        <Button  
          variant='secondary'
          className='m-2' 
          style={{width: '80%'}}
          type='submit'
          onClick={handleFormSubmit}
          disabled={isButtonDisabled}
        >
          Registration
        </Button >
      </Form>
      <p>Do you have account? <Link to='/login'>Login</Link></p>

      <GoogleLogin 
        clientId={process.env.REACT_APP_GOOGLE_ID}
        onSuccess={onSucces}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  )
}

export default Authorization