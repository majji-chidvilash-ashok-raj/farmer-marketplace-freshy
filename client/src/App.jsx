import React from 'react'
import {Route, Routes} from 'react-router-dom'
import SignIn from './pages/signin/SignIn'
import SignUp from './pages/signup/SignUp'
import ForgotPassword from './pages/forgotPassword/forgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
export const serverURL = "http://localhost:4000"
const App = () => {
  useGetCurrentUser();
  return (
    <div>
        <Routes>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/signin' element={<SignIn/>}/>
          <Route path='/forgot-password' element={<ForgotPassword/>}/>

        </Routes>
    </div>
  )
}

export default App
