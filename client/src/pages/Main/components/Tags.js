import { TagCloud } from 'react-tagcloud'
import { useNavigate } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'

const Tags = ({tags}) => {
  const navigate = useNavigate()
  const {request} = useHttp()

  const handleTagClick = async (tagValue) => {
    navigate(`/search?tag=${tagValue}`)
    const clickTags = await request(`review/tag/${tagValue}`, 'PATCH')
  }

  return (
    <div style={{marginTop: '30px'}}>
      <p style={{fontWeight: '500'}}>Tags:</p>
      <TagCloud
        minSize={12}
        maxSize={30} 
        tags={tags.slice(0,80)}
        onClick={tag => handleTagClick(tag.value)}
      />
    </div>
  )
}

export default Tags 