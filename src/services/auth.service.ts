import { ISignupPayload, ILoginPayload, IForgotPasswordPayload, IUpdateProfilePayload, IVerifyEmailPayload } from '../lib/interfaces/auth';
import ApiService from './api.service';

class AuthService {
    async getMe() {
        return ApiService.get('/auth/me');
    }

    async updateProfile(payload: IUpdateProfilePayload) {
        return ApiService.put<{ user: unknown }>('/auth/profile', payload);
    }

    async signup(payload: ISignupPayload) {
        return ApiService.post<{ type: string; token: string; user: unknown }>('/auth/register/vendor', payload);
    }

    async verifyEmail(payload: IVerifyEmailPayload) {
        return ApiService.post('/auth/verify-email', payload);
    }

    async resendVerificationEmail(payload: {email: string}) {
        return ApiService.post('/auth/resend-verification-email', payload);
    }

    async login(payload: ILoginPayload) {
        return ApiService.post('/auth/login', payload);
    }

    async forgotPassword(payload: IForgotPasswordPayload) {
        return ApiService.post<unknown>('/auth/forgot-password', payload);
    }

    async logout() {
        return ApiService.post('/auth/logout', {});
    }
}

const authService = new AuthService();
export default authService;