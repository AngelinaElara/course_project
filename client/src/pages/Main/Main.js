import {useState, useEffect, useCallback} from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ButtonsReviews from './components/ButtonsReviews'
import ReviewList from '../../components/ReviewList'
import SelectLanguage from './components/SelectLanguage'
import Tags from './components/Tags'

const Main = ({
  data,
  tags
}) => {
  const [dataReviews, setDataReviews] = useState([])
  const [title, setTitle] = useState('')
  const [isButtonLastActive, setIsButtonLastActive] = useState(false)
  const [isButtonPopularActive, setIsButtonPopularActive] = useState(true)

  const handlePopularReviewButtonClick = () => {
    const copy = [...data]
    const ratedReviews = copy.slice(0,9).sort((a, b) => b.ratingAuth - a.ratingAuth)
    setDataReviews(ratedReviews)
    setTitle('Popular Reviews')
    setIsButtonPopularActive(true)
    setIsButtonLastActive(false)
  }

  const handleLastReviewButtonClick = () => {
    const latestReviews = data.slice(0,9).sort((a,b) => new Date(b.publishDate) - new Date(a.publishDate)) 
    setDataReviews(latestReviews)
    setTitle('Latest Reviews')
    setIsButtonLastActive(true)
    setIsButtonPopularActive(false)
  }

  useEffect(() => {
    if(data) {
      const copy = [...data]
      const ratedReviews = copy.slice(0,9).sort((a, b) => b.ratingAuth - a.ratingAuth)
      setDataReviews(ratedReviews)
      const title = 'Popular Reviews' 
      setTitle(title)
    }
  }, [data])

  return (
    <Container style={{padding: '60px 20px'}} className='position-relative'>
      <Row className='gy-5'>
        <Col sm={4} className='d-flex flex-column align-items-start'>
          <SelectLanguage />
          {tags ? <Tags tags={tags}/> : ''}
        </Col>
        <Col sm={8}>
          <ButtonsReviews 
            handlePopularReviewButtonClick={handlePopularReviewButtonClick}
            handleLastReviewButtonClick={handleLastReviewButtonClick}
            isButtonLastActive={isButtonLastActive}
            isButtonPopularActive={isButtonPopularActive}
          />
          <ReviewList data={dataReviews} title={title}/>
        </Col>
      </Row>
    </Container>
  )
}

export default Main