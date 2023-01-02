import { useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useHttp } from '../../../../hooks/http.hook'
import { Context } from '../../../../context/Context'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import CloseButton from 'react-bootstrap/CloseButton'
import Button from 'react-bootstrap/Button'

const CreateCategory = ({
  setIsNewCategoryOpen
}) => {
  const [categoryInputValue, setCategoryInputValue] = useState('')
  const [isError, setIsError] = useState(false)
  const [warning, setWarning] = useState('')
  const context = useContext(Context)
  const {request} = useHttp()
  const styleModal = context.lightTheme 
    ? {border: '1px solid gray', borderRadius: '5px', background: 'white', width: '80%', padding: '10px', color: 'black'} 
    : {border: '1px solid gray', borderRadius: '5px', background: '#A0A0A0', width: '80%', padding: '10px', color: 'white'}
  const { t } = useTranslation()

  const handleCloseBtnClick = () => {
    setIsNewCategoryOpen(false)
  } 

  const handleAddCategoryClick = async () => {
    try {
      if(categoryInputValue.search(/[^a-z]+/gi) === -1) {
        setCategoryInputValue('')
        setIsError(false)
        const addCategory = await request('/category/new', 'POST', {categoryInputValue})
      } else {
        setIsError(true)
        setWarning(t('latinLetters'))
        setTimeout(() => {
          setWarning('')
        }, 2000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div 
      className='position-fixed fixed-top fited-right fixed-left fixed-bottom'
      style={{zIndex: '1', background: 'rgba(0, 0, 0, 0.6)', padding: '10%', maxHeight: '100vh', overflowY: 'auto'}}
    >
      <Container
        className='position-relative d-flex justify-content-center align-items-center flex-column gap-3 p-3 mb-5'
        style={styleModal}
      >
        <CloseButton className='position-absolute' style={{top: '10px', right: '10px'}} onClick={handleCloseBtnClick}/>
          <h1 style={{marginTop: '10px', textAlign: 'center'}}>{t('newCategory')}</h1>
          <p>{t('latinLetters')}</p>
          <Form.Control 
            value={categoryInputValue}
            onChange={(event) => setCategoryInputValue(event.target.value)}
            style={{width: '80%', textTransform: 'lowercase'}}
            className={isError ? 'border-danger' : ''}
          />
          <div style={{color: 'red', fontSize: '12px'}}>{warning}</div>
          <Button onClick={handleAddCategoryClick}>{t('newCategory')}</Button>
      </Container>
    </div>
  )
}

export default CreateCategory