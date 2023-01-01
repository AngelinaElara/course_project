import {useState, useEffect, useContext, useCallback} from 'react'
import {Link} from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import photoLoad from '../ui/photoLoad.png'
import { storage } from '../firebase/index'
import { ref, getDownloadURL} from 'firebase/storage'
import { Context } from '../context/Context'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import {useParams} from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'

const ReviewList = ({
  title,
  data
}) => {
  const [getData, setGetData] = useState([])
  const [langTitle, setLangTitle] = useState('')
  const context = useContext(Context)
  const listStyle = context.lightTheme 
    ? {background: '#ccccff', color: 'black'} 
    : {background: '#A0A0A0', color: 'white'}
  const {t} = useTranslation()
  const {request} = useHttp()
  let {id: userId}  = useParams()

  const handleGetData = useCallback(async () => {
    try {
      if(userId) {
        const data = await request('/review', 'GET') 
        const filterUserReview = data.filter(review => review.idFrom === userId)
        setGetData(filterUserReview)
      }
    } catch (error) {
      console.log(error)
    }
  }, [userId, request])

  // when an admin clicks on a user, he gets a list of his reviews
  useEffect(() => {
    if(data) {
      console.log(data)
      setGetData(data)
    } else {
      handleGetData()
    }
  }, [data])

  useEffect(() => {
    if(getData) {
      getData.map(review => {
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
            const img = document.querySelectorAll(`#${review.randomId}`)
            img.forEach(image => image.setAttribute('src', url))
          })
          .catch((error) => {
            console.log(error)
          })
        }
      })
    }
  }, [data])

  useEffect(() => {
    if (title === 'Found reviews') {
      setLangTitle(t('foundReviews'))
    } else if(title === "Author's reviews") {
      setLangTitle(t('authorReviews'))
    }
  }, [title])
  
  return (
    <div style={{marginTop: '20px'}}>
      <h1 style={{fontSize: '25px'}}>{langTitle}</h1>
      {getData 
        ? getData.map((review)=> {
          return (
            <ListGroup as='ul' style={{marginTop: '20px'}}>
              <ListGroup.Item 
                as='li' 
                key={review._id} 
                style={listStyle}
              >
               {/* if admin clicked on review we redirected on change review page  */}
                <Link 
                  to={userId ? `/profile/${review._id}` : `/${review._id}`} 
                  className={review.img ? 'd-flex flex-row justify-content-between align-items-start gap-6' : ''} 
                  style={context.lightTheme ? {textDecoration: 'none', color: 'black'} : {textDecoration: 'none', color: 'white'}}
                >
                  <div>
                    <h2 style={{fontSize: '20px'}}>{review.title}</h2>
                    <p className='d-flex gap-2 flex-row'>
                      {t('category')}:
                      <span style={{textTransform: 'capitalize'}}>
                        {review.category}
                      </span>
                    </p>
                    <p className='d-flex flex-row gap-2'>
                      <p>{t('authRating')}: {review.ratingAuth}</p> 
                      <span style={{color: 'rgb(255, 187, 0)'}}>&#9733;</span>
                    </p>
                    <p className='d-flex flex-row gap-2'>
                      <p>{t('userRating')}: {review.finalRating} </p>
                      <span style={{color: 'rgb(255, 187, 0)'}}>&#9733;</span>
                    </p>
                    <p className='d-flex flex-row gap-2' style={{color: '#787878', fontSize: '12px'}}>
                      {t('publishDate')}:
                      <span>
                        {moment(review.publishDate).format('L')}
                      </span>
                    </p>
                  </div>
                  {review.img  
                    ? <div 
                        style={{width: '200px', height: '100px', overflow: 'hidden'}}
                        className='d-flex align-items-center justify-content-center'
                      >
                        <img 
                          style={{height: '100%'}}
                          id={review.randomId}
                          src={photoLoad} 
                          alt={'img'}
                        /> 
                      </div>
                    : ''
                  }
                </Link>
              </ListGroup.Item>
            </ListGroup> 
          )}) 
        : ''
      }
    </div>
  )
}

export default ReviewList 