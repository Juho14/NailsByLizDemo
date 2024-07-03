export const fetchNailServices = (authToken, accessToken) => {
    const headers = {};

    headers['Api-Key'] = import.meta.env.VITE_API_KEY;

    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "nailservices", {
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
            console.error("Error fetching nail services:", err);
            throw err;
        });
}


export const fetchSpecificNailService = (id, authToken, accessToken) => {
    const headers = {};

    headers['Api-Key'] = import.meta.env.VITE_API_KEY;

    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }
    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "nailservices/" + id, {
        method: 'GET',
        headers: headers
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Something went wrong: " + response.statusText);

            return response.json();
        })
        .catch(err => {
            console.error("Error fetching nail service:", err);
            throw err;
        });
}


export const saveNailService = (nailservice, authToken, accessToken) => {

    const headers = {
        'Content-Type': 'application/json',
        'Api-Key': import.meta.env.VITE_API_KEY,
    };

    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }

    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + 'nailservices', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(nailservice)
    })
        .then(response => {
            if (!response.ok)
                throw new Error("Addition failed: " + response.statusText);

            return response.json();
        })
        .catch(err => console.error(err))
}


export const updateNailservice = (nailservice, id, authToken, accessToken) => {
    const headers = {
        'Content-Type': 'application/json',
        'Api-Key': import.meta.env.VITE_API_KEY,
    };

    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }

    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }

    return fetch(import.meta.env.VITE_API_URL + 'nailservices/' + id, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(nailservice),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
        })
        .then(data => {
            return { success: true, data: data };
        })
        .catch(error => {
            console.error('Error updating nail service:', error);
            throw new Error('Failed to update nail service: ' + error.message);
        });
};


export const deleteNailService = (id, authToken, accessToken) => {
    const headers = {
        'Api-Key': import.meta.env.VITE_API_KEY,
    }
    if (authToken) {
        headers['Auth-Token'] = `Bearer ${authToken}`;
    }

    if (accessToken) {
        headers['Access-Token'] = `Bearer ${accessToken}`;
    }
    return fetch(import.meta.env.VITE_API_URL + "nailservices/" + id, {
        method: 'DELETE',
        headers: headers,
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
        .catch(err => console.error(err))
}