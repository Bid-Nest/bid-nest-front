let cachedCsrfToken: string | null = null;
import axios from 'axios';
export const fetchCsrfToken = async () => {
  if (cachedCsrfToken) return cachedCsrfToken;

  try {
    const response = await axios.get(
      `${import.meta.env.VITE_CSRF_TOKEN_URL}/csrf-token`,
      {
        withCredentials: true,
      },
    );
    cachedCsrfToken = response.data.csrfToken;
    return cachedCsrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};
