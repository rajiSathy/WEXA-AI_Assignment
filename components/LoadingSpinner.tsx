export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-brand-800" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-500 animate-spin" />
      </div>
      <p className="text-slate-400 text-sm animate-pulse">{text}</p>
    </div>
  )
}

export function InlineSpinner() {
  return (
    <span className="inline-block h-4 w-4 rounded-full border-2 border-transparent border-t-white animate-spin" />
  )
}
