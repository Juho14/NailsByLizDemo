
export const validateToken = async (accessToken) => {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + 'validate', {
            method: 'GET',
            headers: {
                'Access-Token': `Bearer ${accessToken}`,
                'Api-Key': import.meta.env.VITE_API_KEY,
            }
        });

        if (response.ok) {
            const result = await response.json();
            return { success: true, ...result };
        } else if (response.status === 401) {
            return { success: false, message: "Istuntosi on vanhentunut, kirjaudu sisään uudelleen." };
        } else {
            const errorMessage = await response.json();
            return { success: false, message: errorMessage.message || 'Virhe käyttäjätietojen tarkistuksessa, kirjaudu sisään uudelleen.' };
        }
    } catch (error) {
        console.error('Network or server error during token validation:', error);
        return { success: false, message: 'Virhe käyttäjätietojen tarkistuksessa, kirjaudu sisään uudelleen.' };
    }
};

export async function refreshToken(accessToken) {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + 'refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Token': `Bearer ${accessToken}`,
                'Api-Key': import.meta.env.VITE_API_KEY,
            }
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, authToken: data.authToken, accessToken: data.accessToken };
        } else if (response.status === 401) {
            return { success: false, message: "Session has expired, please log in again." };
        } else {
            const errorMessage = await response.json();
            return { success: false, message: errorMessage.message || 'Error refreshing the token, please log in again.' };
        }
    } catch (error) {
        console.error('Network or server error during token refresh:', error);
        return { success: false, message: 'Error refreshing the token, please log in again.' };
    }
};