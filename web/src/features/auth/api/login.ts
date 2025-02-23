import { AxiosResponse } from 'axios';
import { AuthResponse, LoginData } from '@/types';
import { axiosInstance } from '@/utils/axiosInstance';

export const login = async (
  data: LoginData,
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const response: AxiosResponse<AuthResponse> = await axiosInstance.post(
      '/auth/login',
      data,
    );
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return undefined as unknown as AxiosResponse<AuthResponse>;
  }
};
