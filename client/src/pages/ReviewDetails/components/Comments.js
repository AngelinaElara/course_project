import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import moment from 'moment'
import userAvatar from '../../../ui/user.png'

const Comments = ({
  isAuth,
  commentValue,
  setCommentValue,
  handleCommentBtnClick,
  commentsArray
}) => {
  return (
    <>
    <Form style={{padding: '10px', width: '70%'}}>
    <p style={{fontWeight: '600', fontSize: '20px'}}>Comments</p>
      <Form.Group className='d-flex flex-row gap-2' style={{position: 'relative'}}>
        {isAuth 
          ? <Form.Control 
              placeholder='Leave your opinion' 
              value={commentValue} 
              onChange={(event) => setCommentValue(event.target.value)}
              style={{width: '100%'}}
            />
          : <Form.Control 
              placeholder='Leave your opinion' 
              style={{width: '100%'}}
              disabled
            />
        }
        <Button 
          onClick={handleCommentBtnClick}
        >
          Send
        </Button>
      </Form.Group>
    </Form>
    <ListGroup 
      as='ul'
      style={{maxHeight: '600px', height: 'auto', overflow: 'auto'}}
    >
        {commentsArray.map((comment, index) => {
          return (
            <ListGroup.Item 
              as='li' 
              key={index} 
              className='d-flex flex-row gap-4 align-items-center' 
              style={{padding: '15px'}}
            >
              <div>
                <img  
                  src={userAvatar}
                  alt='user avatar'
                  style={{width: '50px', height: '50px'}}
                />
              </div>
              <div>
                <p style={{fontWeight: '600'}}>{comment.from}</p>
                <p>{comment.text}</p>
                <p style={{color: '#787878', fontSize: '12px'}}>{moment(comment.date).calendar()}</p>
              </div>
            </ListGroup.Item>
          )})}
    </ListGroup>
    </>
  )
}

export default Comments