export const fetchReservationSettings = (authToken, accessToken) => {
    const headers = {};
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "reservationsettings", {
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
            console.error("Error fetching reservationsettings:", err);
            throw err;
        });
}

export const fetchSpecificReservationSetting = (id, authToken, accessToken) => {
    const headers = {};
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "reservationsettings/" + id, {
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
            console.error("Error fetching reservationsetting:", err);
            throw err;
        });
}

export const fetchActiveReservationSetting = () => {
    const headers = {};

    headers['Api-Key'] = import.meta.env.VITE_API_KEY;

    return fetch(import.meta.env.VITE_API_URL + "reservationsettings/active", {
        method: 'GET',
        headers: headers
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch reservationsetting: " + response.statusText);
            }
            return response.json();
        })
        .catch(err => {
            throw new Error("Failed to fetch reservationsetting: " + err.message);
        });
}

export const activateReservationSetting = (id, authToken, accessToken) => {
    const headers = {
        'Content-type': 'application/json',
    }
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "reservationsettings/activate/" + id, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(id)
    })
        .then(response => {
            if (response.status === 200) {
                return { success: true };
            } else if (!response.ok) {
                throw new Error("Error in activation: " + response.statusText);
            } else {
                throw new Error("Unexpected response: " + response.status);
            }
        })
        .then(data => {
            return data;
        })
        .catch(err => {
            console.error(err);
            return { success: false };
        });
}

export const saveReservationSetting = (reservationsetting, authToken, accessToken) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }

    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + 'reservationsettings', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(reservationsetting)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Addition failed: " + response.statusText);

            return { success: true };
        })
        .catch(err => {
            console.error(err);
            return { success: false };
        });
}

export const updateReservationSetting = (reservationSetting, id, authToken, accessToken) => {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }

    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + 'reservationsettings/' + id, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(reservationSetting)
    })
        .then(response => {
            if (response.status === 200) {
                return { success: true };
            } else if (!response.ok) {
                throw new Error("Error in edit: " + response.statusText);
            } else {
                throw new Error("Unexpected response: " + response.status);
            }
        })
        .then(data => {
            return data;
        })
        .catch(err => console.error(err));
};

export const deleteReservationSetting = (id, authToken, accessToken) => {
    const headers = {};

    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }

    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "reservationsettings/" + id, {
        method: 'DELETE',
        headers: headers,
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Error in delete: " + response.statusText);

            return { success: true };
        })
        .catch(err => console.error(err));
}