import { ShopProductParams, Product } from '@/types';
import axios from '@/utils/axiosInstance';

export const getRelatedProducts = async (
  params: ShopProductParams,
): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      `/products/related/${params.productId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
