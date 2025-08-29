"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import type { User } from "./auth-context"

interface SocialContextType {
  users: User[]
  followUser: (userId: string) => void
  unfollowUser: (userId: string) => void
  getFollowingUsers: () => User[]
  isLoading: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

const SocialContext = createContext<SocialContextType | undefined>(undefined)

export function SocialProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Load following data from API
    const fetchFollowing = async () => {
      try {
        const response = await fetch(`${API_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        })
        const result = await response.json();
        const res = await fetch(`${API_URL}/follow/following`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include"
        });
        const followingData = await res.json();
        if (result.users)
          setUsers(() => {
            return result.users
              .filter((u: User) => u._id !== user?._id) // Remove the logged-in user
              .map((u: User) => ({
              ...u,
              isFollowing: followingData.following.some((f: any) => f.following._id === u._id),
            }));
        });

      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchFollowing()
  }, [user])

  const saveFollowing = async (followingIds: string) => {
    try {
      const response = await fetch(`${API_URL}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ following: followingIds })
      });
    } catch (error) {
      console.error("Error saving following:", error);
    }
  }

  const followUser = (userId: string) => {
    saveFollowing(userId);
    window.location.reload();
  };


  const unfollowUser = async (userId: string) => {
    try {
      const response = await fetch(`${API_URL}/follow/unfollow`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ following: userId })
      });
      window.location.reload();
    } catch (error) {
      console.error("Error saving following:", error);
    }
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
