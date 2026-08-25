import { ISignupPayload, ISignupResponse, ILoginPayload, ILoginResponse, IForgotPasswordPayload, IUpdateProfilePayload, IVerifyEmailPayload } from '../lib/interfaces/auth';
import ApiService from './api.service';

function usernameFromSignup(payload: ISignupPayload): string {
    const localPart = payload.email.split('@')[0] ?? '';
    const fromEmail = localPart.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
    if (fromEmail.length >= 3) {
        return fromEmail.toLowerCase();
    }

    const fromName = `${payload.firstName}${payload.lastName}`
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 20);
    const fallback = (fromName || fromEmail || 'user').padEnd(3, '0');
    return fallback.slice(0, 20).toLowerCase();
}

class AuthService {
    async getMe() {
        return ApiService.get('/auth/me');
    }

    async updateProfile(payload: IUpdateProfilePayload) {
        return ApiService.put<{ user: unknown }>('/auth/profile', payload);
    }

    async signup(payload: ISignupPayload) {
        return ApiService.post<ISignupResponse>('/auth/signup', {
            username: usernameFromSignup(payload),
            email: payload.email,
            first_name: payload.firstName,
            last_name: payload.lastName,
            password: payload.password,
        });
    }

    async login(payload: ILoginPayload) {
        return ApiService.postUrlEncoded<ILoginResponse>('/auth/login', {
            username: payload.email,
            password: payload.password,
        });
    }

    async verifyEmail(payload: IVerifyEmailPayload) {
        return ApiService.post('/auth/verify-email', payload);
    }

    async resendVerificationEmail(payload: {email: string}) {
        return ApiService.post('/auth/resend-verification-email', payload);
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