import {useState, useContext, useEffect} from 'react'
import {Link} from 'react-router-dom'
import DropzoneComponent from './components/DropZone/Dropzone'
import StarRating from './components/StarRating/StarRating'
import {Context} from '../../context/Context'
import {useHttp} from '../../hooks/http.hook'
import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes  } from 'firebase/storage'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'
import './style/tags.css'
import backBtn from '../../ui/backBtn.png'

const firebaseConfig = {
  authDomain: 'course-724b1.firebaseapp.com',
  projectId: 'course-724b1',
  storageBucket: 'course-724b1.appspot.com'
}

const metadata = {
  contentType: 'image/jpeg',
}

const Review = () => {
  const [userName, setUserName] = useState(JSON.parse(localStorage.getItem('userData')).userName || {})
  const [inputTitleValue, setInputTitleValue] = useState('')
  const [categoryValue, setCategoryValue] = useState('')
  const [inputDescriptionValue, setInputDescriptionValue] = useState('')
  const [tags, setTags] = useState([])
  const [rating, setRating] = useState(0)
  const [isFromReset, setIsFormReset] = useState(false)

  useEffect(() => {
    if(isFromReset) {
      setInputTitleValue('')
      setCategoryValue('')
      setInputDescriptionValue('')
      setTags([])
      setRating(0)
    }
  }, [isFromReset])

  const context = useContext(Context)
  const {request} = useHttp()

  const app = initializeApp(firebaseConfig)
  const storage = getStorage(app)
  const storageRef = ref(storage, `${inputTitleValue}`)

  const handleDeleteTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)])
  }

  const handleAddTags = event => {
		if (event.target.value !== '') {
			setTags([...tags, event.target.value])
			event.target.value = ''
		}
	}

  const handleSubmitButtonClick = async (event) => {
    event.preventDefault()
    if(userName.length && 
      inputTitleValue.length &&
      categoryValue.length &&
      inputDescriptionValue.length &&
      tags.length &&
      rating != 0
      ) {
      try {
        const review = {
            from: userName,
            title : inputTitleValue,
            category: categoryValue,
            description: inputDescriptionValue,
            tags: tags, 
            ratingAuth: rating
        }
        uploadBytes(storageRef, context.imageUrl, metadata).then((snapshot) => {
          console.log('Uploaded a blob or file!')
        })
        const data = await request('/review/create', 'POST', review)
        setIsFormReset(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className='d-flex justify-content-center align-items-center flex-column position-relative'>
      <Link to='/' className='position-absolute' style={{top: '10px', left: '40px'}}>
        <img 
          src={backBtn}
          alt='back button'
          style={{width: '40px', height: '40px'}}
        />
      </Link>
      <h1 style={{marginTop: '10px'}}>New review</h1>
      <Form 
        className='d-flex justify-content-center align-items-center flex-column p-3 mb-5' 
        style={{width: '100%'}}
      >
        <Form.Group 
          className='mb-3'
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
          className='mb-3'
          style={{width: '90%'}}
        >
          <Form.Label>Category</Form.Label>
          <Form.Select 
            onChange={(event) => setCategoryValue(event.target.value)} 
          >
            <option></option>
            <option value='films'>Films</option>
            <option value='books'>Books</option>
            <option value='games'>Games</option>
          </Form.Select>
        </Form.Group>

        <Form.Group 
          className='mb-3'
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
          className='mb-3'
          style={{width: '90%'}}
        >
          <Form.Label htmlFor='tags'>Tags</Form.Label>
          <div className='tags-input' style={{width: '100%'}}>
			      <ul id='tags'>
				    {tags.map((tag, index) => (
					    <li key={index} className='tag'>
						    <span className='tag-title'>{tag}</span>
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
			      />
		      </div>
        </Form.Group>

        <DropzoneComponent />

        <Form.Group
          className='mb-3 d-flex flex-column'
          style={{width: '90%'}}
        >
          <Form.Label>Leave your rating:</Form.Label>
          <StarRating 
            rating={rating}
            setRating={setRating}
          />
        </Form.Group>
        
        <Button 
          className='mt-2' 
          type='submit'
          onClick={handleSubmitButtonClick}
        >
          Leave feedback
        </Button>
      </Form>
    
    </div>
  )
}

export default Review