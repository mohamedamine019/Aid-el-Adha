"use client"

import { useState, useEffect, useRef } from "react"
import { Share2, Volume2, VolumeX, Heart, Clock, MapPin, BookOpen, Camera, Music, Gift } from "lucide-react"
import { db, app } from "./firebase" // Make sure to export 'app' from your firebase.js
import { collection, getDocs, addDoc, serverTimestamp, query, orderBy, DocumentData, QueryDocumentSnapshot } from "firebase/firestore"

type GuestMessage = {
  id: string
  name: string
  message: string
  timestamp?: { toDate: () => Date }
}

export default function EidWebsite() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const [showGreeting, setShowGreeting] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [showGuestBook, setShowGuestBook] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [showPrayerTimes, setShowPrayerTimes] = useState(false)
  const [guestMessages, setGuestMessages] = useState<GuestMessage[]>([])
  const [guestMessage, setGuestMessage] = useState("")
  const [guestName, setGuestName] = useState("")

  const audioRef = useRef<HTMLAudioElement>(null)

  const songs = [
    { name: "Peaceful Recitation", src: "/eid-music-2.mp3" },
    { name: "Traditional Eid Nasheed", src: "/arabic.mp4" }, // Change to .mp3 if possible
    { name: "Festive Celebration", src: "/eid-music-3.mp3" },
  ]

  const prayerTimes = [
    { prayer: "Fajr", time: "04:30 AM", icon: "🌅" },
    { prayer: "Dhuhr", time: "12:15 PM", icon: "☀️" },
    { prayer: "Asr", time: "03:45 PM", icon: "🌤️" },
    { prayer: "Maghrib", time: "06:30 PM", icon: "🌅" },
    { prayer: "Isha", time: "08:00 PM", icon: "🌙" },
    { prayer: "Eid Prayer", time: "07:00 AM", icon: "🕌" },
  ]

  const galleryImages = [
    { src: "/placeholder.svg?height=300&width=400", caption: "Families gathering for Eid prayers" },
    { src: "/placeholder.svg?height=300&width=400", caption: "Traditional Eid feast preparation" },
    { src: "/placeholder.svg?height=300&width=400", caption: "Children celebrating with joy" },
    { src: "/placeholder.svg?height=300&width=400", caption: "Beautiful mosque decorations" },
    { src: "/placeholder.svg?height=300&width=400", caption: "Community coming together" },
    { src: "/placeholder.svg?height=300&width=400", caption: "Traditional Eid sweets and treats" },
  ]

  // Mount effect for music
  useEffect(() => {
    setMounted(true)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setMusicPlaying(true)
        }).catch(() => {
          // Autoplay prevented, user must click play
          setMusicPlaying(false)
        })
      }
    }, 1000)
  }, [])

  // Countdown timer
  useEffect(() => {
    const eidDate = new Date("2025-06-06T00:00:00")
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = eidDate.getTime() - now
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch guest messages from Firestore
  useEffect(() => {
    const fetchMessages = async () => {
      const q = query(collection(db, "guestMessages"), orderBy("timestamp", "desc"))
      const querySnapshot = await getDocs(q)
      setGuestMessages(
        querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        })) as GuestMessage[]
      )
    }
    fetchMessages()
  }, [])

  // Initialize Firebase Analytics (client-side only)
  useEffect(() => {
    // Dynamically import analytics only on the client
    const initAnalytics = async () => {
      if (typeof window !== "undefined") {
        const { getAnalytics, isSupported } = await import("firebase/analytics");
        isSupported().then((yes) => {
          if (yes) {
            getAnalytics(app);
          }
        });
      }
    };
    initAnalytics();
  }, []);

  const handleEidMubarakClick = () => {
    setShowConfetti(true)
    setShowGreeting(true)
    setTimeout(() => setShowConfetti(false), 4000)
    setTimeout(() => setShowGreeting(false), 6000)
  }

  const handleSendBlessings = () => {
    const message =
      "🌙 Eid Al-Adha Mubarak! 🐑\n\nMay this blessed day bring joy, peace, and prosperity to you and your loved ones. May Allah accept your prayers and sacrifices.\n\nعيد أضحى مبارك! 🌟✨"
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    if (typeof window !== "undefined") {
      window.open("https://www.instagram.com/amine.mohamed_146?igsh=MWI4cmp5MWp0N3g3eg==" , "_blank")
    }
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {
          console.log("Autoplay prevented by browser")
        })
      }
      setMusicPlaying(!musicPlaying)
    }
  }

  const nextSong = () => {
    const nextIndex = (currentSong + 1) % songs.length
    setCurrentSong(nextIndex)
    if (audioRef.current) {
      audioRef.current.src = songs[nextIndex].src
      if (musicPlaying) {
        audioRef.current.play()
      }
    }
  }

  // Add a new guest message
  const handleAddMessage = async () => {
    if (!guestName || !guestMessage) return
    await addDoc(collection(db, "guestMessages"), {
      name: guestName,
      message: guestMessage,
      timestamp: serverTimestamp(),
    })
    setGuestMessage("")
    setGuestName("")
    // Re-fetch messages after adding
    const q = query(collection(db, "guestMessages"), orderBy("timestamp", "desc"))
    const querySnapshot = await getDocs(q)
    setGuestMessages(
      querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })) as GuestMessage[]
    )
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 relative overflow-hidden">
      {/* Background Audio */}
      <audio ref={audioRef} loop>
        <source src={songs[currentSong].src} type="audio/mp3" />
      </audio>

      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Islamic Geometric Patterns */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full bg-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFD700'%3E%3Cpolygon points='50,0 60,35 100,35 70,57 80,91 50,70 20,91 30,57 0,35 40,35'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "100px 100px",
            }}
          />
        </div>

        {/* Enhanced Twinkling Stars */}
        {[...Array(80)].map((_, i) => (
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
            {["✨", "⭐", "🌟", "💫"][Math.floor(Math.random() * 4)]}
          </div>
        ))}

        {/* More Floating Elements */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`element-${i}`}
            className="absolute animate-float opacity-40 hover:opacity-80 transition-opacity duration-300"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
              fontSize: `${1.5 + Math.random() * 1}rem`,
            }}
          >
            {["🌙", "🕌", "🐑", "🎋", "🌸"][Math.floor(Math.random() * 5)]}
          </div>
        ))}

        {/* Floating Lanterns */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`lantern-${i}`}
            className="absolute animate-float text-yellow-400 opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 2}s`,
              fontSize: "2rem",
            }}
          >
            🏮
          </div>
        ))}
      </div>

      {/* Enhanced Music Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={toggleMusic}
          className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg p-3 rounded-lg transition-all duration-300"
        >
          {musicPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>
        <button
          onClick={nextSong}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg p-3 rounded-lg transition-all duration-300"
        >
          <Music className="h-4 w-4" />
        </button>
      </div>

      {/* Current Song Display */}
      {musicPlaying && (
        <div className="fixed top-16 right-4 z-50 bg-black/50 backdrop-blur-sm rounded-lg p-2 text-white text-sm">
          🎵 {songs[currentSong].name}
        </div>
      )}

      {/* Navigation Menu */}
      <div className="fixed top-4 left-4 z-50 flex flex-wrap gap-2">
        <button
          onClick={() => setShowPrayerTimes(!showPrayerTimes)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg p-2 rounded-lg transition-all duration-300 flex items-center"
        >
          <Clock className="h-4 w-4 mr-1" />
          Prayer Times
        </button>
        <button
          onClick={() => setShowGallery(!showGallery)}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg p-2 rounded-lg transition-all duration-300 flex items-center"
        >
          <Camera className="h-4 w-4 mr-1" />
          Gallery
        </button>
        <button
          onClick={() => setShowGuestBook(!showGuestBook)}
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg p-2 rounded-lg transition-all duration-300 flex items-center"
        >
          <BookOpen className="h-4 w-4 mr-1" />
          Guest Book
        </button>
      </div>

      {/* Prayer Times Modal */}
      {showPrayerTimes && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-blue-900/90 to-blue-800/90 border border-blue-400 p-8 max-w-md w-full backdrop-blur-lg rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-blue-300">🕌 Prayer Times</h3>
              <button
                onClick={() => setShowPrayerTimes(false)}
                className="text-white p-1 rounded-lg transition-all duration-300"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              {prayerTimes.map((prayer, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{prayer.icon}</span>
                    <span className="text-white font-semibold">{prayer.prayer}</span>
                  </div>
                  <span className="text-blue-200 font-bold">{prayer.time}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-blue-200 text-sm">
                <MapPin className="inline h-4 w-4 mr-1" />
                Times may vary by location
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Photo Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-purple-900/90 to-purple-800/90 border border-purple-400 p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto backdrop-blur-lg rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-purple-300">📸 Eid Celebration Gallery</h3>
              <button
                onClick={() => setShowGallery(false)}
                className="text-white p-1 rounded-lg transition-all duration-300"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map((image, index) => (
                <div key={index} className="group">
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={image.src || "/placeholder.svg"}
                      alt={image.caption}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <p className="text-purple-200 text-sm mt-2 text-center">{image.caption}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Guest Book Modal */}
      {showGuestBook && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-pink-900/90 to-pink-800/90 border border-pink-400 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto backdrop-blur-lg rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-pink-300">📖 Eid Guest Book</h3>
              <button
                onClick={() => setShowGuestBook(false)}
                className="text-white p-1 rounded-lg transition-all duration-300"
              >
                ✕
              </button>
            </div>

            {/* Add Message Form */}
            <div className="mb-6 p-4 bg-white/10 rounded-lg">
              <h4 className="text-lg font-semibold text-pink-200 mb-3">Leave your Eid wishes:</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-pink-300/30"
                />
                <textarea
                  placeholder="Your Eid message..."
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-pink-300/30 resize-none"
                />
                <button
                  onClick={handleAddMessage}
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white p-2 rounded-lg transition-all duration-300 flex items-center"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Add Message
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
              {guestMessages.map((msg) => (
                <div key={msg.id} className="p-4 bg-white/10 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-pink-200">{msg.name}</span>
                    <span className="text-pink-300 text-sm">
                      {msg.timestamp && msg.timestamp.toDate
                        ? msg.timestamp.toDate().toLocaleString()
                        : ""}
                    </span>
                  </div>
                  <p className="text-white">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Countdown Timer */}
      <div className="text-center pt-6 pb-4 relative z-10">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl mx-auto max-w-4xl p-6 border border-yellow-400/30">
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-300 mb-6 animate-pulse">
            ⏰ Countdown to Eid Al-Adha ⏰
          </h2>
          <div className="flex justify-center gap-4 flex-wrap">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div
                key={unit}
                className="bg-gradient-to-br from-yellow-500/30 to-green-500/30 border border-yellow-400 p-4 backdrop-blur-sm hover:scale-105 transition-transform duration-300 rounded-xl"
              >
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white">{value}</div>
                  <div className="text-yellow-200 capitalize font-semibold">{unit}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 md:px-8 py-6 md:py-8 text-center relative z-10">
        {/* Enhanced Hero Section */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 mb-4 md:mb-6 animate-bounce drop-shadow-2xl">
            Eid Al-Adha Mubarak
          </h1>
          <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-4 md:p-6 mx-auto max-w-xl md:max-w-2xl border border-green-400/30 mb-6 md:mb-8">
            <p className="text-base sm:text-xl md:text-2xl text-white mb-2 md:mb-4 leading-relaxed">
              🌟 Welcome to our magical celebration! 🌟
            </p>
            <div className="text-base sm:text-lg md:text-xl text-yellow-200 font-semibold">
              Presented by{" "}
              <span className="text-yellow-400 hover:text-yellow-300 transition-colors duration-300 cursor-default">
                Haicheur Mohamed Amine
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced Animated Sheep */}
        <div className="relative mb-12">
          <div className="sheep-container">
            <div className="sheep animate-sheep-walk hover:animate-sheep-jump">🐑</div>
            <div className="sheep-2 animate-sheep-walk-reverse">🐏</div>
          </div>
          <p className="text-yellow-200 mt-4 text-lg">Watch our happy sheep celebrate! 🎉</p>
        </div>

        {/* Main Action Buttons */}
        <div className="space-y-6 mb-12">
          <button
            onClick={handleEidMubarakClick}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold text-2xl md:text-3xl px-12 py-8 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-glow"
          >
            🌙 Eid Mubarak 🌙
          </button>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleSendBlessings}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg md:text-xl px-10 py-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
            >
              <Share2 className="mr-3 h-6 w-6" />
              Send Blessings <Heart className="ml-3 h-6 w-6" />
            </button>

            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.open("https://amine-web-site.web.app", "_blank")
                }
              }}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold text-lg px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
            >
              <Gift className="mr-2 h-5 w-5" />
              Eid Gifts
            </button>
          </div>
        </div>

        {/* Enhanced Arabic Calligraphy Greeting */}
        {showGreeting && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-black/70 backdrop-blur-lg rounded-3xl p-8 md:p-12 animate-fade-in border-2 border-yellow-400/50 shadow-2xl">
              <div className="text-6xl md:text-9xl text-yellow-400 font-bold mb-6 animate-pulse hover:scale-110 transition-transform duration-300">
                عيد أضحى مبارك
              </div>
              <div className="text-3xl md:text-4xl text-white mb-4">Eid Al-Adha Mubarak!</div>
              <div className="text-lg md:text-xl text-yellow-200 max-w-2xl mb-4">
                May Allah accept your prayers and sacrifices, and bless you with happiness, peace, and prosperity
              </div>
              <div className="text-4xl mt-4">🐑🌙✨🕌🎉</div>
            </div>
          </div>
        )}

        {/* Enhanced Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {[...Array(200)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  color: ["#FFD700", "#32CD32", "#FFFFFF", "#FFA500", "#FF69B4"][Math.floor(Math.random() * 5)],
                  fontSize: `${1 + Math.random() * 1.5}rem`,
                }}
              >
                {["🎉", "✨", "🌟", "💫", "🎊", "🌙", "🐑", "💝", "🕌", "🏮"][Math.floor(Math.random() * 10)]}
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Feature Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-400 p-8 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-300 group rounded-xl">
            <div className="text-5xl mb-6 group-hover:animate-bounce">🕌</div>
            <h3 className="text-xl font-bold text-yellow-300 mb-4 group-hover:text-yellow-200 transition-colors">
              Prayer & Reflection
            </h3>
            <p className="text-white/90">Sacred time for spiritual connection and gratitude</p>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-400 p-8 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-300 group rounded-xl">
            <div className="text-5xl mb-6 group-hover:animate-bounce">🤝</div>
            <h3 className="text-xl font-bold text-green-300 mb-4 group-hover:text-green-200 transition-colors">
              Unity & Sharing
            </h3>
            <p className="text-white/90">Bringing families and communities together</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-400 p-8 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-300 group rounded-xl">
            <div className="text-5xl mb-6 group-hover:animate-bounce">🎋</div>
            <h3 className="text-xl font-bold text-blue-300 mb-4 group-hover:text-blue-200 transition-colors">
              Tradition & Heritage
            </h3>
            <p className="text-white/90">Honoring our beautiful Islamic traditions</p>
          </div>

          <div className="bg-gradient-to-br from-white/20 to-gray-200/20 border border-white p-8 backdrop-blur-sm hover:scale-105 hover:shadow-2xl transition-all duration-300 group rounded-xl">
            <div className="text-5xl mb-6 group-hover:animate-bounce">💝</div>
            <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gray-200 transition-colors">
              Generosity & Love
            </h3>
            <p className="text-white/90">Sharing blessings with those in need</p>
          </div>
        </div>

        {/* Enhanced Footer Message */}
        <div className="mt-16 bg-gradient-to-r from-yellow-500/10 to-green-500/10 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30">
          <p className="text-xl text-yellow-200 mb-4">
            May this Eid Al-Adha bring you closer to your loved ones and fill your heart with joy! 🌟
          </p>
          <p className="text-lg text-white/80 mb-4">
            "And whoever honors the symbols of Allah - indeed, it is from the piety of hearts." - Quran 22:32 <br />
            "ومن يعظم شعائر الله فإنها من تقوى القلوب"
          </p>
          <p className="text-lg text-white/80">Created with ❤️ by Haicheur Mohamed Amine</p>
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

        @keyframes sheep-walk {
          0% { transform: translateX(-150px) scaleX(1); }
          25% { transform: translateX(-75px) scaleX(1) translateY(-15px); }
          50% { transform: translateX(0px) scaleX(-1); }
          75% { transform: translateX(75px) scaleX(-1) translateY(-15px); }
          100% { transform: translateX(150px) scaleX(-1); }
        }

        @keyframes sheep-walk-reverse {
          0% { transform: translateX(150px) scaleX(-1); }
          25% { transform: translateX(75px) scaleX(-1) translateY(-10px); }
          50% { transform: translateX(0px) scaleX(1); }
          75% { transform: translateX(-75px) scaleX(1) translateY(-10px); }
          100% { transform: translateX(-150px) scaleX(1); }
        }

        @keyframes sheep-jump {
          0%, 100% { transform: translateY(0px) scaleX(1); }
          50% { transform: translateY(-30px) scaleX(1.1); }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 30px rgba(255, 215, 0, 0.6); }
          50% { box-shadow: 0 0 50px rgba(255, 215, 0, 0.9); }
        }

        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: scale(0.8) rotate(-5deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-sheep-walk {
          animation: sheep-walk 12s linear infinite;
          font-size: 4rem;
          display: inline-block;
        }

        .animate-sheep-walk-reverse {
          animation: sheep-walk-reverse 15s linear infinite;
          font-size: 3.5rem;
          display: inline-block;
        }

        .animate-sheep-jump {
          animation: sheep-jump 1s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-confetti {
          animation: confetti 4s linear forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .sheep-container {
          height: 120px;
          overflow: hidden;
          position: relative;
          width: 100%;
        }

        .sheep {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          cursor: pointer;
        }

        .sheep-2 {
          position: absolute;
          top: 70%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          cursor: pointer;
          animation-delay: 3s;
        }
      `}</style>
    </div>
  )
}
