import type {
  IAddExerciseSetPayload,
  IAddWorkoutExercisePayload,
  IExerciseSetResponse,
  IUpdateExerciseSetPayload,
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

  async addSet(
    workoutId: string,
    exerciseId: string,
    payload: IAddExerciseSetPayload,
  ) {
    return ApiService.post<IExerciseSetResponse>(
      `/workout/${workoutId}/exercises/${exerciseId}/sets`,
      payload,
    )
  }

  async updateSet(
    workoutId: string,
    exerciseId: string,
    setId: string,
    payload: IUpdateExerciseSetPayload,
  ) {
    return ApiService.patch<IExerciseSetResponse>(
      `/workout/${workoutId}/exercises/${exerciseId}/sets/${setId}`,
      payload,
    )
  }

  async deleteSet(workoutId: string, exerciseId: string, setId: string) {
    return ApiService.delete(
      `/workout/${workoutId}/exercises/${exerciseId}/sets/${setId}`,
    )
  }
}

const workoutService = new WorkoutService()
export default workoutService
