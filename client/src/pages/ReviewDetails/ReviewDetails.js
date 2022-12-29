import { useState, useEffect, useCallback, useContext, useMemo } from 'react'
import {useParams} from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import { useAuth } from '../../hooks/auth.hook'
import {Context} from '../../context/Context'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ReviewDescription from './components/ReviewDescription'
import Comments from './components/Comments'

const ReviewDetails = ({
  data,
  currentUserBlocked
}) => {
  const [review, setReview] = useState({})
  const [commentValue, setCommentValue] = useState('')
  const [commentsArray, setCommentsArray] = useState([])
  let {id}  = useParams()
  const {request} = useHttp()
  const {userId, userName} = useAuth()
  const isAuth = !!userId

  const handleCommentBtnClick = async () => {
    try {
      if(commentValue.length) {
        const comment = {
          from: userName, 
          text: commentValue,
          date: new Date(Date.now())
        }
        const sendData = await request(`review/comment/${review._id}`, 'PATCH', comment)
        setCommentValue('')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(data) {
      const review = data.find(review => review._id === id)
      setReview(review)
    }
  }, [data])

  useEffect(() => {
    setInterval(async () => {
      const getComments = await request(`review/comment/${id}`, 'GET')
      const sortComments = getComments.sort((a,b) => new Date(a.date) - new Date(b.date))
      setCommentsArray(sortComments)
    }, 2000)
  }, [])

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
          currentUserBlocked={currentUserBlocked}
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