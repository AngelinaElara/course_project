import {useState, useEffect, useCallback, useContext} from 'react'
import {Link} from 'react-router-dom'
import ReactWordcloud from 'react-wordcloud'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'
import { Context } from '../../context/Context'
import {useHttp} from '../../hooks/http.hook'
import { storage } from '../../firebase/index'
import { ref, getDownloadURL} from 'firebase/storage'
import grayBack from '../../ui/gray.jpg'

const Main = () => {
  const [data, setData] = useState([])
  const [latestReviews, setLatestReviews] = useState([])
  const [ratedReviews, setRatedReviews] = useState([])
  const [tags, setTags] = useState([])
  const {request} = useHttp()
  const context = useContext(Context)
  const listStyle = context.lightTheme 
    ? {background: '#ccccff', color: 'black'} 
    : {background: '#A0A0A0', color: 'white'}

  const fetchAllReviews = useCallback(async () => {
    try { 
      let getData = await request('/review', 'GET') 
      setData(getData)
    } catch (e) {
      console.error(e)
    }  
  }, [request])

  useEffect(() => {
    fetchAllReviews()
  }, [fetchAllReviews])

  useEffect(() => {
    const copy = [...data]
    if(data.length) {
      const latestReviews = data.slice(0,9).sort((a,b) => new Date(b.publishDate) - new Date(a.publishDate)) 
      setLatestReviews(latestReviews)
      const ratedReviews = copy.slice(0,9).sort((a, b) => b.ratingAuth - a.ratingAuth)
      setRatedReviews(ratedReviews)
      const tags = data.map((review) => review.tags)
      setTags(tags.flat())
    }
  }, [data])

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
    <Container style={{padding: '60px 20px'}}>
      <Row>
        <Col>
        <div>
          <h1 style={{fontSize: '30.605px'}}>Latest Reviews</h1>
          <ListGroup as='ul'>
            {latestReviews && latestReviews.map(review => {
              return (
                <ListGroup.Item 
                  as='li' 
                  key={review._id} 
                  style={listStyle}
                >
                  <Link 
                    to={`${review._id}`} 
                    className={review.img ? 'd-flex flex-row justify-content-between align-items-start gap-2' : ''} 
                    style={{textDecoration: 'none'}}
                  >
                    <div>
                      <p>{review.title}</p>
                      <p>Category: {review.category}</p>
                      <p className='d-flex flex-row gap-2' style={{color: 'black'}}>
                        Users rating: {review.ratingUsers} 
                        <span style={{color: 'rgb(255, 187, 0)'}}>&#9733;</span>
                      </p>
                    </div>
                    {review.img 
                      ? <div style={{width: '200px', height: '100px', overflow: 'hidden'}}>
                          <img 
                            style={{height: '100%'}}
                            id={review.randomId}
                            src={grayBack} 
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
        </Col>
        <Col>
          <h2>Top rated reviews</h2>
          <ListGroup as='ul'>
            {ratedReviews && ratedReviews.map(review => {
              return (
                <ListGroup.Item 
                  as='li' 
                  key={review._id} 
                  style={listStyle}
                >
                  <Link 
                    to={`${review._id}`} 
                    className={review.img ? 'd-flex flex-row justify-content-between align-items-start gap-2' : ''} 
                    style={{textDecoration: 'none'}}
                  >
                    <div>
                      <p>{review.title}</p>
                      <p>Category: {review.category}</p>
                      <p className='d-flex flex-row gap-2' style={{color: 'black'}}>
                        Users rating: {review.ratingUsers} 
                        <span style={{color: 'rgb(255, 187, 0)'}}>&#9733;</span>
                      </p>
                    </div>
                    {review.img 
                      ? <div style={{width: '200px', height: '100px', overflow: 'hidden'}}>
                          <img 
                            style={{height: '100%'}}
                            id={review.randomId}
                            src={grayBack} 
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
          <h3>Tags</h3>
          {/* {data && <ReactWordcloud words={tags} />} */}
        </Col>
      </Row>
    </Container>
  )
}

export default Main