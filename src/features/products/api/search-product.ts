import { ProductSearchParams, Product } from '@/types';
import { axiosInstance } from '@/utils/axiosInstance';
import queryString from 'query-string';

export const searchProduct = async (
  params: ProductSearchParams,
): Promise<Product[]> => {
  const query = queryString.stringify(params);
  try {
    const response = await axiosInstance.get<Product[]>(
      `/products/search?${query}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
