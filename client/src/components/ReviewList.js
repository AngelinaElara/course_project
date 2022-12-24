import {useEffect, useContext} from 'react'
import {Link} from 'react-router-dom'
import ListGroup from 'react-bootstrap/ListGroup'
import photoLoad from '../ui/photoLoad.png'
import { storage } from '../firebase/index'
import { ref, getDownloadURL} from 'firebase/storage'
import { Context } from '../context/Context'

const ReviewList = ({
  data,
  title
}) => {
  const context = useContext(Context)
  const listStyle = context.lightTheme 
    ? {background: '#ccccff', color: 'black'} 
    : {background: '#A0A0A0', color: 'white'}

  useEffect(() => {
    if(data) {
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

  return (
    <div style={{marginTop: '20px'}}>
      <h1 style={{fontSize: '25px'}}>{title}</h1>
      <ListGroup as='ul' style={{marginTop: '20px'}}>
        {data && data.map(review => {
          return (
            <ListGroup.Item 
              as='li' 
              key={review._id} 
              style={listStyle}
            >
              <Link 
                to={`/${review._id}`} 
                className={review.img ? 'd-flex flex-row justify-content-between align-items-start gap-2' : ''} 
                style={context.lightTheme ? {textDecoration: 'none', color: 'black'} : {textDecoration: 'none', color: 'white'}}
              >
                <div>
                  <h2 style={{fontSize: '20px'}}>{review.title}</h2>
                  <p className='d-flex gap-2 flex-row'>
                    Category: 
                    <span style={{textTransform: 'capitalize'}}>
                      {review.category}
                    </span>
                  </p>
                  <p className='d-flex flex-row gap-2'>
                    Users rating: {review.finalRating} 
                    <span style={{color: 'rgb(255, 187, 0)'}}>&#9733;</span>
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
          )
        })}
      </ListGroup> 
    </div>
  )
}

export default ReviewList