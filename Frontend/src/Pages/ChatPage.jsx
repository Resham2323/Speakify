import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { getStreamToken } from '../lib/api';
import useAuthUser from '../hook/useAuthUser';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';

import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';
import ChatLoader from '../components/ChatLoader';
import CallButton from '../components/CallButton';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {

  const { id: targetedUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!authUser // only run if authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!authUser || !tokenData?.token) return;
      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);
        await client.connectUser({
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic
        }, tokenData.token);

        const channelId = [authUser._id, targetedUserId].sort().join("-");
        const channel = client.channel('messaging', channelId, {
          members: [authUser._id, targetedUserId]
        });

        await channel.watch();

        setChannel(channel)
        setChatClient(client);
      } catch (err) {
        console.log('Error initializing chat client:', err);
        toast.error('Failed to initialize chat.');
      } finally {
        setLoading(false);
      }
    }
    initChat();
  }, [tokenData, authUser, targetedUserId]);

  if (loading || !chatClient || !channel) return <ChatLoader />

  const handleVideoCall = () => {
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text:`I have started a video call. Join me here : ${callUrl}`
      });
      toast.success('Video call link sent successfully')
    }
  }

  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput focus />
          </Window>
          </div>
          <Thread/>
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
