import { axiosInstance } from './axios.js';
export const signup = async (signupData) => {
      const response = await axiosInstance.post('/auth/signup', signupData);
      return response.data;
};

export const login = async (loginData) => {
      const response = await axiosInstance.post('/auth/login', loginData);
      return response.data;
};

export const logout = async () => {
      const response = await axiosInstance.post('/auth/logout');
      return response.data;
};

export const getAuthUser = async () => {
      try {
            const res = await axiosInstance.get("/auth/me");
            return res.data;
      } catch (err) {
            console.log("Error in get AuthUser", err);
            return null;
      }
}

export const completeOnboarding = async (userData) => {
      const response = await axiosInstance.post('/auth/onboarding', userData);
      return response.data;
}

export const getUserFriendReq = async () => {
      const response = await axiosInstance.get('/user/friends');
      return response.data;
}

export const getRecommendedUserReq = async () => {
      const response = await axiosInstance.get('/user');
      return response.data;
}

export const getOutgoingFriendReq = async () => {
      const response = await axiosInstance.get("/user/outgoing-friend-requests");
      return response.data;
}

export const sendFriendRequest = async (userId) => {
      const response = await axiosInstance.post(`/user/friend-request/${userId}`);
      return response.data;
}

export const getFriendRequest = async () => {
      const response = await axiosInstance.get('/user/friend-request');
      return response.data;
}

export const acceptFriendRequest = async(requestId) => {
      const response = await axiosInstance.post(`/user/friend-request/${requestId}/accept`);
      return response.data;
}

export const getStreamToken = async () => {
      const response = await axiosInstance.get('/chat/token');
      return response.data;
}