const API_BASE_URL = import.meta.env.VITE_LOCAL_API_URL || 'http://localhost:8001/api'; // Rural API
const HUB_API_BASE_URL = import.meta.env.VITE_HUB_API_URL || 'http://localhost:8000/api'; // Hub API per autenticació

class AuthService {
    constructor() {
        this.token = localStorage.getItem('auth_token');
        this.user = JSON.parse(localStorage.getItem('auth_user') || 'null');
    }

    async login(email, password) {
        try {
            // Utilitzar l'API del Hub per autenticació
            const response = await fetch(`${HUB_API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.user && data.token) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('auth_user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message, errors: data.errors };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Network error' };
        }
    }

    async register(name, email, password, password_confirmation) {
        try {
            // Utilitzar l'API del Hub per registre
            const response = await fetch(`${HUB_API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password, 
                    password_confirmation 
                })
            });

            const data = await response.json();

            if (data.success) {
                this.token = data.token;
                this.user = data.user;
                localStorage.setItem('auth_token', data.token);
                localStorage.setItem('auth_user', JSON.stringify(data.user));
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message, errors: data.errors };
            }
        } catch (error) {
            return { success: false, message: 'Network error' };
        }
    }

    async logout() {
        try {
            if (this.token) {
                // Utilitzar l'API del Hub per logout
                await fetch(`${HUB_API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Accept': 'application/json'
                    }
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.token = null;
            this.user = null;
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }
    }

    async getCurrentUser() {
        if (!this.token) return null;

        try {
            // Utilitzar l'API del Hub per obtenir l'usuari actual
            const response = await fetch(`${HUB_API_BASE_URL}/user`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.user = data;
                localStorage.setItem('auth_user', JSON.stringify(data));
                return data;
            } else {
                this.logout();
                return null;
            }
        } catch (error) {
            console.error('Get current user error:', error);
            this.logout();
            return null;
        }
    }

    isAuthenticated() {
        return !!this.token;
    }

    getToken() {
        return this.token;
    }

    getUser() {
        return this.user;
    }

    // Helper method to make authenticated API requests to Rural API
    async apiRequest(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                ...options,
                headers
            });

            if (response.status === 401) {
                this.logout();
                window.location.href = '/login';
                return null;
            }

            return response;
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    // Helper method to make authenticated API requests to Hub API
    async hubApiRequest(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${HUB_API_BASE_URL}${url}`, {
                ...options,
                headers
            });

            if (response.status === 401) {
                this.logout();
                window.location.href = '/login';
                return null;
            }

            return response;
        } catch (error) {
            console.error('Hub API request error:', error);
            throw error;
        }
    }
}

export default new AuthService();
