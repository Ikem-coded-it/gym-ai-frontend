'use client'

import { Export, X } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '~/components/ui/button'

/** Chrome/Edge/Android event that lets a page offer the "install app" prompt. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'gymai_install_prompt_dismissed'

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function readDismissed() {
  try {
    return sessionStorage.getItem(DISMISSED_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Pops up when the site is opened in a browser to offer saving the app to the
 * home screen. Not shown once installed (opened as an app). "Not now" hides it for
 * the rest of the browser session; it returns the next time the site is opened.
 */
export default function InstallAppPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [showIosHelp, setShowIosHelp] = useState(false)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    // The service worker is what makes the app installable.
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    if (isStandalone()) return
    setDismissed(readDismissed())

    // Safari on iOS has no install event: it can only be added by hand.
    if (isIos()) setShowIosHelp(true)

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
    }
    const handleInstalled = () => {
      setInstallEvent(null)
      setShowIosHelp(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  const dismiss = () => {
    setDismissed(true)
    try {
      sessionStorage.setItem(DISMISSED_KEY, '1')
    } catch {
      // Private mode: it just comes back on the next open.
    }
  }

  const install = async () => {
    if (!installEvent) return
    await installEvent.prompt()
    const { outcome } = await installEvent.userChoice
    // The event can only be used once.
    setInstallEvent(null)
    if (outcome === 'dismissed') dismiss()
  }

  const canOffer = installEvent !== null || showIosHelp
  if (dismissed || !canOffer || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close install prompt"
        className="absolute inset-0 animate-in bg-foreground/40 backdrop-blur-[2px] fade-in-0 duration-150"
        onClick={dismiss}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-app-title"
        className="relative z-10 w-full max-w-md animate-in rounded-t-3xl bg-card p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-float duration-200 fade-in-0 slide-in-from-bottom-8 sm:rounded-3xl sm:pb-6 sm:zoom-in-95 sm:slide-in-from-bottom-0"
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>

        <img
          src="/android-chrome-192x192.png"
          alt=""
          className="size-16 rounded-2xl shadow-card"
        />

        <h2
          id="install-app-title"
          className="mt-4 text-lg font-semibold text-foreground"
        >
          Install GymAI
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add GymAI to your home screen for quick access and a full-screen
          experience, like a regular app.
        </p>

        {installEvent ? (
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={dismiss}
              className="sm:min-w-28"
            >
              Not now
            </Button>
            <Button type="button" onClick={install} className="sm:min-w-28">
              Install
            </Button>
          </div>
        ) : (
          <>
            <p className="mt-4 flex flex-wrap items-center gap-1.5 rounded-2xl bg-muted px-4 py-3 text-sm text-foreground">
              Tap
              <Export weight="bold" className="size-4 text-primary" />
              <strong>Share</strong>, then <strong>Add to Home Screen</strong>.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={dismiss}
              className="mt-4 w-full"
            >
              Got it
            </Button>
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
