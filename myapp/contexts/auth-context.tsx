"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  followers: number
  following: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<Pick<User, "username" | "bio" | "avatar">>) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("social-media-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication - in real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email && password) {
      const mockUser: User = {
        id: "1",
        username: email.split("@")[0],
        email,
        avatar: `/placeholder.svg?height=40&width=40&query=user avatar`,
        bio: "Welcome to the social platform!",
        followers: 42,
        following: 28,
      }

      setUser(mockUser)
      localStorage.setItem("social-media-user", JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock signup - in real app, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username && email && password) {
      const mockUser: User = {
        id: Date.now().toString(),
        username,
        email,
        avatar: `/placeholder.svg?height=40&width=40&query=user avatar`,
        bio: "New to the platform!",
        followers: 0,
        following: 0,
      }

      setUser(mockUser)
      localStorage.setItem("social-media-user", JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("social-media-user")
  }

  const updateProfile = async (updates: Partial<Pick<User, "username" | "bio" | "avatar">>): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    // Mock API call - in real app, this would update the backend
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("social-media-user", JSON.stringify(updatedUser))

    setIsLoading(false)
    return true
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
