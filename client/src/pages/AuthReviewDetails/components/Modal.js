import {useState, useContext} from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import CloseButton from 'react-bootstrap/CloseButton'
import Button from 'react-bootstrap/Button'
import Dropzone from '../../../components/Dropzone'
import StarRating from '../../../components/StarRating/StarRating'
import {useHttp} from '../../../hooks/http.hook'
import {Context} from '../../../context/Context'
import {storage} from '../../../firebase/index'
import {ref, uploadBytes  } from 'firebase/storage'

const Modal = ({
  review,
  setReview
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

  const handleAddTags = event => {
		if (event.target.value !== '') {
			setTags([...tags, {text: event.target.value, value: 0}])
			event.target.value = ''
		}
    console.log(tags)
	}

  const handleDeleteTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)])
  }

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
        <h1 style={{marginTop: '10px', textAlign: 'center'}}>Change review</h1>
        <CloseButton className='position-absolute' style={{top: '10px', right: '10px'}} onClick={handleCloseBtnClick}/>
        <Form 
          className='d-flex justify-content-center align-items-center flex-column gap-3 p-3 mb-5' 
          style={{width: '100%'}}
        >
          <Form.Group 
            style={{width: '90%'}}
          >
            <Form.Label htmlFor='title'>Title</Form.Label>
            <Form.Control 
              id='title' 
              placeholder='Name of the book/film and etc...' 
              value={inputTitleValue}
              onChange={(event) => setInputTitleValue(event.target.value)}
            />
          </Form.Group>

          <Form.Group 
            style={{width: '90%'}}
          >
            <Form.Label>Category</Form.Label>
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
            <Form.Label>Description</Form.Label>
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
            <Form.Label htmlFor='tags'>Tags</Form.Label>
            <div className='tags-input' style={{width: '100%'}}>
			        <ul id='tags'>
				      {tags.map((tag, index) => (
				  	    <li key={index} className='tag'>
				  		    <span className='tag-title'>{tag.text}</span>
				  		    <span className='tag-close-icon'
				  			    onClick={() => handleDeleteTags(index)}
				  		    >
				  			    <CloseButton />
				  		    </span>
				  	    </li>
				      ))}
			        </ul>
			        <Form.Control
				        type='text'
				        onKeyUp={event => event.key === 'Enter' ? handleAddTags(event) : null}
				        placeholder='Press enter to add tags'
                style={{textTransform: 'lowercase'}}
			        />
		        </div>
          </Form.Group>

          <Dropzone />
                
          <StarRating 
            rating={rating}
            setRating={setRating}
            lengthArray={10}
          />
          <Button style={{marginTop: '20px'}} onClick={handleSubmitBtnClick}>Change review</Button>
        </Form>
      </Container>
    </div>
  )
}

export default Modal