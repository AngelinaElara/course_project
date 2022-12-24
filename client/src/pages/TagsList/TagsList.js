import {useState, useCallback, useEffect} from 'react'
import { useSearchParams } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import ReviewList from '../../components/ReviewList'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'

const TagsList = () => {
  const [dataTags, setDataTags] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const tag = searchParams.get('tag')
  const {request} = useHttp()

  const fetchTagsList = useCallback(async () => {
    const getTagsList = await request(`review/tag/${tag}`, 'GET')
    setDataTags(getTagsList)
  }, [request])
  
  useEffect(() => {
    fetchTagsList()
  }, [fetchTagsList])
  
  return (
    <Container>
      <Row>
        <ReviewList data={dataTags} title={`Found reviews by tag: ${tag}`}/>
      </Row>
    </Container>
  )
}

export default TagsList