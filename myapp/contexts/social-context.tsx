"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

export interface UserProfile {
  id: string
  username: string
  email: string
  avatar: string
  bio: string
  followers: number
  following: number
  isFollowing: boolean
}

interface SocialContextType {
  users: UserProfile[]
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  getFollowingUsers: () => UserProfile[]
  isLoading: boolean
}

const SocialContext = createContext<SocialContextType | undefined>(undefined)

const mockUsers: UserProfile[] = [
  {
    id: "user-2",
    username: "sarah_dev",
    email: "sarah@example.com",
    avatar: `/placeholder.svg?height=60&width=60&query=woman developer avatar`,
    bio: "Full-stack developer passionate about React and Node.js. Building the future one component at a time! 🚀",
    followers: 1247,
    following: 892,
    isFollowing: false,
  },
  {
    id: "user-3",
    username: "alex_designer",
    email: "alex@example.com",
    avatar: `/placeholder.svg?height=60&width=60&query=designer avatar`,
    bio: "UI/UX Designer crafting beautiful and intuitive digital experiences. Design is not just what it looks like - it's how it works.",
    followers: 2156,
    following: 543,
    isFollowing: true,
  },
  {
    id: "user-4",
    username: "mike_startup",
    email: "mike@example.com",
    avatar: `/placeholder.svg?height=60&width=60&query=entrepreneur avatar`,
    bio: "Entrepreneur and startup enthusiast. Currently building the next big thing in fintech. Always learning, always growing! 💡",
    followers: 987,
    following: 1234,
    isFollowing: false,
  },
  {
    id: "user-5",
    username: "emma_tech",
    email: "emma@example.com",
    avatar: `/placeholder.svg?height=60&width=60&query=tech woman avatar`,
    bio: "Tech lead and mentor. Helping developers level up their skills. Believer in clean code and continuous learning. 💪",
    followers: 3421,
    following: 678,
    isFollowing: true,
  },
  {
    id: "user-6",
    username: "david_ai",
    email: "david@example.com",
    avatar: `/placeholder.svg?height=60&width=60&query=ai researcher avatar`,
    bio: "AI researcher exploring the intersection of machine learning and human creativity. The future is intelligent! 🤖",
    followers: 1876,
    following: 432,
    isFollowing: false,
  },
]

export function SocialProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(mockUsers)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Load following data from localStorage
    const storedFollowing = localStorage.getItem("social-media-following")
    if (storedFollowing) {
      const followingIds = JSON.parse(storedFollowing)
      setUsers((prevUsers) =>
        prevUsers.map((u) => ({
          ...u,
          isFollowing: followingIds.includes(u.id),
        })),
      )
    }
  }, [])

  const saveFollowing = (followingIds: string[]) => {
    localStorage.setItem("social-media-following", JSON.stringify(followingIds))
  }

  const followUser = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            isFollowing: true,
            followers: u.followers + 1,
          }
        }
        return u
      }),
    )

    const followingIds = users.filter((u) => u.isFollowing || u.id === userId).map((u) => u.id)
    saveFollowing(followingIds)
  }

  const unfollowUser = (userId: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            isFollowing: false,
            followers: Math.max(0, u.followers - 1),
          }
        }
        return u
      }),
    )

    const followingIds = users.filter((u) => u.isFollowing && u.id !== userId).map((u) => u.id)
    saveFollowing(followingIds)
  }

  const getFollowingUsers = () => {
    return users.filter((u) => u.isFollowing)
  }

  return (
    <SocialContext.Provider value={{ users, followUser, unfollowUser, getFollowingUsers, isLoading }}>
      {children}
    </SocialContext.Provider>
  )
}

export function useSocial() {
  const context = useContext(SocialContext)
  if (context === undefined) {
    throw new Error("useSocial must be used within a SocialProvider")
  }
  return context
}
