import { useState, useEffect, useCallback, useContext, useMemo } from 'react'
import {useParams} from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import { useAuth } from '../../hooks/auth.hook'
import {Context} from '../../context/Context'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ReviewDescription from './components/ReviewDescription'
import Comments from './components/Comments'

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
    setInterval(async () => {
      const getComments = await request(`review/comment/${id}`, 'GET')
      const sortComments = getComments.sort((a,b) => new Date(a.date) - new Date(b.date))
      setCommentsArray(sortComments)
    }, 2000)
  }, [])

  const handleCommentBtnClick = async () => {
    try {
      const comment = {
        from: userName, 
        text: commentValue,
        date: new Date(Date.now())
      }
      const sendData = await request(`review/comment/${review._id}`, 'PATCH', comment)
      setCommentValue('')
    } catch (error) {
      console.log(error)
    }
  }

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
        <ReviewDescription 
          review={review}
          userId={userId}
          reviewId={id}
          authorId={review.idFrom}
        />
      </Row> 
      <Row style={{marginTop: '40px'}}>
        <Comments 
          isAuth={isAuth}
          commentValue={commentValue}
          setCommentValue={setCommentValue}
          handleCommentBtnClick={handleCommentBtnClick}
          commentsArray={commentsArray}
          userId={userId}
        />
      </Row>
    </Container>
  )
}

export default ReviewDetails