import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getOutgoingFriendReq, getRecommendedUserReq, getUserFriendReq, sendFriendRequest } from '../lib/api';
import {  CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import FriendCard, { getLanguageFlag } from '../components/FriendCard';
import { Link } from 'react-router';
import NoFriendReq, { NoRecommendedUsers } from '../components/NoFriendReq';

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriendReq
  });

  const { data: users, isLoading: loadingUsers} = useQuery({
    queryKey: ['recommendedUsers'],
    queryFn: getRecommendedUserReq
  });

  const { data: outgoingFriendReq } = useQuery({
    queryKey: ['outgoingFriendReq'],
    queryFn: getOutgoingFriendReq
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['outgoingFriendReq'] })
  });

  useEffect(() => {
    const outgoingIds = new Set()
    if (outgoingFriendReq && outgoingFriendReq.length > 0) {
      outgoingFriendReq.forEach((req) => {
      const recipientId =
        req.recipient && typeof req.recipient === "object"
          ? req.recipient._id
          : req.recipient;

      outgoingIds.add(recipientId.toString());
    });
      setOutgoingRequestsIds(outgoingIds);
    }
  },[outgoingFriendReq]);
  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className="constainer">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ">
          <h2 className='text-2xl font-bold tracking-tight sm:text-3xl'>Your Friends</h2>
          <Link to='/notifications' className='btn btn-outline btn-sm'>
            <UsersIcon className='size-4 mr-2' />
            Friend Request
          </Link>
        </div>

           {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendReq />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

          <section>
             <div className="mb-6 sm:mb-8">
              <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className='text-2xl sm:text-3xl font-bold tracking-tight pt-4'>Meet New Learners</h2>
                  <p className='opacity-70'>Discover perfect language partner based on your profile</p>
                </div>
              </div>
             </div>

             {
              loadingUsers ? (
                <div className="flex justify-center py-12">
                  <span className='loading loading-spinner loading-lg'/>
                </div>
              ): users.length === 0 ? (
                <NoRecommendedUsers/>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {
                    users.map((user) => {
                      const hasReqBeenSent = outgoingRequestsIds.has(user._id.toString());
                        console.log("user", hasReqBeenSent );
                      return (
                       <div className='card bg-base-200 hover:shadow-lg transition-all duration-30' key={user._id}>
                        <div className="card-body p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="avatar size-16 rounded-full ">
                              <img src={user.profilePic} alt={user.fullName} />
                            </div>
                            <div>
                              <h3 className='font-semibold text-lg'>{user.fullName} </h3>
                              {user.location && (
                                <div className="flex items-center text-sm opacity-70 mt-1">
                                  <MapPinIcon className='size-4 mt-1' />
                                  {user.location}
                                </div>
                                )}
                            </div>
                          </div>

                          {/* languages with flag */}
                          <div className="flex flex-wrap gap-1.5">
                            <span className='badge badge-secondary'>
                              {getLanguageFlag(user.nativeLanguage)}
                              Native:{ Capitalize(user.nativeLanguage)}
                            </span>
                            <span className='badge badge-outline'>
                              {getLanguageFlag(user.learningLanguage)}
                              Learning:{ Capitalize(user.learningLanguage)}
                            </span>
                          </div>
                          {/* bio */}
                          {user.bio && (
                            <p className='text-sm opacity-70'>{user.bio}</p>
                          )}
                          {/* action button */}

                          <button 
                          className={`btn mt-2 w-full ${hasReqBeenSent ? "btn-disabled" : "btn-primary"}`}
                          onClick={() => sendRequestMutation(user._id)}
                          disabled={hasReqBeenSent || isPending}
                          >
                            {
                              hasReqBeenSent ? (
                                <>
                                <CheckCircleIcon className='size-4 mr-2'/>
                                Request Sent
                                </>
                              ):(
                                <>
                                <UserPlusIcon className='size-4 mr-2'/>
                                Send Friend Request
                                </>
                              )
                            }
                          </button>
                        </div>
                       </div>
                      )
                    })}
                </div>
              )}
          </section>
      </div>
    </div>
  )
}

export default HomePage;

const Capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
