import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  authDomain: 'course-724b1.firebaseapp.com',
  projectId: 'course-724b1',
  storageBucket: 'course-724b1.appspot.com'
}

const app = initializeApp(firebaseConfig)

const storage = getStorage(app)

export {storage}