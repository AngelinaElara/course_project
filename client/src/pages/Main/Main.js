import {useState, useEffect, useCallback} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {useHttp} from '../../hooks/http.hook'
import ButtonsReviews from './components/ButtonsReviews'
import ReviewList from '../../components/ReviewList'
import SelectLanguage from './components/SelectLanguage'
import Tags from './components/Tags'

const Main = () => {
  const [data, setData] = useState([])
  const [dataReviews, setDataReviews] = useState([])
  const [isButtonLastActive, setIsButtonLastActive] = useState(false)
  const [isButtonPopularActive, setIsButtonPopularActive] = useState(true)
  const [tags, setTags] = useState([])
  const {request} = useHttp()

  const handleGetData = useCallback(async () => {
    try { 
      let getData = await request('/review', 'GET') 
      setData(getData)
    } catch (e) {
      console.error(e)
    }  
  }, [request])

  const handlePopularReviewButtonClick = () => {
    const copy = [...data]
    const ratedReviews = copy.slice(0,9).sort((a, b) => b.ratingAuth - a.ratingAuth)
    setDataReviews(ratedReviews)
    setIsButtonPopularActive(true)
    setIsButtonLastActive(false)
  }

  const handleLastReviewButtonClick = () => {
    const copy = [...data]
    const latestReviews = copy.slice(0,9).sort((a,b) => new Date(b.publishDate) - new Date(a.publishDate)) 
    console.log(latestReviews)
    setDataReviews(latestReviews)
    setIsButtonLastActive(true)
    setIsButtonPopularActive(false)
  }

  useEffect(() => {
    if(data) {
      const copy = [...data]
      const ratedReviews = copy.slice(0,9).sort((a, b) => b.ratingAuth - a.ratingAuth)
      setDataReviews(ratedReviews) 
      data.map(review => tags.push(review.tags))
      const removeDuplicateObject = tags.flat().reduce((acc, i) => {
        if(!acc.find(tag => tag.value == i.value)) {
          acc.push(i)
        }
        return acc
      }, [])
      setTags(removeDuplicateObject)
    }
  }, [data])

  useEffect(() => {
    handleGetData()
  }, [handleGetData])

  return (
    <Container style={{padding: '60px 20px'}} className='position-relative'>
      <Row className='gy-5'>
        <Col sm={4} className='d-flex flex-column align-items-start gap-2'>
          <SelectLanguage />
          {tags.length ? <Tags tags={tags}/> : ''}
        </Col>
        <Col sm={8}>
          <ButtonsReviews 
            handlePopularReviewButtonClick={handlePopularReviewButtonClick}
            handleLastReviewButtonClick={handleLastReviewButtonClick}
            isButtonLastActive={isButtonLastActive}
            isButtonPopularActive={isButtonPopularActive}
          />
          <ReviewList data={dataReviews}/>
        </Col>
      </Row>
    </Container>
  )
}

export default Main