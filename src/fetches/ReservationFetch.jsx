export const fetchReservations = (authToken, accessToken) => {
    const headers = {};

    headers['Api-Key'] = import.meta.env.VITE_API_KEY;

    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "reservations", {
        method: 'GET',
        headers: headers
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Something went wrong: " + response.statusText);
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error fetching reservations:", err);
            throw err;
        });
};


export const fetchCurrentUsersReservations = (authToken, accessToken) => {
    const headers = {};
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "reservations/myreservations", {
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
            console.error("Error fetching reservations:", err);
            throw err;
        });
}

export const fetchSpecificUsersReservations = (id, authToken, accessToken) => {
    const headers = {};
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "reservations/customer/" + id, {
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
            console.error("Error fetching reservations:", err);
            throw err;
        });
}

export const fetchSpecificReservation = (id, authToken, accessToken) => {
    const headers = {};
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "reservations/" + id, {
        method: 'GET',
        headers: headers,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch reservation: " + response.statusText);
            }
            return response.json();
        })
        .catch(err => {
            throw new Error("Failed to fetch reservation: " + err.message);
        });
}

export const fetchReservationsOfDay = (date, authToken, accessToken) => {
    const headers = {};

    headers['Api-Key'] = import.meta.env.VITE_API_KEY;

    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "reservations/byday/" + date, {
        method: 'GET',
        headers: headers
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Something went wrong: " + response.statusText);
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error fetching reservations:", err);
            throw err;
        });
}


export const fetchReservationsOfWeek = (date, authToken, accessToken) => {
    const headers = {};

    headers['Api-Key'] = import.meta.env.VITE_API_KEY;

    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "reservations/byweek/" + date, {
        method: 'GET',
        headers: headers
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Something went wrong: " + response.statusText);
            }
            return response.json();
        })
        .catch(err => {
            console.error("Error fetching reservations:", err);
            throw err;
        });
}

export const saveReservation = (reservation) => {
    const headers = {
        'Content-type': 'application/json',
        'Api-Key': import.meta.env.VITE_API_KEY,
    };


    return fetch(import.meta.env.VITE_API_URL + 'reservations', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(reservation)
    })
        .then(response => {
            if (response.status === 201) {
                return { success: true };
            } else if (!response.ok) {
                throw new Error("Addition failed: " + response.statusText);
            } else {
                throw new Error("Unexpected response: " + response.status);
            }
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
}

export const updateReservation = (reservation, id, authToken, accessToken) => {
    const headers = {
        'Content-type': 'application/json',
        'Api-Key': import.meta.env.VITE_API_KEY,
    };
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "reservations/" + id, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(reservation)
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
        .catch(err => {
            console.error(err);
            throw err;
        });
};

export const cancelReservation = (id, authToken, accessToken) => {
    const headers = {};

    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "reservations/cancel/" + id, {
        method: 'PUT',
        headers: headers,
    })
        .then(response => {
            if (response.status === 200) {
                return { success: true };
            } else if (!response.ok) {
                throw new Error("Error in cancel: " + response.statusText);
            } else {
                throw new Error("Unexpected response: " + response.status);
            }
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};


export const deleteReservation = (reservationId) => {
    return fetch(import.meta.env.VITE_API_URL + "reservations/" + reservationId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.status === 204) {
                return { success: true };
            } else if (!response.ok) {
                throw new Error("Error in delete: " + response.statusText);
            } else {
                throw new Error("Unexpected response: " + response.status);
            }
        })
        .catch(err => {
            console.error(err);
            throw err;
        });
};