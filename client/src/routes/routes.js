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

export const useRoutes = (isAuth) => {
  if (isAuth) {
    return (
      <Routes>
        <Route path='*' element={<Main />} />
        <Route path='/' element={<Main />} />
        <Route path='/:id' element={<ReviewDetails />} />
        <Route path='/review' element={<CreateReview />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/profile/:id' element={<AuthReviewDetails />} />
        <Route path='/search' element={<TagsList />}/>
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path='*' element={<Main />} />
      <Route path='/' element={<Main />} />
      <Route path='/:id' element={<ReviewDetails />} />
      <Route path='/login' element={<Login />} />
      <Route path='/authorization' element={<Authorization />} />
      <Route path='/login/success' element={<Success />} />
      <Route path='/login/error' element={<Error />} />
      <Route path='/search' element={<TagsList />}/>
    </Routes>
  )
}