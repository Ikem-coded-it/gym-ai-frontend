import type { IWorkoutResponse } from '~/lib/interfaces/workout'
import ApiService from './api.service'

class WorkoutService {
  async getWorkouts() {
    return ApiService.get<IWorkoutResponse[]>('/workout/')
  }
}

const workoutService = new WorkoutService()
export default workoutService
