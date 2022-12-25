import {useState, useEffect} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { useParams } from 'react-router-dom'
import { storage } from '../../firebase/index'
import { ref, getDownloadURL} from 'firebase/storage'
import Modal from './components/Modal'
import photoLoad from '../../ui/photoLoad.png'
import './style/reviewDetails.css'

const AuthReviewDetails = ({
  data
}) => {
  const [review, setReview] = useState({})
  const [isModalActive, setIsModalActive] = useState(false)
  let {id}  = useParams()
  
  const handleBtnChangeClick = () => {
    setIsModalActive(true)
  }

  useEffect(() => {
    if(data) {
      const findedReview = data.find(review => review._id  === id)
      setReview(findedReview)
    }
  }, [data])

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
                  src={photoLoad}
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
              {review.tags.map(tag => <p>#{tag.value}</p>)}
            </div>
          </div>
          <p className='d-flex flex-row gap-2'>
            You rating: {review.ratingAuth} 
            <span style={{color: 'rgb(255, 187, 0)'}}>&#9733;</span>
          </p>
          <p className='d-flex flex-row gap-2'>
            Users rating: {review.finalRating} 
            <span style={{color: 'rgb(255, 187, 0)'}}>&#9733;</span>
          </p>
        </Col>
      </Row> 
      <Button 
        className='position-absolute' 
        style={{right: '40px'}}
        onClick={handleBtnChangeClick}
      >
        Change review
      </Button>
      {isModalActive 
        ? <Modal review={review} setReview={setReview} setIsModalActive={setIsModalActive}/> 
        : ''}
    </Container>
  )
}

export default AuthReviewDetails