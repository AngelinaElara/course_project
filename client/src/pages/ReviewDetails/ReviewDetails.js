import { useState, useEffect, useCallback, useContext, useMemo } from 'react'
import {useParams} from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import { useAuth } from '../../hooks/auth.hook'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import ReviewDescription from './components/ReviewDescription'
import Comments from './components/Comments'
import { useTranslation } from 'react-i18next'

const ReviewDetails = () => {
  const [review, setReview] = useState({})
  const [commentValue, setCommentValue] = useState('')
  const [commentsArray, setCommentsArray] = useState([])
  const [currentUserBlocked, setCurrentUserBlocked] = useState(false)
  let {id}  = useParams()
  const {request} = useHttp()
  const {userId, userName} = useAuth()
  const isAuth = !!userId
  const { t } = useTranslation()

  const handleFetchReview = useCallback(async () => {
    try { 
      let getData = await request(`/review/${id}`, 'GET')
      setReview(getData)
    } catch (e) {
      console.error(e)
    } 
  }, [id])

  const handleFetchCurrentUser = useCallback(async () => {
    try { 
      if(userId) {
        const user = await request(`/users/${userId}`, 'GET')
        setCurrentUserBlocked(user.blocked)
      }
    } catch (e) {
      console.error(e)
    }  
  }, [request, userId])

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
    handleFetchReview() 
  }, [handleFetchReview])

  useEffect(() => {
    handleFetchCurrentUser()
  }, [handleFetchCurrentUser])

  useEffect(() => {
    setInterval(async () => {
      const getComments = await request(`review/comment/${id}`, 'GET')
      const sortComments = getComments.sort((a,b) => new Date(a.date) - new Date(b.date))
      setCommentsArray(sortComments)
    }, 2000)
  }, [])

  if(!Object.keys(review).length) return <h1 className='mt-2' style={{textAlign: 'center'}}>{t('wrong')}...</h1> 

  return (
    <Container 
      className='position-relative'
      style={{padding: '60px 20px'}}
    >
      <Row className='wrapper'>
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
          currentUserBlocked={currentUserBlocked}
        />
      </Row>
    </Container>
  )
}

export default ReviewDetails