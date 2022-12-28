import {Routes, Route} from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Main from '../pages/Main'
import Login from '../pages/Login'
import Authorization from '../pages/Authorization'
import CreateReview from '../pages/CreateReview'
import Profile from '../pages/Profile'
import AuthReviewDetails from '../pages/AuthReviewDetails'
import ReviewDetails from '../pages/ReviewDetails'
import Success from '../components/OAuth/components/Success'
import Error from '../components/OAuth/components/Error'
import TagsList from '../pages/TagsList/TagsList'
import ReviewList from '../components/ReviewList'

export const useRoutes = (
  isAuth,
  tags,
  data,
  role
) => {
  if (isAuth && role === 'admin') {
    return (
      <Routes>
        <Route 
          path='*' 
          element={<Main tags={tags} data={data} />} 
        />
        <Route 
          path='/' 
          element={<Main tags={tags} data={data}/>} 
        />
        <Route 
          path='/:id' 
          element={<AuthReviewDetails data={data} listTags={tags}/>} 
        />
        <Route 
          path='/review/:id' 
          element={<CreateReview listTags={tags}/>} 
        />
        <Route 
          path='/profile' 
          element={<Profile data={data}/>} 
        />
        <Route 
          path='/user/review/:id' 
          element={<AuthReviewDetails data={data}/>} 
        />
        <Route 
          path='/profile/:id' 
          element={<AuthReviewDetails data={data}/>} 
        />
        <Route path='/search' element={<TagsList />}/>
        <Route 
          path='/user/:id' 
          element={
            <Container>
              <Row>
                <ReviewList data={data} title={"Author's reviews"}/>
              </Row>
            </Container>
          } 
        />
      </Routes>
    )
  } else if(isAuth && role === 'user') {
    return (
      <Routes>
        <Route 
          path='*' 
          element={<Main tags={tags} data={data} />} 
        />
        <Route 
          path='/' 
          element={<Main tags={tags} data={data}/>} 
        />
        <Route 
          path='/:id' 
          element={<ReviewDetails data={data}/>} 
        />
        <Route 
          path='/review' 
          element={<CreateReview listTags={tags}/>} 
        />
        <Route 
          path='/profile' 
          element={<Profile data={data}/>} 
        />
        <Route 
          path='/profile/:id' 
          element={<AuthReviewDetails data={data}/>} 
        />
        <Route path='/search' element={<TagsList />}/>
      </Routes>
    )
  }

  return (
    <Routes>
      <Route 
        path='*' 
        element={<Main tags={tags} data={data}/>} 
      />
      <Route 
        path='/' 
        element={<Main tags={tags} data={data}/>} 
      />
      <Route 
        path='/:id' 
        element={<ReviewDetails data={data}/>} 
      />
      <Route path='/login' element={<Login />} />
      <Route path='/authorization' element={<Authorization />} />
      <Route path='/login/success' element={<Success />} />
      <Route path='/login/error' element={<Error />} />
      <Route path='/search' element={<TagsList />}/>
    </Routes>
  )
}