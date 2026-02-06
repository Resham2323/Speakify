import { ShipWheelIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router'
import useLogin from '../hook/useLogin';

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email:'',
    password:''
  });

 const {isPending, error, loginMutation} = useLogin();

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 ">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded shadow-lg overflow-hidden'>
        {/* Login form section */}
        <div className='w-full lg:w-1/2 flex flex-col p-4 sm:p-8'>
          <div className="mb-4 flex items-center justify-start gap-2">
            <ShipWheelIcon className='size-9 text-primary' />
            <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>Speakify</span>
          </div>
          {/* error if any */}
          {
            error && (
              <div className='alert alert-error mb-4'>
                <span>{error.response.data.message}</span>
              </div>
            )
          }
          <div className='w-full'>
            <form onSubmit={handleLoginSubmit} >
              <div className='space-y-4'>
                <div>
                  <h2 className='text-xl font-semibold' >Welcome Back</h2>
                  <p className='text-sm opacity-70'>Sign in to your account to continue your language journey</p>
                </div>
                <div className='space-y-3'>
                  {/* email */}
                  <div className='form-control w-full'>
                    <label>
                      <span className='label-text' >Email</span>
                    </label>
                    <input type="email"
                      placeholder='john@gmail.com'
                      className='input input-bordered w-full'
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email:e.target.value})}
                      required
                    />
                  </div>
                  {/* password */}
                  <div className='form-control w-full'>
                    <label>
                      <span className='label-text' >Password</span>
                    </label>
                    <input type="password"
                      placeholder='********'
                      className='input input-bordered w-full'
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password:e.target.value})}
                      required
                    />
                    <p>
                      Password must be at least 6 characters long.
                    </p>
                  </div>
                </div>
                <button className="btn btn-primary w-full" type='submit' >{isPending? (
                  <>
                  <span className='loading loading-spinner loading-xs'></span>
                  Sign in...
                  </>
                ):("Sign in") }
                </button>
                <div className='text-center mt-4'>
                  <p className='text-sm'>
                    Don't have  an account? {""}
                    <Link to={'/signup'} className='text-primary hover:underline' 
                    > Create One</Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* login right side */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center ">
        <div className="max-width-md p-8">
          <div className="relative aspect-square max-w-sm mx-auto">
            <img src="/signup.png" alt="language connection illustration" className='w-full h-full' />
          </div>
          <div className="text-center space-y-3 mt-6">
            <h2 className='text-xl font-semibold' >Connect with language partners worldwide</h2>
            <p className='opacity-70' >
              Practice conversaton makes friends, and improves fluency. Start your journey with Speakify today!
            </p>
          </div>
        </div>

        </div>
      </div>
    </div>
  )
}

export default LoginPage
