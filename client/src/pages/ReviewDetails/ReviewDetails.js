import { useState, useEffect, useCallback, useContext, useMemo } from 'react'
import {useParams} from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import { useAuth } from '../../hooks/auth.hook'
import {Context} from '../../context/Context'
import { storage } from '../../firebase/index'
import { ref, getDownloadURL} from 'firebase/storage'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import gray from '../../ui/gray.jpg'

const ReviewDetails = () => {
  const [review, setReview] = useState({})
  const [commentValue, setCommentValue] = useState('')
  const [commentsArray, setCommentsArray] = useState([])
  const [quantityCreatorLike, setQuantityCreatorLike] = useState(0)
  let {id}  = useParams()
  const {request} = useHttp()
  const {userId, userName, token} = useAuth()
  const isAuth = !!token

  const fetchReview = useCallback(async () => {
    try { 
      let getData = await request(`/review/${id}`, 'GET')
      setReview(getData)
    } catch (e) {
      console.error(e)
    } 
  }, [id])

  useEffect(() => {
    setTimeout(async () => {
      const getComments = await request(`review/comment/${id}`, 'GET')
      setCommentsArray(getComments)
    }, 2000)
  }, [])

  const handleCommentBtnClick = async () => {
    try {
      const comment = {
        from: userName, 
        text: commentValue,
        date: new Date(Date.now()).toLocaleString().split(',')[0]
      }
      const sendData = await request(`review/comment/${review._id}`, 'PATCH', comment)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(review.img) {
      getDownloadURL(ref(storage, `reviews/${review.randomId}`))
      .then((url) => {
        const xhr = new XMLHttpRequest()
        xhr.responseType = 'blob'
        xhr.onload = (event) => {
          const blob = xhr.response
        }
        xhr.open('GET', url)
        xhr.send()
        const img = document.getElementById(`${review.randomId}`)
        img.setAttribute('src', url)
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }, [review])

  useEffect(() => {  
    fetchReview()  
  }, [fetchReview])

  if(!Object.keys(review).length) return <h1 className='mt-2' style={{textAlign: 'center'}}>Something went wrong...</h1>

  return (
    <Container 
      className='position-relative'
      style={{padding: '60px 20px'}}
    >
      <Row>
        {review.img 
          ? <Col sm>
              <div
                className='d-flex justify-content-center align-items-center img-container'
              >
                <img 
                  style={{height: '100%'}}
                  id={`${review.randomId}`}
                  src={gray}
                  alt={'img'}
                /> 
              </div>
            </Col>
          : ''
        } 
        <Col sm>
          <h2>{review.title}</h2>
          <p>{review.description}</p>
          <div className='d-flex flex-row gap-2'>
            <p>Tags:</p>
            <div className='d-flex flex-row gap-2'>
              {review.tags.map(tag => <p>#{tag.text}</p>)}
            </div>
          </div>
          <p className='d-flex flex-row gap-2'>
            Users rating: {review.ratingUsers} 
            <span style={{color: 'rgb(255, 187, 0)'}}>&#9733;</span>
          </p>
          <p className='d-flex gap-2 flex-row'>
            Review from: 
            <span style={{textTransform: 'capitalize'}}>
              {review.from}
            </span>
          </p>
        </Col>
      </Row> 
      <Row style={{marginTop: '40px'}}>
        <Form style={{padding: '10px', width: '50%'}}>
          <Form.Group className='d-flex flex-row gap-2' style={{position: 'relative'}}>
            {isAuth 
              ? <Form.Control 
                  placeholder='Leave your opinion' 
                  value={commentValue} 
                  onChange={(event) => setCommentValue(event.target.value)}
                />
              : <Form.Control placeholder='Leave your opinion' disabled/>
            }
            <Button 
              onClick={handleCommentBtnClick}
            >
              Send
            </Button>
          </Form.Group>
        </Form>
        <ListGroup as='ul'>
            {commentsArray.map((comment, index) => {
              return (
                <ListGroup.Item as='li' key={index}>
                  <p>{comment.from}</p>
                  <p>{comment.text}</p>
                </ListGroup.Item>
              )})}
        </ListGroup>
      </Row>
    </Container>
  )
}

export default ReviewDetails