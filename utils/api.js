import axios from 'axios';

let api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export { api };
