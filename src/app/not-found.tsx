import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white font-mono p-4">
      <div className="max-w-lg w-full">
        <div className="border border-green-800 rounded-lg overflow-hidden">
          {/* Title bar */}
          <div className="bg-gray-900 px-4 py-2 flex items-center gap-2 border-b border-green-800">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            <span className="text-neutral-400 text-xs ml-2">daroh@terminal: ~</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 space-y-3 text-sm">
            <div>
              <span className="text-green-400">┌─(</span>
              <span className="text-indigo-500 font-bold">daroh@terminal</span>
              <span className="text-green-400">)-[~]</span>
            </div>
            <div>
              <span className="text-green-400">└─</span>
              <span className="text-indigo-500">$</span>
              <span className="text-green-400"> cat /this/page</span>
            </div>
            <div className="pt-2">
              <span className="text-red-400 font-bold text-lg">404</span>
              <span className="text-red-400"> — Page not found</span>
            </div>
            <div className="text-neutral-500 text-xs leading-relaxed">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </div>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors border border-green-700 hover:border-green-500 px-4 py-2 rounded"
              >
                <span>←</span>
                <span>cd ~</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
