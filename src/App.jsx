import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes
} from 'react-router-dom'
import LandingPage from './pages/landingPage'
import Login from './pages/login'
import SignUp from './pages/signUp'
import ProtectedRoute from './utils/protectedRoutes'
import Navbar from './components/navbar'
import Dashboard from './pages/dashboard'
import Quiz from './pages/quiz'
import Feedback from './components/feedback'
import { useAuth } from './context/useAuth'
import Layout from './components/admin/layout'
import AdminDashboard from './pages/admin/dashboard'
import Quizzes from './pages/admin/quizzes'
import CreateQuiz from './pages/admin/createQuiz'
import EditQuiz from './pages/admin/editQuiz'
import Logs from './pages/admin/logs'
import Log from './pages/admin/log'
import { Fragment } from 'react'
import NotFound from './pages/notFound'
import EmailVerify from './pages/EmailVerify'
import VerifyToken from './pages/verifyToken'
import ForgotPassword from './pages/forgotPassword'
import ResetPassword from './pages/resetPassword'
import StudentQuizzes from './components/studentQuizzes'
import About from './pages/about'
import Students from './pages/admin/students'

function App () {
  const { user } = useAuth()

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<About />} />
        <Route path='/about' element={<About />} />
        <Route path='/email-verification' element={<EmailVerify />} />
        <Route path='/verify/:token' element={<VerifyToken />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route
          path='guest-mode'
          element={
            <div className='flex flex-col w-full'>
              <Navbar />
              <Outlet />
            </div>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path='quiz/:id' element={<Quiz />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route
            path='dashboard'
            element={
              <>
                {user?.role == 'admin' ? (
                  <Layout>
                    <Outlet />
                  </Layout>
                ) : user?.role == 'student' ? (
                  <div className='flex flex-col w-full'>
                    <Navbar />
                    <Outlet />
                  </div>
                ) : (
                  <NotFound />
                )}
              </>
            }
          >
            {user?.role == 'admin' ? (
              <Fragment>
                <Route index element={<AdminDashboard />} />
                <Route path='quizzes' element={<Outlet />}>
                  <Route index element={<Quizzes />} />
                  <Route path='create' element={<CreateQuiz />} />
                  <Route path='edit/:id' element={<EditQuiz />} />
                  <Route path='view/:id' element={<Quiz />} />
                </Route>
                <Route path='students' element={<Students />} />
                <Route path='logs' element={<Outlet />}>
                  <Route index element={<Logs />} />
                  <Route path=':id' element={<Log />} />
                </Route>
                <Route path='*' element={<Navigate to='/not-found' />} />
              </Fragment>
            ) : user?.role == 'student' ? (
              <Fragment>
                <Route index element={<Dashboard />} />
                
                <Route path='my-quizzes' element={<Outlet />}>
                  <Route index element={<StudentQuizzes />} />
                  <Route
                    path=':id'
                    element={
                      <div className='flex flex-col items-center justify-center p-4 md:px-8 lg:px-20'>
                        <Log />
                      </div>
                    }
                  />
                </Route>
                <Route path='quiz/:id' element={<Outlet />}>
                  <Route index element={<Quiz />} />
                  {/* <Route path="feedback" element={<Feedback />} /> */}
                </Route>
                <Route path='*' element={<Navigate to='/not-found' />} />
              </Fragment>
            ) : (
              <Route path='*' element={<Navigate to='/not-found' />} />
            )}
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/not-found' />} />
        <Route path='/not-found' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
