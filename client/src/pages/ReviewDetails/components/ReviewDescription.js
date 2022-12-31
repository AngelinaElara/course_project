import {useState, useEffect, useCallback} from 'react'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import photoLoad from '../../../ui/photoLoad.png'
import { useHttp } from '../../../hooks/http.hook'
import { storage } from '../../../firebase/index'
import { ref, getDownloadURL} from 'firebase/storage'
import {ReactComponent as HeartIcon} from '../../../ui/heart.svg'
import StarRating from '../../../components/StarRating'
import { useTranslation } from 'react-i18next'

const ReviewDescription = ({
  review,
  userId,
  reviewId,
  authorId,
}) => {
  const [isLikeDisabled, setIsLikeDisabled] = useState(false)
  const [authorLikes, setAuthorLikes] = useState(0)
  const [rating, setRating] = useState(0)
  const {request} = useHttp() 
  const isAuth = !!userId
  const { t } = useTranslation()
 
  const handleLikeClick = async () => {
    setAuthorLikes(prev => prev+1)
    const sendLike = await request(`review/like/${reviewId}`, 'PATCH', {userId, authorId})
    setIsLikeDisabled(true)
  } 

  const getAuthLikes = useCallback(async () => {
    try { 
      const getLikes = await request(`/review/authlikes/${authorId}`, 'GET')
      setAuthorLikes(getLikes)
    } catch (e) {
      console.error(e)
    } 
  }, [authorId])

  useEffect(() => {
    getAuthLikes()
  }, [getAuthLikes])

  useEffect(() => {
    !isAuth ? setIsLikeDisabled(true) : setIsLikeDisabled(false)
  }, [isAuth])

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
    if(review) {
      const findRatingFromUser = review?.ratingUsers?.find(user => user.userId === userId)
      if(findRatingFromUser) setRating(findRatingFromUser.rating)
    }
  }, [review])

  return (
    <>
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
      <Col sm className='d-flex flex-column gap-3'>
        <h2 style={{marginTop: '15px'}}>{review.title}</h2>
        <div dangerouslySetInnerHTML={{__html: review.description}}></div>
        <div className='d-flex flex-row gap-2'>
          <p>{t('tags')}</p>
          <div className='d-flex flex-row gap-2'>
            {review?.tags?.map((tag, index) => <p key={index}>#{tag.value}</p>)}
          </div>
        </div>
        <p className='d-flex flex-row gap-2'>
          {t('authRating')}: {review.ratingAuth} 
          <span style={{color: 'rgb(255, 187, 0)'}}>&#9733;</span>
        </p>
        <p className='d-flex flex-row gap-2'>
          {t('userRating')}: {review.finalRating} 
          <span style={{color: 'rgb(255, 187, 0)'}}>&#9733;</span>
        </p>
        <div className='d-flex gap-4 flex-row  align-items-center'>
          <div className='d-flex gap-2 flex-row justify-content-center align-items-center'>
            {t('reviewFrom')}: 
            <span style={{textTransform: 'capitalize'}}> 
              {review.from}
            </span>
            {authorLikes}
            <HeartIcon 
              width={'18px'}
              height={'18px'} 
              fill={'red'}
            />
          </div>
          <div>
            <Button 
              variant='light' 
              className='d-flex flex-row gap-2 align-items-center'
              onClick={handleLikeClick}
              disabled={isLikeDisabled}
            >
              <HeartIcon 
                width={'20px'}
                height={'20px'} 
                fill={'black'}
              />
              <span>{t('likeAuthor')}</span>
            </Button>
          </div>
        </div>
        {!userId 
          ? '' 
          : <div>
              <span>{t('rateReview')}</span>
              <StarRating 
                lengthArray={5}
                rating={rating}
                setRating={setRating}
                isUserClick={true}
                userId={userId}
                reviewId={reviewId}
                isAuth={isAuth}
              />
            </div>
        }
        {review.img 
          ? <Button>{t('pdf')}</Button>
          : ''}
      </Col>
    </>
  )
}

export default ReviewDescription