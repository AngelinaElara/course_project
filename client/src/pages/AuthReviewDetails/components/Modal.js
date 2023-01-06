import {useState, useContext, useCallback, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
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
import JoditEditor from 'jodit-react'

const config = {
  width: 'auto',
  buttons: ['source', '|',
  'bold',
  'strikethrough',
  'underline',
  'italic', '|',
  'ul',
  'ol', '|',
  'outdent', 'indent',  '|',
  'font',
  'fontsize',
  'brush',
  'paragraph', '|',
  'link', '|',
  'align', 'undo', 'redo', '|',
  'hr',
  'eraser',
  'copyformat', '|',
  'fullsize',
  'print']
}

const Modal = ({
  review,
  setReview,
  t
}) => {
  const [data, setData] = useState([])
  const [inputTitleValue, setInputTitleValue] = useState(review.title)
  const [categoryValue, setCategoryValue] = useState(review.category)
  const [inputDescriptionInitialValue, setInputDescriptionInitialValue] = useState(review.description)
  const [tags, setTags] = useState(review.tags)
  const [allTags, setAllTags] = useState([])
  const [rating, setRating] = useState(review.ratingAuth)
  const [categories, setCategories] = useState([])
  const reviewId = review._id
  const {request} = useHttp()
  const context = useContext(Context)
  const navigate = useNavigate()
  const editor = useRef(null)
  const metadata = {
    contentType: 'image/jpeg',
  }
  const storageRef = ref(storage, `reviews/c${review.randomId}`)
  const styleModal = context.lightTheme 
    ? {border: '1px solid gray', borderRadius: '5px', background: 'white', width: '80%', padding: '10px', color: 'black'} 
    : {border: '1px solid gray', borderRadius: '5px', background: '#A0A0A0', width: '80%', padding: '10px', color: 'white'}

    const handleGetListTags = useCallback(async () => {
      try {
        let getData = await request('/review', 'GET')
        setData(getData)
      } catch (error) {
        console.log(error)
      }
    }, [request])

    const handleGetCategories = useCallback(async () => {
      try {
        const getCategories = await request('/category/all', 'GET')
        setCategories(getCategories)
      } catch (error) {
        console.log(error)
      }
    }, [request])

  const handleCloseBtnClick = () => {
    setReview(false)
    navigate(`/review/${review._id}`)
  }  

  const handleSubmitBtnClick = async () => {
    try {
      const modifiedReview = {
        title : inputTitleValue,
        category: categoryValue,
        description: inputDescriptionInitialValue,
        tags: tags, 
        // If the user does not change the image, then the value from the database remains, otherwise true (changed the image)
        img: !context.isImage ? review.img : context.isImage,
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

  const handleInputDescriptionChange = (value) => {
    setInputDescriptionInitialValue(value)
  }

  useEffect(() => {
    handleGetListTags()
  }, [handleGetListTags])

  useEffect(() => {
    handleGetCategories()
  }, [handleGetCategories])

   useEffect(() => {
    if(data) { 
      data.map(review => allTags.push(review.tags))
      const removeDuplicateObject = allTags.flat().reduce((acc, i) => {
        if(!acc.find(tag => tag.value == i.value)) {
          acc.push(i)
        }
        return acc
      }, [])
      setAllTags(removeDuplicateObject)
    }
  }, [data])

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
              style={{textTransform: 'capitalize'}}
            >
              <option></option>
              {categories && categories.map(category => {
                return (
                  <option
                    value={category.category}
                    style={{textTransform: 'capitalize'}} 
                  >
                    {category.category}
                  </option>
                )
              })}
            </Form.Select>
          </Form.Group>

          <Form.Group 
            style={{width: '90%'}}
          >
          <Form.Label>{t('description')}*</Form.Label>
            <div style={{color: 'black'}}>
              <JoditEditor
                value={inputDescriptionInitialValue}
                ref={editor}
                config={config}
                tabIndex={1}
                onChange={(newContent) => handleInputDescriptionChange(newContent)}
              />
            </div>
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