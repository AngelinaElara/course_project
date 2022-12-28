import {useState, useEffect, useContext} from 'react'
import {Link} from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import photoLoad from '../ui/photoLoad.png'
import { storage } from '../firebase/index'
import { ref, getDownloadURL} from 'firebase/storage'
import { Context } from '../context/Context'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import {useParams} from 'react-router-dom'

const ReviewList = ({
  data,
  title
}) => {
  const [langTitle, setLangTitle] = useState('')
  const [listData, setListData] = useState([])
  const context = useContext(Context)
  const listStyle = context.lightTheme 
    ? {background: '#ccccff', color: 'black'} 
    : {background: '#A0A0A0', color: 'white'}
  const {t} = useTranslation()
  let {id: userId}  = useParams()

  useEffect(() => {
    if(data) {
      setListData(data)
      data.map(review => {
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

  // when an admin clicks on a user, he gets a list of his reviews
  useEffect(() => {
    if(userId) {
      const filterUserReview = data.filter(review => review.idFrom === userId)
      setListData(filterUserReview)
    }
  }, [userId])
  
  return (
    <div style={{marginTop: '20px'}}>
      <h1 style={{fontSize: '25px'}}>{langTitle}</h1>
      {listData 
        ? listData.map((review)=> {
          return (
            <ListGroup as='ul' style={{marginTop: '20px'}}>
              <ListGroup.Item 
                as='li' 
                key={review._id} 
                style={listStyle}
              >
               {/* if admin clecked on review we redirected on change review page  */}
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
                      {t('userRating')}: {review.finalRating} 
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
                    ? <div style={{width: '200px', height: '100px', overflow: 'hidden'}}>
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
        : <h2>{t('noUsers')}</h2>
      }
    </div>
  )
}

export default ReviewList 