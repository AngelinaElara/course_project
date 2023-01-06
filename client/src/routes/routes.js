import {Routes, Route} from 'react-router-dom'
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
import UserProfile from '../pages/Profile/UserProfile/UserProfile'
import ConfirmEmail from '../pages/ConfirmEmail/ConfirmEmail'

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
          path='/new/:id' 
          element={<CreateReview />} 
        />
        <Route 
          path='/profile' 
          element={<Profile />} 
        />
        <Route 
          path='/profile/:id' 
          element={<UserProfile />} 
        />
        <Route 
          path='/review/:id' 
          element={<AuthReviewDetails />} 
        />
        <Route path='/search' element={<TagsList />}/>
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
          path='/new' 
          element={<CreateReview />} 
        />
        <Route 
          path='/profile' 
          element={<Profile /> } 
        />
        <Route 
          path='/review/:id' 
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
      <Route path='/verify' element={<ConfirmEmail />}/>
    </Routes>
  )
}