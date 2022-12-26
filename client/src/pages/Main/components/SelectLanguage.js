import {useState, useEffect, useContext} from 'react'
import { Context } from '../../../context/Context'
import Form from 'react-bootstrap/Form'
import { useTranslation } from 'react-i18next'

const SelectLanguage = () => {
  const [languageValue, setLanguageValue] = useState(JSON.parse(localStorage.getItem('language')) || 'en')
  const context = useContext(Context)
  const { t, i18n } = useTranslation()

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value)
    setLanguageValue(event.target.value)
    context.language = event.target.value
  }

  useEffect(() => {
    localStorage.setItem('language', JSON.stringify(context.language))
  }, [context.language])

  return (
    <div >
      <p>{t('language')}</p>
      <Form.Select 
        style={{width: '80px'}}
        value={languageValue}
        onChange={changeLanguage}
      >
        <option value='en'>EN</option>
        <option value='ru'>RU</option>
      </Form.Select>
    </div>
  )
}

export default SelectLanguage