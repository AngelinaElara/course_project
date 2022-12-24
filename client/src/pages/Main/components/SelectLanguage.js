import Form from 'react-bootstrap/Form'

const SelectLanguage = () => {
  return (
    <div >
      <p>Language</p>
      <Form.Select style={{width: '80px'}}>
        <option value='en'>EN</option>
        <option value='ru'>RU</option>
      </Form.Select>
    </div>
  )
}

export default SelectLanguage