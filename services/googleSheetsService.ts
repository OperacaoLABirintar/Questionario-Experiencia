
import { FormData } from '../types';

export const submitToGoogleSheet = async (scriptUrl: string, data: FormData): Promise<void> => {
  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(`Server responded with ${response.status}: ${errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    if (result.result !== 'success') {
      throw new Error(result.error || 'An unknown error occurred during submission.');
    }
  } catch (error) {
    console.error('Error submitting to Google Sheet:', error);
    throw error;
  }
};
