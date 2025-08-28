"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface User {
  _id: string
  username: string
  email: string
  avatar?: string
  bio?: string
  followers?: number
  following?: number
  is_active: boolean
  createdAt: Date
  updatedAt: Date
  isFollowing?: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<Pick<User, "username" | "bio" | "avatar">>) => Promise<boolean>
  isLoading: boolean
  checkValidUsername: (username: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      setIsLoading(true)
      try {
        await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        })

        const res = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        })

        if (!res.ok) throw new Error("Failed to fetch user")

        const userJson = await res.json()
        const userData: User = userJson.user

        if (isMounted) setUser(userData)
      } catch (error) {
        if (isMounted) setUser(null)
        console.error("Auth check failed:", error)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const resLogin = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (resLogin.status === 205) {
        return false
      }

      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to fetch user after login")

      const userJson = await res.json()
      const userData: User = userJson.user
      setUser(userData)
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const resSignup = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      if (!resSignup.ok) throw new Error("Signup failed")

      // Fetch user after successful signup
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to fetch user after signup")

      const userData: User = await res.json()
      setUser(userData)

      return true
    } catch (error) {
      console.error("Signup error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.warn("Logout API failed", error)
    } finally {
      setUser(null)
    }
  }

  const updateProfile = async (
    updates: Partial<Pick<User, "username" | "bio" | "avatar">>
  ): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    try {
      // Simulate API delay (replace with actual update API call in real app)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)

      return true
    } catch (error) {
      console.error("Update profile failed:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const checkValidUsername = async (username: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/auth/username/${username}`, {
        method: "GET",
        credentials: "include",
      })

      if (res.ok) return true
      if (res.status === 409) return false

      throw new Error("Unexpected response while checking username")
    } catch (error) {
      console.error("checkValidUsername error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, updateProfile, isLoading, checkValidUsername }}
    >
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
