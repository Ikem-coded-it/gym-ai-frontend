import ApiService from './api.service';
import type {
    IGenerateRoutinePayload,
    IGenerateRoutineResponse,
    OnboardingPayload,
} from '../lib/interfaces/onboarding';

class OnboardingService {
    async createOnboarding(payload: OnboardingPayload) {
        return ApiService.post(`/onboarding/workouts`, payload);
    }

    async generateRoutine(payload: IGenerateRoutinePayload) {
        return ApiService.post<IGenerateRoutineResponse>(
            `/onboarding/generate-routine`,
            payload,
        );
    }
}

const onboardingService = new OnboardingService();
export default onboardingService;
