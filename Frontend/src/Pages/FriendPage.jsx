import { useQuery } from "@tanstack/react-query";
import { getUserFriendReq } from "../lib/api";
import { Link } from "react-router";
import { UsersIcon } from "lucide-react";
import NoFriendReq from "../components/NoFriendReq";
import FriendCard from "../components/FriendCard";
const FriendPage = () => {

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriendReq
  });

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
      </div>
    </div>
  )
}

export default FriendPage
