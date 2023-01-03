import {useState, useEffect, useCallback} from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import photoLoad from '../../../ui/photoLoad.png'
import { useHttp } from '../../../hooks/http.hook'
import { storage } from '../../../firebase/index'
import { ref, getDownloadURL} from 'firebase/storage'
import {ReactComponent as HeartIcon} from '../../../ui/heart.svg'
import StarRating from '../../../components/StarRating'
import { useTranslation } from 'react-i18next'
import  jsPDF  from 'jspdf'
import html2canvas from 'html2canvas'

const ReviewDescription = ({
  review,
  userId,
  reviewId,
  authorId
}) => {
  const [isLikeDisabled, setIsLikeDisabled] = useState(false)
  const [authorLikes, setAuthorLikes] = useState(0)
  const [rating, setRating] = useState(0)
  const {request} = useHttp() 
  const isAuth = !!userId
  const { t } = useTranslation()
 
  const handleLikeClick = async () => {
    setAuthorLikes(prev => prev+1)
    setIsLikeDisabled(true)
    console.log(isLikeDisabled)
    const sendLike = await request(`review/like/${reviewId}`, 'PATCH', {userId, authorId})
  } 

  const handleGetAuthLikes = useCallback(async () => {
    try { 
      const getLikes = await request(`/review/authlikes/${authorId}`, 'GET')
      setAuthorLikes(getLikes)
    } catch (e) {
      console.error(e)
    } 
  }, [authorId])

  const handlePdfBtnClick = async () => {
    let img
    await html2canvas(document.querySelector('.pdf'), {
      allowTaint: true,
      useCORS: true,
      format: 'a4'
    }).then((canvas) => {
      const imgWidth = 550
      const imgHeight = canvas.height * imgWidth / canvas.width
      img = canvas.toDataURL(
        'image/png')
      const doc = new jsPDF('p','pt','a4') 
      doc.addImage(img, 'PNG', 10, 10, imgWidth, imgHeight)
      doc.save('review.pdf')
    })
  }

  useEffect(() => {
    handleGetAuthLikes()
  }, [handleGetAuthLikes])

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
      review.liked.includes(userId) ? setIsLikeDisabled(true) : setIsLikeDisabled(false)
    }
  }, [review])

  return ( 
    <>
      {review.img 
        ? <Col sm className='pdf d-flex flex-row gap-4'>
            <div
              className='d-flex justify-content-center align-items-center img-container'
            >
              <img 
                className='img'
                style={{height: '100%'}}
                id={`${review.randomId}`}
                src={photoLoad}
                alt={'img'}
              /> 
            </div>
            <div style={{width: '50%'}}>
              <h2>{review.title}</h2>
              <div dangerouslySetInnerHTML={{__html: review.description}}></div>
              <div className='d-flex flex-row gap-2'>
                <p>{t('tags')}</p>
                <div className='d-flex flex-row gap-2'>
                  {review?.tags?.map((tag, index) => <p key={index}>#{tag.value}</p>)}
                </div>
              </div>
            </div>
          </Col>
        : <Col sm className='d-flex flex-row'>
            <div>
              <h2>{review.title}</h2>
              <div dangerouslySetInnerHTML={{__html: review.description}}></div>
              <div className='d-flex flex-row gap-2'>
                <p>{t('tags')}</p>
                <div className='d-flex flex-row gap-2'>
                  {review?.tags?.map((tag, index) => <p key={index}>#{tag.value}</p>)}
                </div>
              </div>
            </div>
          </Col>
      } 
      <Row sm className='d-flex flex-column gap-3 mt-2'>
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
          {/* if the user is not registered */}
          {!userId 
          ? '' 
          : <div>
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
          }
        </div>
        {/* if the user is not registered */}
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
          ? <Button onClick={handlePdfBtnClick} style={{width: '40%'}}>{t('pdf')}</Button>
          : ''}
      </Row>
    </>
  )
}

export default ReviewDescription