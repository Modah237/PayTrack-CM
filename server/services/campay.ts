import axios from 'axios';

const CAMPAY_API_URL = process.env.CAMPAY_API_URL || 'https://demo.campay.net/api';
// Env vars aligned with .env.example: CAMPAY_USERNAME / CAMPAY_PASSWORD
const CAMPAY_APP_USERNAME = process.env.CAMPAY_USERNAME || process.env.CAMPAY_APP_USERNAME || '';
const CAMPAY_APP_PASSWORD = process.env.CAMPAY_PASSWORD || process.env.CAMPAY_APP_PASSWORD || '';

let cachedToken: string | null = null;
let tokenExpiryTime = 0;

/**
 * Authenticates with Campay and returns an access token
 */
async function getCampayToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiryTime) {
    return cachedToken;
  }

  try {
    const response = await axios.post(`${CAMPAY_API_URL}/token/`, {
      username: CAMPAY_APP_USERNAME,
      password: CAMPAY_APP_PASSWORD
    });

    cachedToken = response.data.token;
    // Campay tokens typically expire in seconds, default to 15 mins buffer
    const expiresIn = response.data.expires_in || 3600;
    tokenExpiryTime = now + (expiresIn - 300) * 1000;
    
    return cachedToken as string;
  } catch (error) {
    console.error('Campay Auth Error:', error);
    // Return a mock token for development if the API fails or is unconfigured
    if (process.env.NODE_ENV !== 'production') {
      return 'mock_campay_token_for_dev';
    }
    throw new Error('Failed to authenticate with Campay');
  }
}

export const generatePaymentLink = async (amount: number, description: string, externalReference: string): Promise<string> => {
  try {
    const token = await getCampayToken();
    const response = await axios.post(
      `${CAMPAY_API_URL}/get_payment_link/`,
      {
        amount,
        currency: 'XAF',
        description,
        external_reference: externalReference
      },
      {
        headers: {
          Authorization: `Token ${token}`
        }
      }
    );
    return response.data.link;
  } catch (error) {
    console.error('Campay Link Generation Error:', error);
    if (process.env.NODE_ENV !== 'production') {
      return `https://demo.campay.net/pay/mock-${externalReference}`;
    }
    throw new Error('Failed to generate Campay link');
  }
};
