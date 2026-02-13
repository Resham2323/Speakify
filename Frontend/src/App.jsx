import { Routes, Route, Navigate } from 'react-router'
import HomePage from './Pages/HomePage.jsx'
import SignupPage from './Pages/SignupPage.jsx'
import LoginPage from './Pages/LoginPage.jsx'
import CallPage from './Pages/CallPage.jsx'
import ChatPage from './Pages/ChatPage.jsx'
import OnboardingPage from './Pages/OnboardingPage.jsx'
import Notification from './Pages/Notification.jsx'
import { Toaster } from 'react-hot-toast'
import PageLoader from './components/pageLoader.jsx'
import useAuthUser from './hook/useAuthUser.js';
import Layout from './components/Layout.jsx'
import { useThemeStore } from './store/useTheme.jsx'
import FriendPage from './Pages/FriendPage.jsx'

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const {theme} = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;
  console.log("isOnboarded", isOnboarded);

  if (isLoading) return <PageLoader />

  return (
    <div className="h-screen overflow-auto" data-theme={theme}>
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar>
            <HomePage />
          </Layout>
          ) : (<Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />)} />
        <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to={!isOnboarded ? '/onboarding' : '/'} />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={!isOnboarded ? '/onboarding' : '/'} />} />
        <Route path="/call/:id" element={isAuthenticated && isOnboarded ? <CallPage/>  : <Navigate to={isAuthenticated ? '/onboarding':'/login'}/>} />
        <Route path="/chat/:id" element={isAuthenticated && isOnboarded ?
        <Layout showSidebar={false}>
           <ChatPage />
        </Layout> :
            <Navigate to={isAuthenticated ? '/onboarding': '/login'} />} />
            <Route path='/friends' element={<FriendPage/>}/>
        <Route 
        path="/notifications" 
        element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <Notification/>
          </Layout>
        ): (
          <Navigate  to ={isAuthenticated ? '/onboarding': '/login'}/>
        )} />
        <Route path="/onboarding" element={isAuthenticated ? (
          !isOnboarded ? (<OnboardingPage />) : (<Navigate to='/' />)
        ) : (
          <Navigate to='/login' />
        )} />
       
      </Routes>
      <Toaster />
    </div>
  )
}

export default App