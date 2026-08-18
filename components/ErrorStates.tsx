import { AlertTriangle, WifiOff } from 'lucide-react'

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 bg-red-900/20 border border-red-800 text-red-300 rounded-xl p-4 my-4">
      <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  )
}

export function DatabaseError() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="bg-red-900/20 rounded-full p-4">
        <WifiOff className="h-8 w-8 text-red-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Database Unreachable</h3>
        <p className="text-slate-400 text-sm max-w-sm">
          Could not connect to CognoDB. Check that your <code className="bg-slate-800 px-1 rounded">COGNODB_URI</code>,{' '}
          <code className="bg-slate-800 px-1 rounded">COGNODB_USER</code> and{' '}
          <code className="bg-slate-800 px-1 rounded">COGNODB_PASSWORD</code> environment variables are set correctly.
        </p>
      </div>
    </div>
  )
}

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-2 text-center">
      <div className="text-4xl mb-2">🔍</div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {body && <p className="text-slate-400 text-sm max-w-sm">{body}</p>}
    </div>
  )
}
