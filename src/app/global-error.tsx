"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 flex items-center justify-center">
          <div className="text-center max-w-2xl mx-auto px-4">
            <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-6">
              😔
            </div>

            <div className="bg-gradient-to-r from-red-600/20 to-red-700/20 backdrop-blur-sm rounded-2xl p-8 border border-red-400/30 mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Something went wrong!</h1>
              <p className="text-xl text-red-200 mb-4">
                We encountered an unexpected error during our Eid celebration.
              </p>
              <p className="text-lg text-white/80 mb-6">
                Don't worry, Allah tests us with challenges to make us stronger.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={reset}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  🔄 Try Again
                </button>

                <button
                  onClick={() => (window.location.href = "/")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  🏠 Go Home
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg text-red-200 mb-2">"And Allah is with the patient ones"</p>
              <p className="text-xl text-white font-semibold">Eid Mubarak! 🌙✨</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
