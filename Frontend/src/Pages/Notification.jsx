import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from 'lucide-react';
import { acceptFriendRequest, getFriendRequest } from '../lib/api';

const Notification = () => {
  const queryClient = useQueryClient();

  const { data: friendRequest, isLoading } = useQuery({
    queryKey: ['friendRequest'],
    queryFn: getFriendRequest
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequest'] }),
        queryClient.invalidateQueries({ queryKey: ['friends'] })
    }
  });

  const incomingRequest = friendRequest?.incomingRequest || []
  const acceptRequest = friendRequest?.acceptRequest || []
  console.log(acceptRequest)

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className="container mx-auto mx-w-4xl space-y-8">
        <h1 className='text-2xl sm:text-3xl tracking-tight font-bold mb-6'>Notifications</h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className='loading loading-spinner loading-lg' />
          </div>
        ) : (
          <>
            {
              incomingRequest.length > 0 && (
                <section className='space-y-4'>
                  <h2 className='text-xl font-semibold flex items-center gap-2'>
                    <UserCheckIcon className='size-5 text-primary' />
                    Friend Request
                    <span className='badge badge-primary ml-2'>{incomingRequest.length}</span>
                  </h2>

                  <div className="space-y-3">
                    {incomingRequest.map((request) => (
                      <div key={request._id} className="card bg-base-200  shadow-sm hover:shadow-md transition-shadow">
                        <div className="card-body p-4">
                          <div className="flex items-center justify-between">
                          <div className="flex  items-center gap-3">
                            <div className="avatar rounded-full size-14 bg-base-300">
                              <img src={request.sender.profilePic} alt={request.sender.fullName} />
                            </div>
                            <div>
                              <h3 className='font-semibold'>{request.sender.fullName}</h3>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                <span className='badge badge-secondary'>
                                  Native:{request.sender.nativeLanguage}
                                </span>
                                <span className='badge badge-outline'>
                                   Learning:{request.sender.learningLanguage}
                                </span>
                              </div>
                              
                            </div>
                          </div>
                          <button
                          className='btn btn-sm btn-primary'
                          onClick={() => acceptRequestMutation(request._id)}
                          disabled={isPending}
                          > 
                          Accept
                          </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {/* Accept friend request */}
              {acceptRequest.length > 0 && (
                <div className='space-y-4'>
                  <h2 className='text-xl font-semibold flex items-center gap-2'>
                    <BellIcon className='size-5 text-success'/>
                    New Connections
                  </h2>
                  <div className='space-y-3'>
                    {acceptRequest.map((notification) => (
                       <div key={notification._id} className="card bg-base-200 shadow-sm ">
                        <div className="card-body p-4">
                          <div className="flex items-center gap-3">
                            <div className="avatar rounded-full size-10 mt-1">
                              <img src={notification.recipient.profilePic} alt={notification.recipient.fullName} />
                            </div>
                            <div className="flex-1">
                              <h3 className='font-semibold'>{notification.recipient.fullName}</h3>
                              <p className='text-sm my-1'>
                                {notification.recipient.fullName} accept ypur friend request
                              </p>
                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className='mr-1 size-3' />
                                Recently
                              </p>
                            </div>
                             <div className="badge badge-seccess">
                              <MessageSquareIcon className='size-3 mr-1'/>
                              New Friend
                             </div>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              )}
          </>
        )}
      </div>
    </div>
  )
}

export default Notification
