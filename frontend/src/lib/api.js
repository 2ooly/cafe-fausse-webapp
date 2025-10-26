import axios from 'axios';

// Use Vite env at build-time. In dev, leave empty to use proxy.
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({ baseURL });

export default api;

