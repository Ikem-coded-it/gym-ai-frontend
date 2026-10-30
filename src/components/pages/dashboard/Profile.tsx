import { SignOut, Trash } from '@phosphor-icons/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import DeleteWorkoutConfirmDialog from '~/components/dashboard/DeleteWorkoutConfirmDialog'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Spinner } from '~/components/ui/spinner'
import ApplicationRoutes from '~/config/routes'
import { queryClient } from '~/lib/query-client'
import authService from '~/services/auth.service'
import userService from '~/services/user.service'
import { clearAuthState } from '~/utils/auth'

function formatMemberSince(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="min-w-0 truncate text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  // Same query the app's AuthProvider uses, so this is normally already cached.
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe(),
  })

  const deleteAccountMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteAccount(userId),
    onSuccess: () => {
      setIsDeleteOpen(false)
      clearAuthState()
      queryClient.clear()
      toast.success('Your account has been deleted')
      navigate({ to: ApplicationRoutes.HOME, replace: true })
    },
    onError: (deleteError: Error) => {
      toast.error(deleteError.message)
    },
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="size-6 text-primary" />
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="mx-auto w-full max-w-md px-6 py-6">
        <p
          className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {error instanceof Error ? error.message : 'Failed to load your profile'}
        </p>
      </div>
    )
  }

  const fullName = `${user.first_name} ${user.last_name}`.trim()
  const initials =
    `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()

  return (
    <div className="mx-auto w-full max-w-md px-6 py-6">
      <h1 className="font-heading text-3xl text-foreground">Profile</h1>

      <div className="mt-6 flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-card"
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-foreground">
            {fullName}
          </p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Account
        </h2>
        <Card className="mt-3 py-0">
          <CardContent className="divide-y divide-border/70 px-0">
            <InfoRow label="Username" value={user.username} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow
              label="Member since"
              value={formatMemberSince(user.created_at)}
            />
          </CardContent>
        </Card>
      </section>

      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => navigate({ to: ApplicationRoutes.AUTH.LOGOUT })}
        className="mt-6 w-full text-sm"
      >
        <SignOut weight="bold" className="size-4" />
        Log out
      </Button>

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-destructive">
          Danger zone
        </h2>
        <div className="mt-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm font-medium text-foreground">Delete account</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Permanently removes your account, workouts and chat history. This
            cannot be undone.
          </p>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            onClick={() => setIsDeleteOpen(true)}
            className="mt-4 w-full text-sm"
          >
            <Trash weight="bold" className="size-4" />
            Delete account
          </Button>
        </div>
      </section>

      <DeleteWorkoutConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete account"
        confirmLabel="Delete account"
        description="This permanently deletes your account, all of your workouts and your chat history. This cannot be undone."
        isPending={deleteAccountMutation.isPending}
        onConfirm={() => deleteAccountMutation.mutate(user.id)}
      />
    </div>
  )
}
