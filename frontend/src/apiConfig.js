// Central API base URL — uses the Render backend in production,
// falls back to localhost for local development (Vite proxy handles it).
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default API_BASE;
