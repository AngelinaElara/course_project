import {useState, useEffect, useContext} from 'react'
import { Context } from '../../../context/Context'
import Form from 'react-bootstrap/Form'

const SelectLanguage = () => {
  const [languageValue, setLanguageValue] = useState(JSON.parse(localStorage.getItem('language')) || 'en')
  const context = useContext(Context)

  const handleLanguageSelectChange = (event) => {
    setLanguageValue(event.target.value)
    context.language = event.target.value
  }

  useEffect(() => {
    localStorage.setItem('language', JSON.stringify(context.language))
  }, [context.language])

  return (
    <div >
      <p>Language</p>
      <Form.Select 
        style={{width: '80px'}}
        value={languageValue}
        onChange={handleLanguageSelectChange}
      >
        <option value='en'>EN</option>
        <option value='ru'>RU</option>
      </Form.Select>
    </div>
  )
}

export default SelectLanguage