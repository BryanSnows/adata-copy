import Api from '../../services/Api';

export async function getRefreshToken() {
  const refreshToken = JSON.parse(localStorage.getItem('refresh_token') || '');

  try {
    const response = await Api.post(
      'auth/refresh_token',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
