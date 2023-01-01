import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import {Link} from 'react-router-dom'
import moment from 'moment'
import trash from '../../../ui/trash.png'

const UserProfile = ({
  dataReviews,
  tableStyle,
  isCheck,
  isCheckAll,
  handleClickOneCheckbox,
  handleSelectAllCheckboxes,
  handleDeleteBtn,
  handleFilterCategoryChange,
  handleSortChange,
  request, 
  userId
}) => {
  const { t } = useTranslation()

  return (
    <>
      <div className='d-flex justify-content-between align-items-center flex-row gap-4'>  
        <button 
          className='btn d-flex justify-content-center align-items-center'
          onClick={handleDeleteBtn}
        >
          <img 
            src={trash}
            alt='trash icon'
            style={{ width: '50px', height: '50px' }}
          />
        </button>
        <Form.Select onChange={handleFilterCategoryChange}>
          <option value=''>{t('filterCategory')}</option>
          <option value='films'>Films</option> 
          <option value='books'>Books</option> 
          <option value='games'>Games</option>    
        </Form.Select>
        <Form.Select onChange={handleSortChange}>
          <option value=''>{t('sort')}</option>
          <option value='newer'>{t('newer')}</option>
          <option value='older'>{t('older')}</option> 
          <option value='more'>{t('moreRated')}</option>
          <option value='lower'>{t('lowerRating')}</option>
        </Form.Select>
      </div>
      {dataReviews.length 
        ? <Table style={tableStyle}>
            <thead>
              <tr>
                <th scope='col' className='d-flex gap-2 flex-row justify-content-start align-items-center'>
                  {t('check')}
                  <input 
                    id='selectAll'
                    type={'checkbox'}
                    onChange={handleSelectAllCheckboxes} 
                    checked={isCheckAll}
                  />
                </th>
                <th scope='col'>{t('name')}</th>
                <th scope='col'>{t('publish')}</th>
                <th scope='col'>{t('yourScore')}</th>
              </tr>
            </thead>
            <tbody>
              {dataReviews.map((review) => {
                return ( 
                  <tr key={review._id}>
                    <td>
                      <input 
                        id={review._id} 
                        checked={isCheck.includes(review._id)} 
                        onChange={handleClickOneCheckbox} 
                        type={'checkbox'} 
                      />
                    </td>
                    <td><Link to={`/profile/${review._id}`}>{review.title}</Link></td>
                    <td>{moment(review.publishDate).format('MMMM Do YYYY, h:mm:ss a')}</td>
                    <td className='d-flex flex-row gap-2'>
                      {review.ratingAuth} 
                      <span style={{color: 'rgb(255, 187, 0)'}}>&#9733;</span> 
                    </td>
                  </tr>
                )
              })}
            </tbody> 
          </Table>
        : <p className='mt-2' style={{textAlign: 'center'}}>{t('noReview')}</p>
      }   
    </>
  )
}

export default UserProfile