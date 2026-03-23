import { Link } from "react-router";
import { LANGUAGE_TO_FLAG } from "../constant";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteFriendFromList } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const FriendCard = ({ friend }) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);


const {mutate:deleteFriendMutation} = useMutation({
  mutationFn:deleteFriendFromList,
  onSuccess: () => {
    toast.success(`your ${friend.fullName} deleted successfully`);
    queryClient.invalidateQueries({queryKey:['friends']})
  }
});

  const handleDeleteClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        <div className="flex justify-end">
          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-400" onClick={handleDeleteClick} />
        </div>
        {
          isOpen &&
          <div className="fixed animate-fade-in flex items-center justify-center inset-0 bg-base-400 backdrop-blur-sm z-50">
            <div className="bg-base-200 text-center p-6 rounded-lg shadow-xl w-[400px]">
               <p className="text-lg font-semibold mb-4">
        Are you sure you want to delete <br />
        <span className="text-red-400">{friend.fullName}</span> ?
      </p>
            <div className="flex justify-center gap-4">

        <button
          onClick={() => setIsOpen(false)}
          className="btn btn-outline"
        >
          Cancel
        </button>

        <button
          onClick={() => deleteFriendMutation(friend._id)}
          className="btn btn-error"
        >
          Delete
        </button>

      </div>

            </div>
          </div>
        }
        {/* USER INFO */}
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} />
          </div>
          <h3 className="font-semibold truncate">{friend.fullName}</h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="badge badge-secondary text-xs">
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>
          <span className="badge badge-outline text-xs">
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};
export default FriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}