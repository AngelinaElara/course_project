import {useContext} from 'react'
import { TagCloud } from 'react-tagcloud'
import { useNavigate } from 'react-router-dom'
import { useHttp } from '../../../hooks/http.hook'
import { useTranslation } from 'react-i18next'
import { Context } from '../../../context/Context'

const Tags = ({tags}) => {
  const navigate = useNavigate()
  const {request} = useHttp()
  const { t } = useTranslation()
  const context = useContext(Context)

  const style = context.lightTheme 
    ? {background: '#ccccff', color: 'black', marginTop: '30px', borderRadius: '5px', padding: '10px'} 
    : {background: '#A0A0A0', color: 'white', marginTop: '30px', borderRadius: '5px', padding: '10px'}

  const handleTagClick = async (tagValue) => {
    navigate(`/search?tag=${tagValue}`)
    const clickTags = await request(`review/tag/${tagValue}`, 'PATCH')
  }

  return (
    <div style={style}>
      <h3 style={{fontWeight: '500'}}>{t('tags')}</h3>
      <TagCloud
        minSize={15}
        maxSize={30} 
        tags={tags.slice(0,40)}
        onClick={tag => handleTagClick(tag.value)}
        // colorOptions={{ hue: 'monochrome'}}
      />
    </div>
  )
}

export default Tags 