"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

export interface Comment {
  _id: string
  postId: string
  userId: string
  username: string
  userAvatar: string
  content: string
  createdAt: Date
}
export interface Like {
  _id: string
  userId: string
  createdAt: Date
}
export interface Post {
  _id?: string
  userId: string
  username?: string
  userAvatar?: string
  content: string
  image?: string
  createdAt?: Date
  likes: Like[]
  comments: Comment[]
  isLiked?: boolean
}

interface PostsContextType {
  posts: Post[]
  createPost: (content: string, image?: string) => Promise<boolean>
  deletePost: (postId: string) => Promise<boolean>
  likePost: (postId: string) => void
  addComment: (postId: string, content: string) => Promise<boolean>
  deleteComment: (postId: string, commentId: string) => Promise<boolean>
  isLoading: boolean
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    // Load posts from API on mount
    const fetchPosts = async () => {
      const response = await fetch(`${API_URL}/posts`, {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      console.log(data);
      let userPosts: Post[] = [];

      if (data) {
        userPosts = data.map((post: any) => ({
          ...post,
        createdAt: new Date(post.createdAt),
        username: post.userId.username,
        userAvatar: post.userId.avatar || `/placeholder-user.jpg?height=32&width=32&query=user avatar`,
        comments:
          post.comments?.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
          })) || [],
      }))
    }

    const allPosts = [...userPosts].sort(
      (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
    )
    setPosts(allPosts)
    }

    fetchPosts()
  }, [])

  const savePosts = async (newPosts: Post) => {
    console.log(newPosts);

    const response = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newPosts),
    })
    const userPosts = await response.json()
    setPosts([userPosts, ...posts])
  }

  const createPost = async (content: string, image?: string): Promise<boolean> => {
    if (!user || !content.trim()) return false

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newPost: Post = {
      userId: user._id,
      content: content.trim(),
      image,
      likes: [],
      comments: [],
    }
    savePosts(newPost)

    setIsLoading(false)
    return true
  }

  const deletePost = async (postId: string): Promise<boolean> => {
    if (!user || postId.startsWith("mock-")) return false

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedPosts = posts.filter((post) => !(post._id === postId && post.userId === user._id ))
    setPosts(updatedPosts)

    setIsLoading(false)
    return true
  }

  const likePost = (postId: string) => {
    const updatedPosts = posts.map((post) => {
      if (post._id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked
            ? post.likes.slice(0, post.likes.length - 1)
            : [...post.likes, { _id: `${user?._id}-${postId}`, userId: user?._id ?? '', createdAt: new Date() }],
        }
      }
      return post
    })
    setPosts(updatedPosts)

    const userPosts = updatedPosts.filter((post) => !(post._id && post._id.startsWith("mock-")))
    if (userPosts.length > 0) {
      localStorage.setItem("social-media-posts", JSON.stringify(userPosts))
    }
  }

  const addComment = async (postId: string, content: string): Promise<boolean> => {
    if (!user || !content.trim()) return false

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newComment: Comment = {
      _id: `comment-${Date.now()}`,
      postId,
      userId: user._id,
      username: user.username,
      userAvatar: user.avatar || `/placeholder.svg?height=32&width=32&query=user avatar`,
      content: content.trim(),
      createdAt: new Date(),
    }

    const updatedPosts = posts.map((post) => {
      if (post._id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment],
        }
      }
      return post
    })

    setPosts(updatedPosts)
    const userPosts = updatedPosts.filter((post) => !(post._id && post._id.startsWith("mock-")))
    if (userPosts.length > 0) {
      localStorage.setItem("social-media-posts", JSON.stringify(userPosts))
    }

    setIsLoading(false)
    return true
  }

  const deleteComment = async (postId: string, commentId: string): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedPosts = posts.map((post) => {
      if (post._id === postId) {
        return {
          ...post,
          comments: post.comments.filter((comment) => !(comment._id === commentId && comment.userId === user._id)),
        }
      }
      return post
    })

    setPosts(updatedPosts)
    const userPosts = updatedPosts.filter((post) => !(post._id && post._id.startsWith("mock-")))
    if (userPosts.length > 0) {
      localStorage.setItem("social-media-posts", JSON.stringify(userPosts))
    }

    setIsLoading(false)
    return true
  }

  return (
    <PostsContext.Provider value={{ posts, createPost, deletePost, likePost, addComment, deleteComment, isLoading }}>
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider")
  }
  return context
}
