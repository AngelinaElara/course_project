import {useState, useContext, useEffect} from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import DropzoneComponent from './components/DropZone/Dropzone'
import StarRating from './components/StarRating/StarRating'

const Review = () => {
  return (
    <div className='d-flex justify-content-center align-items-center flex-column' style={{overflowY: 'scroll'}}>
      <h1>New review</h1>
      <Form 
        className='d-flex justify-content-center align-items-center flex-column p-3 mb-5' 
        style={{width: '100%'}}
      >
        <Form.Group 
          className='mb-3'
          style={{width: '90%'}}
        >
          <Form.Label htmlFor='title'>Title</Form.Label>
          <Form.Control id='title' placeholder='Name of the book/film and etc...' />
        </Form.Group>

        <Form.Group 
          className='mb-3'
          style={{width: '90%'}}
        >
          <Form.Label>Category</Form.Label>
          <Form.Select>
            <option></option>
            <option value='films'>Films</option>
            <option value='books'>Books</option>
            <option value='games'>Games</option>
          </Form.Select>
        </Form.Group>

        <Form.Group 
          className='mb-3'
          style={{width: '90%'}}
        >
          <Form.Label>Description</Form.Label>
          <Form.Control as='textarea' rows={5}/> 
        </Form.Group>

        <Form.Group 
          className='mb-3'
          style={{width: '90%'}}
        >
          <Form.Label htmlFor='tags'>Tags #</Form.Label>
          <Form.Control id='tags' placeholder='Tags' />
        </Form.Group>

        <DropzoneComponent />

        <Form.Group
          className='mb-3 d-flex flex-column'
          style={{width: '90%'}}
        >
          <Form.Label>Leave your rating:</Form.Label>
          {/* <input type='range' mim='0' max='10' style={{width: '50%'}}/> */}
          <StarRating />
        </Form.Group>
        
        <Button className='mt-2'>Leave feedback</Button>
      </Form>
    
    </div>
  )
}

export default Review