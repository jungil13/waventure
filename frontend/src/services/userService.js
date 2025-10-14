import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

export const userService = {
  // Get user profile
  getUserProfile: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/profile`);
    return response.data;
  },

  // Update user profile
  updateUserProfile: async (userId, profileData) => {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/profile`, profileData);
    return response.data;
  },

  // Update user password
  updateUserPassword: async (userId, passwordData) => {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}/password`, passwordData);
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (userId, file) => {
    const formData = new FormData();
    formData.append('profile_pic', file);
    
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Get user statistics
  getUserStats: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/stats`);
    return response.data;
  }
};
