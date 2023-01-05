import {useEffect, useCallback, useState, useContext} from 'react'
import { useHttp } from '../../hooks/http.hook'
import {useSearchParams, useNavigate} from 'react-router-dom'
import { Context } from '../../context/Context'
import { useTranslation } from 'react-i18next'

const ConfirmEmail = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const {request} = useHttp()
  const context = useContext(Context)
  const token = searchParams.get('token')
  const { t } = useTranslation()

  const handleConfirmUser = useCallback(async () => {
    try {
      const data = await request('auth/verify', 'POST', {token})
      context.login(data.UserId, data.name, data.role)
      setTimeout(() => {
        navigate('/')
        window.location.reload()
      }, 2000)
    } catch(error) {
      console.log(error)
    }
  }, [request])

  useEffect(() => {
    handleConfirmUser()
  }, [handleConfirmUser])

  return (
    <h1 style={{textAlign: 'center', marginTop: '30px'}}>{t('confirmEmail')}...</h1>
  )
}

export default ConfirmEmail