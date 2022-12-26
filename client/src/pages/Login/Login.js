import {useState, useContext} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Context } from '../../context/Context'
import {useHttp} from '../../hooks/http.hook'
import {Link, useNavigate} from 'react-router-dom'
import OAuth from '../../components/OAuth/OAuth'
import { useTranslation } from 'react-i18next'
import {
  validateInputEmailValue,
  validateInputPasswordValue
} from '../../utils/helpers'

const Login = () => {
  const [inputEmailValue, setInputEmailValue] = useState('')
  const [inputPasswordValue, setInputPasswordValue] = useState('')
  const {request} = useHttp()
  const context = useContext(Context)
  const navigate = useNavigate()
  const { t } = useTranslation()

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

  const handleFormSubmit = async () => {
    try {
      const form = {
        email: inputEmailValue,
        password: inputPasswordValue
      }     
      const data = await request('/auth/login', 'POST', form)
      context.login(data.token, data.UserId, data.name)
      navigate('/')
      window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='d-flex flex-column justify-content-center align-items-center' style={{padding: '80px 0'}}>
      <h1 className='text-secondary'>{t('login')}</h1>
      <Form className='d-flex flex-column justify-content-center align-items-center border p-3 rounded shadow-lg mb-5'>
        <Form.Control 
          className={inputEmailClassName}
          style={{height: '40px'}} 
          type={'email'} 
          placeholder='E-mail'
          name='email'
          value={inputEmailValue}
          onChange={(event) => setInputEmailValue(event.target.value)}
        />
        <Form.Control 
          className={inputPasswordClassName}
          style={{height: '40px'}} 
          type={'password'} 
          placeholder={t('password')}
          name='password'
          value={inputPasswordValue}
          onChange={(event) => setInputPasswordValue(event.target.value)}
        />

        <Button 
          variant='secondary'
          className='m-2' 
          onClick={handleFormSubmit}
        >
          {t('login')}
        </Button>
      </Form>
      <p>{t("haven'tAccount")} <Link to='/authorization'>{t('authorization')}</Link></p>
      <OAuth />
    </div>
  )
}

export default Login