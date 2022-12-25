import {useState, useContext, useEffect, useMemo} from 'react'
import Dropzone from '../../components/Dropzone'
import StarRating from '../../components/StarRating'
import {Context} from '../../context/Context'
import {useAuth} from '../../hooks/auth.hook'
import {useHttp} from '../../hooks/http.hook'
import {storage} from '../../firebase/index'
import {ref, uploadBytes  } from 'firebase/storage'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CloseButton from 'react-bootstrap/CloseButton'
import ListGroup from 'react-bootstrap/ListGroup'
import './style/tags.css'

const CreateReview = ({
  listTags
}) => {
  const [inputTitleValue, setInputTitleValue] = useState('')
  const [categoryValue, setCategoryValue] = useState('')
  const [inputDescriptionValue, setInputDescriptionValue] = useState('')
  const [tags, setTags] = useState([])
  const [tagValue, setTagValue] = useState('')
  const [filterTags, setFilterTags] = useState([])
  const [isResetImg, setIsResetImg] = useState(false)
  const [rating, setRating] = useState(0)
  const [isFromReset, setIsFormReset] = useState(false)
  const context = useContext(Context)
  const {userId, userName} = useAuth()
  const {request} = useHttp()
  const randomId = Date.now().toString(16) + Math.floor(Math.random() * 100000)
  const metadata = {
    contentType: 'image/jpeg',
  }
  const storageRef = ref(storage, `reviews/c${randomId}`)

  const handleDeleteTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)])
  }

  const handleAddTags = event => {
		if (event.target.value !== '') {
			setTags([...tags, {value: event.target.value, count: 0}])
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
      rating !== 0
      ) {
      try {
        const review = {
          from: userName,
          idFrom: userId,
          title : inputTitleValue,
          category: categoryValue,
          description: inputDescriptionValue,
          tags: tags, 
          img: context.isImage,
          ratingAuth: rating,
          randomId: `c${randomId}`
        }
        if(context.imageUrl !== null) {
          uploadBytes(storageRef, context.imageUrl, metadata).then((snapshot) => {
            console.log('Uploaded a blob or file!')
          }) 
        }
        const data = await request('/review/create', 'POST', review)
        setIsFormReset(true)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleTagsListClick = (event) => {
    setTags([...tags, {value: event.target.textContent, count: 0}])
    setTagValue('')
  }

  useEffect(() => {
    if(isFromReset) {
      setInputTitleValue('')
      setCategoryValue('')
      setInputDescriptionValue('')
      setTags([])
      setIsResetImg(true)
      setRating(0)
    }
  }, [isFromReset])

  useMemo(() => {
    if(tagValue && listTags) {
      const foundTags = listTags.filter(tag => {
        return tag.value.toLowerCase().includes(tagValue.toLowerCase())
      })
      setFilterTags(foundTags)
    }
  }, [tagValue])

  return (
    <div 
      className='d-flex justify-content-center align-items-center flex-column' 
      style={{paddingTop: '60px'}}
    >
      <h1 style={{marginTop: '10px'}}>New review</h1>
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
            <option value=''></option>
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
            maxLength={1500}
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
						    <span className='tag-title'>{tag.value}</span>
						    <span className='tag-close-icon'
							    onClick={() => handleDeleteTags(index)}
						    >
							    <CloseButton />
						    </span>
					    </li>
				    ))}
			      </ul>
            <div className='position-relative' style={{width: '100%'}}>
			        <Form.Control
				        type='text'
				        onKeyUp={event => event.key === 'Enter' ? handleAddTags(event) : null}
                onChange={(event) => setTagValue(event.target.value)}
				        placeholder='Press enter to add tags'
                style={{textTransform: 'lowercase', width: '100%'}}
                value={tagValue}
			        />
              <ListGroup 
                  as='ul' 
                  className='position-absolute' 
                  style={{width: '100%', top: '40px', maxHeight: '150px', height: 'auto', overflow: 'auto', padding: '0 8px'}}
                >
                  {tagValue && filterTags
                    ? filterTags.map((tag, index) => {
                      return ( 
                        <ListGroup.Item 
                          key={index} 
                          as='li'
                          onClick={(event) => handleTagsListClick(event)} 
                        >
                          {tag.value}
                        </ListGroup.Item>
                      )
                    })
                    : ''}
              </ListGroup>
		        </div>
          </div>
        </Form.Group>

        <Dropzone isResetImg={isResetImg}/>

        <div
          className='d-flex flex-column'
          style={{width: '90%'}}
        >
          <p>Leave your rating:</p>
          <StarRating 
            rating={rating}
            setRating={setRating}
            lengthArray={10}
          />
        </div>
        
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

export default CreateReview