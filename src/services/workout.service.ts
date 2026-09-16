import type { IWorkoutResponse } from '~/lib/interfaces/workout'
import ApiService from './api.service'

class WorkoutService {
  async getWorkouts() {
    return ApiService.get<IWorkoutResponse[]>('/workout/')
  }

  async deleteWorkout(workoutId: string) {
    return ApiService.delete(`/workout/${workoutId}`)
  }
}

const workoutService = new WorkoutService()
export default workoutService
