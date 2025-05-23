import axios from 'axios';

const API_URL = 'https://your-api-url.com/api';

export const loginUser = async (credentials: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const signupUser = async (userData: { name: string; email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
};

export const fetchUserProfile = async (userId: string) => {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
};

export const updateUserProfile = async (userId: string, profileData: any) => {
    const response = await axios.put(`${API_URL}/users/${userId}`, profileData);
    return response.data;
};