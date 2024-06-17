import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export interface CheckParams {
    email?: string;
    phone?: string;
    [key: string]: string | undefined;
}

export const checkBlacklist = async (params: CheckParams): Promise<boolean> => {
    try {
        const response = await axios.get(`https://adjutor.lendsqr.com/v2/verification/karma/0zspgifzbo.ga`, {
            params,
            headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
            }
        });

        console.log('Response data:', response.data); // Log the response data for debugging

        return response.data.blacklisted;
    } catch (error: any) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response error data:', error.response.data);
            console.error('Response error status:', error.response.status);
            console.error('Response error headers:', error.response.headers);
            if (error.response.status === 404) {
                console.error('Resource not found:', error.response.data);
            } else if (error.response.status === 401) {
                console.error('Unauthorized access - check your API key:', error.response.data);
            } else {
                console.error('Error checking blacklist:', error.response.data);
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request setup error:', error.message);
        }
        throw new Error('Failed to check blacklist');
    }
};
