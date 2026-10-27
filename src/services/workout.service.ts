import type {
  IAddWorkoutExercisePayload,
  IWorkoutExerciseResponse,
  IWorkoutResponse,
} from '~/lib/interfaces/workout'
import ApiService from './api.service'

class WorkoutService {
  async getWorkouts() {
    return ApiService.get<IWorkoutResponse[]>('/workout/')
  }

  async deleteWorkout(workoutId: string) {
    return ApiService.delete(`/workout/${workoutId}`)
  }

  async deleteExercise(workoutId: string, exerciseId: string) {
    return ApiService.delete(`/workout/${workoutId}/exercises/${exerciseId}`)
  }

  async addExercise(workoutId: string, payload: IAddWorkoutExercisePayload) {
    return ApiService.post<IWorkoutExerciseResponse>(
      `/workout/${workoutId}/exercises`,
      payload,
    )
  }
}

const workoutService = new WorkoutService()
export default workoutService
