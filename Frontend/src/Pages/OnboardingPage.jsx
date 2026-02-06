import { useState } from 'react';
import { CameraIcon, LoaderIcon, LucideShuffle, MapPinIcon, ShipWheelIcon } from 'lucide-react';
import useAuthUser from '../hook/useAuthUser.js';
import { LANGUAGES } from '../constant/index.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeOnboarding } from '../lib/api.js';
import toast from 'react-hot-toast';

const OnboardingPage = () => {

  const { authUser } = useAuthUser();
   const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || '',
    learningLanguage: authUser?.learningLanguage || '',
    nativeLanguage: authUser?.nativeLanguage || '',
    bio: authUser?.bio || '',
    location: authUser?.location || '',
    profilePic: authUser?.profilePic || '',
  });


 const { mutate:onboardingMutation, isPending} = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile Onboarded Successfully");
      queryClient.invalidateQueries({ querKey: ['authUser'] })
    },
   onError: () => {
    toast.error(error.response.data.message)
   }
  })


const handleRandomAvatar = () => {
  const idx = Math.floor(Math.random() * 1000) + 1;

  const newAvatar = `https://i.pravatar.cc/300?u=${idx}`;

  setFormState((prev) => ({
    ...prev,
    profilePic: newAvatar,
  }));

  toast.success("Random avatar generated!");
};


  const handleOnboarding = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  }

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center'>
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-4 sm:p-6">
           <h2 className='text-2xl sm:text-3xl font-bold mb-3 text-center'>Complete Your Profile</h2>
           <form onSubmit={handleOnboarding} className='space-y-3' >
              {/* profile pic container */}
              <div className="flex flex-col items-center justify-center space-y-3">
                {/* image preview */}
                <div className="size-32 rounded-full bg-base-300 overflow-hidden ">
                   {formState.profilePic ? (
                    <img 
                    src={formState.profilePic}
                    alt="Profile preview"
                    className='w-full h-full object-cover' />
                   ):(
                    <div className="flex items-center justify-center h-full">
                      <CameraIcon className='size-12 text-base-content opacity-40 '/>
                    </div>
                   )
                   }
                </div>
                {/* generate avatar */}
                 <div className="flex items-center gap-2">
                   <button type='button' className='btn btn-accent' onClick={handleRandomAvatar} >
                    <LucideShuffle  className='size-4 mr-2' />
                    Generate Random Avatar
                   </button>
                 </div>
              </div>
              
                {/* fullName */}
                 <div className="form-control">
                  <label className='label' >
                    <span className='label-text'>Full Name</span>
                  </label>
                  <input 
                  type='text'
                  name='fullName'
                  placeholder='your full name'
                  value={formState.fullName}
                  onChange={(e) => setFormState({...formState, fullName:e.target.value})}
                  className='input input-bordered opacity-80 rounded w-full '
                  />
                 </div>

                 {/* bio */}
                 <div className="form-control">
                  <label className='label' >
                    <span className='label-text'>Bio</span>
                  </label>
                  <textarea 
                  type='text'
                  name='bio'
                  placeholder='Tell others about ypurself and your language learning goals...'
                  value={formState.bio}
                  onChange={(e) => setFormState({...formState, bio:e.target.value})}
                  className='input input-bordered rounded w-full opacity-80 h-20 px-3 py-2'
                  />
                 </div>
             
             {/* Languages */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* native language */}
              <div className="form-control">
                <label className='label' >
                  <span className='label-text'>Native Language</span>
                </label>
                <select 
                name="nativeLanguage" 
                value={formState.nativeLanguage}
                onChange={(e) => setFormState({...formState, nativeLanguage:e.target.value})}
                className='select select-bordered rounded opacity-70 w-full'
                >
                <option value="">Select your native language</option>
                {
                  LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()} >{lang}</option>
                  ))
                }
                </select>
              </div>
               {/* learning language */}
              <div className="form-control">
                <label className='label' >
                  <span className='label-text'>Learning Language</span>
                </label>
                <select 
                name="learningLanguage" 
                value={formState.learningLanguage}
                onChange={(e) => setFormState({...formState, learningLanguage:e.target.value})}
                className='select select-bordered rounded opacity-80 w-full'
                >
                <option value="">Select your learning language</option>
                {
                  LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()} >{lang}</option>
                  ))
                }
                </select>
              </div>
             </div>
             {/* location */}
             <div className="formControl">
               <label className='label'>
                 <span className='label-text'>Location</span>
               </label>
               <div className="relative">
                <MapPinIcon className='absolute top-1/3 transform-translate-y-1/2 left-3 size-5 text-base-content opacity-80' />
                <input
                type="text" 
                name="location"
                value={formState.location}
                onChange={(e) => setFormState({...formState, location:e.target.value})}
                placeholder='City, Country'
                className='input input-bordered rounded w-full pl-10 opacity-70'
                />
               </div>
             </div>
             {/* submit button */}
             <button className='btn btn-primary rounded w-full' disabled={isPending} type='submit'>
              {!isPending ? (
                <>
                <ShipWheelIcon className='size-5 mr-2'/>
                Complete Onboarding
                </>
              ): (
                 <>
                 <LoaderIcon className='animate-spin size-5 mr-2'/>
                 Onboarding...
                 </>
              )}
             </button>
           </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
