export async function login(user) {
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + `public/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': import.meta.env.VITE_API_KEY,
            },
            body: JSON.stringify(user)
        });
        return response;
    } catch (error) {
        console.error(error);
    }
};

export async function register(user) {
    return fetch(import.meta.env.VITE_API_URL + `users/register`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Api-Key': import.meta.env.VITE_API_KEY,
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (response.status === 201) {
                return { success: true };
            } else if (!response.ok) {
                return response.json().then(err => { throw new Error("Registration failed: " + (err.message || response.statusText)); });
            } else {
                throw new Error("Unexpected response: " + response.status);
            }
        })
        .catch(error => {
            console.error(error);
            throw error;
        });
}