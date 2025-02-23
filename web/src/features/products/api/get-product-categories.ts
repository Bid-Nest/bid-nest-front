import { ProductCategories } from '@/types';
import { axiosInstance } from '@/utils/axiosInstance';

const getProductCategories = async (): Promise<ProductCategories> => {
  try {
    const response =
      await axiosInstance.get<ProductCategories>(`/products/categories`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export default getProductCategories;
