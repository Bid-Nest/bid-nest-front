import { ShopProductParams, Product } from '@/types';
import axios from '@/utils/axiosInstance';

export const getProductsByShop = async (
  params: ShopProductParams,
): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(
      `/products/list/by/${params.shopId}`,
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
