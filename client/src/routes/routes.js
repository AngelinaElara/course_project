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
  role
) => {
  if (isAuth && role === 'admin') {
    return (
      <Routes>
        <Route 
          path='*' 
          element={<Main />} 
        />
        <Route 
          path='/' 
          element={<Main />} 
        />
        <Route 
          path='/:id' 
          element={<AuthReviewDetails />} 
        />
        <Route 
          path='/review/:id' 
          element={<CreateReview />} 
        />
        <Route 
          path='/profile' 
          element={<Profile />} 
        />
        <Route 
          path='/user/review/:id' 
          element={<AuthReviewDetails />} 
        />
        <Route 
          path='/profile/:id' 
          element={<AuthReviewDetails />} 
        />
        <Route path='/search' element={<TagsList />}/>
        <Route 
          path='/user/:id' 
          element={
            <Container>
              <Row>
                <ReviewList title={"Author's reviews"}/>
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
          element={<Main />} 
        />
        <Route 
          path='/' 
          element={<Main/>} 
        />
        <Route 
          path='/:id' 
          element={<ReviewDetails />} 
        />
        <Route 
          path='/review' 
          element={<CreateReview />} 
        />
        <Route 
          path='/profile' 
          element={<Profile /> } 
        />
        <Route 
          path='/profile/:id' 
          element={<AuthReviewDetails />} 
        />
        <Route path='/search' element={<TagsList />}/>
      </Routes>
    )
  }

  return (
    <Routes>
      <Route 
        path='*' 
        element={<Main />} 
      />
      <Route 
        path='/' 
        element={<Main />} 
      />
      <Route 
        path='/:id' 
        element={<ReviewDetails />} 
      />
      <Route path='/login' element={<Login />} />
      <Route path='/authorization' element={<Authorization />} />
      <Route path='/login/success' element={<Success />} />
      <Route path='/login/error' element={<Error />} />
      <Route path='/search' element={<TagsList />}/>
    </Routes>
  )
}