import { TagCloud } from 'react-tagcloud'
import { useNavigate } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useTranslation } from 'react-i18next'

const Tags = ({tags}) => {
  const navigate = useNavigate()
  const {request} = useHttp()
  const { t } = useTranslation()

  const handleTagClick = async (tagValue) => {
    navigate(`/search?tag=${tagValue}`)
    const clickTags = await request(`review/tag/${tagValue}`, 'PATCH')
  }

  return (
    <div style={{marginTop: '30px', background: '#ccccff', padding: '10px', borderRadius: '5px'}}>
      <p style={{fontWeight: '500'}}>{t('tags')}</p>
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