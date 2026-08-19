const ApplicationRoutes = {
    HOME: '/',
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VERIFY_EMAIL: '/auth/verify-email',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    ONBOARDING: {
        SCHEDULE: '/onboarding/schedule',
        ROUTINE: '/onboarding/routine',
        AI_RESULT: '/onboarding/routine/ai-result',
    },
    DASHBOARD: {
        index: '/dashboard',
        AI_COACH: '/dashboard/ai-coach',
        HISTORY: '/dashboard/history',
        PROFILE: '/dashboard/profile',
        WORKOUT_DETAIL: '/dashboard/workout/$workoutId',
    },
}

export default ApplicationRoutes;