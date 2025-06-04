"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, ArrowLeft, Search, Gift, Heart } from "lucide-react"

export default function NotFound() {
  const [mounted, setMounted] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTimeout(() => setShowAnimation(true), 500)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Twinkling Stars */}
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute animate-twinkle text-yellow-300"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              fontSize: `${0.8 + Math.random() * 0.8}rem`,
            }}
          >
            ✨
          </div>
        ))}

        {/* Floating Crescents */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`crescent-${i}`}
            className="absolute text-yellow-400 animate-float opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
              fontSize: `${1.5 + Math.random() * 1}rem`,
            }}
          >
            🌙
          </div>
        ))}

        {/* Lost Sheep Animation */}
        <div className="absolute bottom-10 left-0 w-full">
          <div className="sheep-lost animate-sheep-lost">🐑</div>
        </div>
      </div>

      {/* Main 404 Content */}
      <div className="text-center relative z-10 max-w-4xl mx-auto px-4">
        {/* 404 Number with Animation */}
        <div
          className={`transition-all duration-1000 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="text-8xl md:text-9xl lg:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-6 animate-bounce">
            404
          </div>
        </div>

        {/* Error Message */}
        <div
          className={`transition-all duration-1000 delay-300 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-8 mx-auto max-w-2xl border border-green-400/30 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Oops! Page Not Found 🐑</h1>
            <p className="text-xl text-yellow-200 mb-4">
              It looks like this page has wandered off like a lost sheep during Eid celebrations!
            </p>
            <p className="text-lg text-white/80">Don't worry, we'll help you find your way back to the festivities.</p>
          </div>
        </div>

        {/* Animated Sheep Message */}
        <div
          className={`transition-all duration-1000 delay-500 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="mb-8">
            <div className="text-6xl mb-4 animate-bounce">🐑</div>
            <p className="text-yellow-300 text-lg italic">"Baa-aa-aa! Even I can't find this page!"</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div
          className={`transition-all duration-1000 delay-700 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link href="/">
              <button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center">
                <Home className="mr-2 h-5 w-5" />
                Back to Eid Home
              </button>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </button>

            <button
              onClick={() => (window.location.href = "/search")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
            >
              <Search className="mr-2 h-5 w-5" />
              Search Site
            </button>
          </div>
        </div>

        {/* Helpful Links */}
        <div
          className={`transition-all duration-1000 delay-900 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="bg-gradient-to-r from-yellow-500/10 to-green-500/10 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30">
            <h3 className="text-xl font-bold text-yellow-300 mb-4">🌟 Popular Eid Destinations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/prayer-times">
                <div className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-all duration-300 cursor-pointer group">
                  <div className="text-2xl mb-2 group-hover:animate-bounce">🕌</div>
                  <p className="text-white font-semibold">Prayer Times</p>
                </div>
              </Link>

              <Link href="/gallery">
                <div className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-all duration-300 cursor-pointer group">
                  <div className="text-2xl mb-2 group-hover:animate-bounce">📸</div>
                  <p className="text-white font-semibold">Photo Gallery</p>
                </div>
              </Link>

              <Link href="/guest-book">
                <div className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-all duration-300 cursor-pointer group">
                  <div className="text-2xl mb-2 group-hover:animate-bounce">📖</div>
                  <p className="text-white font-semibold">Guest Book</p>
                </div>
              </Link>

              <Link href="/blessings">
                <div className="bg-white/10 hover:bg-white/20 p-4 rounded-lg transition-all duration-300 cursor-pointer group">
                  <div className="text-2xl mb-2 group-hover:animate-bounce">💝</div>
                  <p className="text-white font-semibold">Send Blessings</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Eid Message */}
        <div
          className={`transition-all duration-1000 delay-1100 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="mt-8 text-center">
            <p className="text-lg text-yellow-200 mb-2">While you're here, remember:</p>
            <p className="text-xl text-white font-semibold italic">
              "Eid Mubarak! May Allah's blessings be with you always" 🌙✨
            </p>
            <div className="text-3xl mt-4">🐑🕌🎉</div>
          </div>
        </div>

        {/* Fun Interactive Element */}
        <div
          className={`transition-all duration-1000 delay-1300 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="mt-8">
            <button
              onClick={() => {
                // Create a small confetti effect
                const confetti = document.createElement("div")
                confetti.innerHTML = "🎉"
                confetti.style.position = "fixed"
                confetti.style.left = "50%"
                confetti.style.top = "50%"
                confetti.style.fontSize = "2rem"
                confetti.style.zIndex = "9999"
                confetti.style.pointerEvents = "none"
                confetti.style.animation = "confetti-404 2s linear forwards"
                document.body.appendChild(confetti)
                setTimeout(() => confetti.remove(), 2000)
              }}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center mx-auto"
            >
              <Gift className="mr-2 h-4 w-4" />
              Click for Eid Surprise! <Heart className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.3) rotate(180deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(5deg); }
          66% { transform: translateY(-10px) rotate(-5deg); }
        }

        @keyframes sheep-lost {
          0% { transform: translateX(-100px) scaleX(1); }
          25% { transform: translateX(25vw) scaleX(1) translateY(-10px); }
          50% { transform: translateX(50vw) scaleX(-1) translateY(-5px); }
          75% { transform: translateX(75vw) scaleX(-1) translateY(-15px); }
          100% { transform: translateX(calc(100vw + 100px)) scaleX(-1); }
        }

        @keyframes confetti-404 {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(-50%, -200px) scale(2) rotate(360deg); opacity: 0; }
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-sheep-lost {
          animation: sheep-lost 15s linear infinite;
          font-size: 3rem;
          position: absolute;
          bottom: 0;
        }

        .sheep-lost {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
