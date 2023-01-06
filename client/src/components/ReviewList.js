import {useState, useEffect, useContext, useCallback} from 'react'
import {Link} from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import photoLoad from '../ui/photoLoad.png'
import { storage } from '../firebase/index'
import { ref, getDownloadURL} from 'firebase/storage'
import { Context } from '../context/Context'
import { useTranslation } from 'react-i18next'
import moment from 'moment'

const ReviewList = ({
  data,
  title
}) => {
  const [getData, setGetData] = useState([])
  const context = useContext(Context)
  const listStyle = context.lightTheme 
    ? {background: '#ccccff', color: 'black'} 
    : {background: '#A0A0A0', color: 'white'}
  const {t} = useTranslation()

  const handleSetImg = useCallback(() => {
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
  }, [getData])

  useEffect(() => {
    if(data) {
      setGetData(data)
    } 
  }, [data])

  useEffect(() => {
    handleSetImg()
  }, [getData])

  return (
    <div style={{marginTop: '20px'}}>
      <h1 style={{fontSize: '25px'}}>{title ? t('foundReviews') : ''}</h1>
      {getData 
        ? getData.map((review)=> {
          return (
            <ListGroup as='ul' style={{marginTop: '20px'}}>
              <ListGroup.Item 
                as='li' 
                key={review._id} 
                style={listStyle}
              >
                <Link 
                  to={`/${review._id}`} 
                  className={review.img ? 'd-flex flex-row justify-content-between align-items-start gap-6' : ''} 
                  style={context.lightTheme ? {textDecoration: 'none', color: 'black'} : {textDecoration: 'none', color: 'white'}}
                >
                  <div style={{minWidth: '150px'}}>
                    <h2 style={{fontSize: '20px'}}>{review.title}</h2>
                    <p className='d-flex gap-2 flex-row' >
                      {t('category')}:
                      <span style={{textTransform: 'capitalize'}}>
                        {review.category}
                      </span>
                    </p>
                    <p className='d-flex flex-row align-items-center justify-content-start gap-1'>
                      <p>{t('authRating')}: {review.ratingAuth}</p> 
                      <p style={{color: 'rgb(255, 187, 0)'}}>&#9733;</p>
                    </p>
                    <p className='d-flex flex-row align-items-center justify-content-start gap-1'>
                      <p >{t('userRating')}: {review.finalRating}</p>
                      <p style={{color: 'rgb(255, 187, 0)'}}>&#9733;</p>
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