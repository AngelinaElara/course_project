import {useState, useContext} from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import CloseButton from 'react-bootstrap/CloseButton'
import Button from 'react-bootstrap/Button'
import Dropzone from '../../../components/Dropzone'
import StarRating from '../../../components/StarRating'
import Tags from '../../../components/Tags/Tags'
import {useHttp} from '../../../hooks/http.hook'
import {Context} from '../../../context/Context'
import {storage} from '../../../firebase/index'
import {ref, uploadBytes  } from 'firebase/storage'

const Modal = ({
  review,
  setReview,
  t,
  allTags
}) => {
  const [inputTitleValue, setInputTitleValue] = useState(review.title)
  const [categoryValue, setCategoryValue] = useState(review.category)
  const [inputDescriptionValue, setInputDescriptionValue] = useState(review.description)
  const [tags, setTags] = useState(review.tags)
  const [rating, setRating] = useState(review.ratingAuth)
  const reviewId = review._id
  const {request} = useHttp()
  const context = useContext(Context)
  const metadata = {
    contentType: 'image/jpeg',
  }
  const storageRef = ref(storage, `reviews/c${review.randomId}`)
  const styleModal = context.lightTheme 
    ? {border: '1px solid gray', borderRadius: '5px', background: 'white', width: '80%', padding: '10px', color: 'black'} 
    : {border: '1px solid gray', borderRadius: '5px', background: '#A0A0A0', width: '80%', padding: '10px', color: 'white'}

  const handleCloseBtnClick = () => {
    setReview(false)
  }  

  const handleSubmitBtnClick = async () => {
    try {
      const modifiedReview = {
        title : inputTitleValue,
        category: categoryValue,
        description: inputDescriptionValue,
        tags: tags, 
        img: context.isImage,
        ratingAuth: rating,
      } 
      console.log(tags)
      if(context.imageUrl !== null) {
        uploadBytes(storageRef, context.imageUrl, metadata).then((snapshot) => {
          console.log('Uploaded a blob or file!')
        }) 
      }
      setReview(false)
      const sendData = await request(`/review/change/${reviewId}`, 'PATCH', modifiedReview)
    } catch (error) {
      console.error(error)
    }
  } 

  return (
    <div 
      className='position-fixed fixed-top fited-right fixed-left fixed-bottom'
      style={{zIndex: '1', background: 'rgba(0, 0, 0, 0.6)', padding: '15px', maxHeight: '100vh', overflowY: 'auto'}}
    >
      <Container 
        className='position-relative'
        style={styleModal}
      >
        <h1 style={{marginTop: '10px', textAlign: 'center'}}>{t('changeReview')}</h1>
        <CloseButton className='position-absolute' style={{top: '10px', right: '10px'}} onClick={handleCloseBtnClick}/>
        <Form 
          className='d-flex justify-content-center align-items-center flex-column gap-3 p-3 mb-5' 
          style={{width: '100%'}}
        >
          <Form.Group 
            style={{width: '90%'}}
          >
            <Form.Label htmlFor='title'>{t('title')}</Form.Label>
            <Form.Control 
              id='title' 
              value={inputTitleValue}
              onChange={(event) => setInputTitleValue(event.target.value)}
            />
          </Form.Group>

          <Form.Group 
            style={{width: '90%'}}
          >
            <Form.Label>{t('category')}</Form.Label>
            <Form.Select 
              onChange={(event) => setCategoryValue(event.target.value)} 
              value={categoryValue}
            >
              <option></option>
              <option value='films'>Films</option>
              <option value='books'>Books</option>
              <option value='games'>Games</option>
            </Form.Select>
          </Form.Group>

          <Form.Group 
            style={{width: '90%'}}
          >
            <Form.Label>{t('description')}</Form.Label>
            <Form.Control 
              as='textarea' 
              rows={5}
              value={inputDescriptionValue}
              onChange={(event) => setInputDescriptionValue(event.target.value)}
            /> 
          </Form.Group>

          <Form.Group 
            style={{width: '90%'}}
          >
            <Form.Label htmlFor='tags'>{t('tags')}</Form.Label>
            <Tags 
              review={review}
              allTags={allTags}
              tags={tags}
              setTags={setTags}
            />
          </Form.Group>

          <Dropzone />
                
          <StarRating 
            rating={rating}
            setRating={setRating}
            lengthArray={10}
          />
          <Button style={{marginTop: '20px'}} onClick={handleSubmitBtnClick}>{t('changeReview')}</Button>
        </Form>
      </Container>
    </div>
  )
}

export default Modal 