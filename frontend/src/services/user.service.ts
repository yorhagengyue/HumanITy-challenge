// 移除未使用的导入
// user.service.ts

import { authHeader, authAxios, getToken, getCurrentUser } from './auth.service';

const API_URL = 'http://localhost:8000/api/users';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  avatar: string;
  role: string;
  phone?: string;
  school?: string;
  grade?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationSettings {
  emailReminders: boolean;
  taskNotifications: boolean;
  healthReminders: boolean;
  emotionalSupportMessages: boolean;
}

export interface PrivacySettings {
  shareHealthData: boolean;
  shareEmotionalData: boolean;
  allowParentAccess: boolean;
  allowSchoolAccess: boolean;
}

// Get current user profile
export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  try {
    // Debug: Check if token exists
    const token = getToken();
    const user = getCurrentUser();
    console.log('Auth Token available:', !!token);
    console.log('Current user available:', !!user);
    
    const response = await authAxios.get(`${API_URL}/me`);
    return response.data;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (id: string, profileData: Partial<UserProfile>): Promise<any> => {
  try {
    const response = await authAxios.put(`${API_URL}/${id}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Upload profile image
export const uploadProfileImage = async (id: string, file: File): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await authAxios.post(`${API_URL}/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...authHeader()
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};

// Get notification settings
export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  try {
    const response = await authAxios.get(`${API_URL}/me/notifications`);
    return response.data;
  } catch (error) {
    console.error('Error getting notification settings:', error);
    // Return default settings if API fails
    return {
      emailReminders: true,
      taskNotifications: true,
      healthReminders: true,
      emotionalSupportMessages: true
    };
  }
};

// Update notification settings
export const updateNotificationSettings = async (settings: NotificationSettings): Promise<any> => {
  try {
    const response = await authAxios.put(`${API_URL}/me/notifications`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

// Get privacy settings
export const getPrivacySettings = async (): Promise<PrivacySettings> => {
  try {
    const response = await authAxios.get(`${API_URL}/me/privacy`);
    return response.data;
  } catch (error) {
    console.error('Error getting privacy settings:', error);
    // Return default settings if API fails
    return {
      shareHealthData: false,
      shareEmotionalData: false,
      allowParentAccess: false,
      allowSchoolAccess: false
    };
  }
};

// Update privacy settings
export const updatePrivacySettings = async (settings: PrivacySettings): Promise<any> => {
  try {
    const response = await authAxios.put(`${API_URL}/me/privacy`, settings);
    return response.data;
  } catch (error) {
    console.error('Error updating privacy settings:', error);
    throw error;
  }
}; 