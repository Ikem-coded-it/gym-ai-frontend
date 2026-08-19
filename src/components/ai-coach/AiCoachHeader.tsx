export default function AiCoachHeader() {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div className="size-10" aria-hidden="true" />
      <h1 className="font-heading text-xl text-black">Today&apos;s Session</h1>
      <button
        type="button"
        className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
      >
        Edit
      </button>
    </header>
  )
}
