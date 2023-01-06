import { useState, useMemo } from 'react'
import ListGroup from 'react-bootstrap/ListGroup'
import Form from 'react-bootstrap/Form'
import CloseButton from 'react-bootstrap/CloseButton'
import { useTranslation } from 'react-i18next'
import './tags.css'

const Tags = ({ 
  allTags,
  tags,
  setTags
}) => {
  const [tagValue, setTagValue] = useState('')
  const [filterTags, setFilterTags] = useState([])
  const { t } = useTranslation()

  const handleDeleteTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)])
  }
  
  const handleAddTags = (event) => {
    if (event.target.value !== '') {
      setTags([...tags, {value: event.target.value, count: 0}])
      setTagValue('')
    }
  }

  const handleTagsListClick = (event) => {
    setTags([...tags, {value: event.target.textContent, count: 0}])
    setTagValue('')
  }

  useMemo(() => {
    if(tagValue && allTags) {
      const foundTags = allTags.filter(tag => {
        return tag.value.toLowerCase().includes(tagValue.toLowerCase())
      })
      setFilterTags(foundTags)
    }
  }, [tagValue])

  return (
    <div className='tags-input' style={{width: '100%'}}>
		  <ul id='tags'>
		    {tags && tags.map((tag, index) => (
		      <li  key={index} className='tag'>
		        <span className='tag-title'>{tag.value}</span>
		        <span className='tag-close-icon'
		    	    onClick={() => handleDeleteTags(index)}
		        >
		    	    <CloseButton />
		        </span>
		      </li> 
		    ))}
		  </ul>
      <div className='position-relative' style={{width: '100%'}}>
		    <Form.Control
		      type='text'
		      onKeyUp={event => event.key === 'Enter' ? handleAddTags(event) : null}
          onChange={(event) => setTagValue(event.target.value)}
		      placeholder={t('pressEnter')}
          style={{textTransform: 'lowercase', width: '100%'}}
          value={tagValue}
		    />
        <ListGroup 
            as='ul' 
            className='position-absolute' 
            style={{width: '100%', top: '40px', maxHeight: '150px', height: 'auto', overflow: 'auto', padding: '0 8px'}}
          >
            {tagValue && filterTags
              ? filterTags.map((tag, index) => {
                return ( 
                  <ListGroup.Item 
                    key={index} 
                    as='li'
                    onClick={(event) => handleTagsListClick(event)} 
                  >
                    {tag.value}
                  </ListGroup.Item>
                )
              })
              : ''}
        </ListGroup>
		  </div>
    </div>
  )
}

export default Tags