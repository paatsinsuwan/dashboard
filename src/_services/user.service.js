// import config from 'config';
import { authHeader } from '../_helpers';

export const userService = {
    login,
    logout,
    getAll
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        // mode : 'no-cors',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({ username, password })
    };

    console.log(requestOptions);
    

    return fetch('http://localhost:8000/api-token-auth/', requestOptions)
        .then(handleResponse)
        .then(user =>{
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        mode: 'no-cors',
        headers: authHeader()
    };

    return fetch(`http://localhost:8000/api/v1/social/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}