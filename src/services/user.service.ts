import ApiService from './api.service'

class UserService {
  async deleteAccount(userId: string) {
    return ApiService.delete(`/user/${userId}`)
  }
}

const userService = new UserService()
export default userService
