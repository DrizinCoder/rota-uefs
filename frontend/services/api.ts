import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_API_BACKEND,
    timeout: 10000,
});

// Interceptor de Requisição (colocando o token)
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token) {
            // O TypeScript pede uma checagem de headers aqui
            if (config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// Tipando o response com AxiosResponse e o error com AxiosError
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;