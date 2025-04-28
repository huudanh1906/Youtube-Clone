import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
    async login(username, password) {
        try {
            const response = await axios.post(API_URL + 'signin', {
                username,
                password
            });

            // Handle JWT response
            if (response.data && response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem('user');
    }

    async register(username, email, password) {
        try {
            const response = await axios.post(API_URL + 'signup', {
                username,
                email,
                password
                // No role field - backend will assign default role
            });
            return response.data;
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    isLoggedIn() {
        const user = this.getCurrentUser();
        return !!user;
    }
}

export default new AuthService(); 