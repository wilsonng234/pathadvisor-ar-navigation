import axios, { AxiosInstance } from 'axios';

const baseURL = 'https://pathadvisor.ust.hk/api';
const api: AxiosInstance = axios.create({ baseURL });

export default api;
