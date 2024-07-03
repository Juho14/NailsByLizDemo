export const fetchAllUsers = (authToken, accessToken) => {
    const headers = {};
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "users", {
        method: 'GET',
        headers: headers,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Something went wrong: " + response.statusText);
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error fetching users:", err);
            throw err;
        });
}

export const fetchAdmins = (authToken, accessToken) => {
    const headers = {};
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "users/admins", {
        method: 'GET',
        headers: headers,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Something went wrong: " + response.statusText);
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error fetching admins:", err);
            throw err;
        });
}

export const fetchSpecificUser = (userId, authToken, accessToken) => {
    const headers = {};
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "users/" + userId, {
        method: 'GET',
        headers: headers,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Something went wrong: " + response.statusText);
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error fetching user:", err);
            throw err;
        });
}

// Update user
export const updateUser = (userId, updatedUser, authToken, accessToken) => {
    const headers = {};
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "users/" + userId, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            headers,
        },
        body: JSON.stringify(updatedUser)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Something went wrong: " + response.statusText);
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error updating user:", err);
            throw err;
        });
}

// Delete userprofile
export const deleteCurrentUser = (authToken, accessToken) => {
    const headers = {};
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "users", {
        method: 'DELETE',
        headers: headers,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Something went wrong: " + response.statusText);
            }
            return response;
        })
        .catch(err => {
            console.error("Error deleting user:", err);
            throw err;
        });
}

// Delete user
export const deleteSpecificUser = (id, authToken, accessToken) => {
    const headers = {};
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "users/" + id, {
        method: 'DELETE',
        headers: headers,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Something went wrong: " + response.statusText);
            }
            return response;
        })
        .catch(err => {
            console.error("Error deleting user:", err);
            throw err;
        });
}

// Change password
export const changePassword = (updatedUser, authToken, accessToken) => {
    const headers = {};
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "users/password", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            headers,
        },
        body: JSON.stringify(updatedUser)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error changing password:", err);
            throw err;
        });
};