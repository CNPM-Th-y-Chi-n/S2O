import axios from 'axios';

// 🔥 SỬA QUAN TRỌNG:
// 1. Thêm 'http://' để không bị lỗi ghép chuỗi (lỗi double IP).
// 2. Thêm '/api' vào cuối vì Backend Flask của bạn có prefix là '/api/auth'.
const BASE_URL = 'http://192.168.1.81:5000/api'; 

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- 1. INTERCEPTOR (Tự động gắn Token) ---
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// --- 2. AUTH API ---
export const authApi = {
    login: (data: { username: string; password: string }) => {
        // Kết quả: http://192.168.32.23:5000/api/auth/login
        return api.post('/auth/login', data);
    },

    register: (data: any) => {
        // Kết quả: http://192.168.32.23:5000/api/auth/signup
        return api.post('/auth/signup', data);
    },

    getMe: () => {
        // Kết quả: http://192.168.32.23:5000/api/auth/me
        return api.get('/auth/me');
    },

    forgotPassword: (email: string) => {
        return api.post('/auth/forgot-password', { email });
    },
    
    resetPassword: (data: any) => {
        return api.post('/auth/reset-password', data);
    }
};

// --- 3. BUSINESS API ---
export const tableApi = {
    checkStatus: async (tableId: string) => {
        return new Promise<{ status: 'AVAILABLE' | 'OCCUPIED'; tableName: string }>((resolve) => {
            setTimeout(() => {
                const busyTables = ['5', '8']; 
                const isBusy = busyTables.includes(tableId);
                resolve({
                    status: isBusy ? 'OCCUPIED' : 'AVAILABLE',
                    tableName: `Table ${tableId.padStart(2, '0')}`
                });
            }, 500);
        });
    }
};

export default api; 