import ApiService from './api.service';
import { OnboardingPayload } from '../lib/interfaces/onboarding';

class OnboardingService {
    async createOnboarding(payload: OnboardingPayload) {
        return ApiService.post(`/onboarding/workouts`, payload);
    }
}

const onboardingService = new OnboardingService();
export default onboardingService;