"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AuthScreen } from "@/components/auth/auth-screen"
import { ProfilePage } from "@/components/profile/profile-page"
import { PostsFeed } from "@/components/posts/posts-feed"
import { DiscoverPage } from "@/components/social/discover-page"
import { Button } from "@/components/ui/button"
import { User, Home, LogOut, Compass } from "lucide-react"
import { FILE_URL } from "./file"

type View = "home" | "profile" | "discover"

export default function HomePage() {
  const { user, logout, isLoading } = useAuth()
  const [currentView, setCurrentView] = useState<View>("home")

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">SocialConnect</h1>

          <nav className="flex items-center gap-2">
            <Button
              variant={currentView === "home" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("home")}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              variant={currentView === "discover" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("discover")}
            >
              <Compass className="w-4 h-4 mr-2" />
              Discover
            </Button>
            <Button
              variant={currentView === "profile" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("profile")}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={user.avatar ? `${FILE_URL}/files/${user.avatar}` : "/placeholder-user.jpg"} alt={user.username} className="w-8 h-8 rounded-full" crossOrigin="anonymous" />
              <span className="font-medium">@{user.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main>
        {currentView === "home" && (
          <div className="container mx-auto px-4 py-8 max-w-2xl">
            <PostsFeed />
          </div>
        )}

        {currentView === "discover" && <DiscoverPage />}

        {currentView === "profile" && <ProfilePage />}
      </main>
    </div>
  )
}
