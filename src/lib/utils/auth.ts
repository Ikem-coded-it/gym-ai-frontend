import type { IMeResponse, IUser } from '~/lib/interfaces/auth'

export function mapMeToUser(me: IMeResponse): IUser {
  return {
    id: me.id,
    email: me.email,
    firstName: me.first_name,
    lastName: me.last_name,
    hasOnboarded: me.has_onboarded,
    createdAt: me.created_at,
    updatedAt: me.updated_at,
  }
}
