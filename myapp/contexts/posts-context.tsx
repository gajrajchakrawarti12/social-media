"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

export interface Comment {
  id: string
  postId: string
  userId: string
  username: string
  userAvatar: string
  content: string
  createdAt: Date
}

export interface Post {
  id: string
  userId: string
  username: string
  userAvatar: string
  content: string
  image?: string
  createdAt: Date
  likes: number
  comments: Comment[]
  isLiked: boolean
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

const mockComments: Comment[] = [
  {
    id: "comment-1",
    postId: "mock-1",
    userId: "user-3",
    username: "alex_designer",
    userAvatar: `/placeholder.svg?height=32&width=32&query=designer avatar`,
    content: "Congratulations! Your first app looks amazing! 🎉",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: "comment-2",
    postId: "mock-1",
    userId: "user-4",
    username: "mike_startup",
    userAvatar: `/placeholder.svg?height=32&width=32&query=entrepreneur avatar`,
    content: "The journey of a thousand apps begins with a single component. Well done!",
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "comment-3",
    postId: "mock-2",
    userId: "user-2",
    username: "sarah_dev",
    userAvatar: `/placeholder.svg?height=32&width=32&query=woman developer avatar`,
    content: "Love the clean aesthetic! The color palette is perfect.",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: "comment-4",
    postId: "mock-3",
    userId: "user-5",
    username: "emma_tech",
    userAvatar: `/placeholder.svg?height=32&width=32&query=tech woman avatar`,
    content: "Coffee shops are the best! I do my most creative work there too ☕",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
]

const mockPosts: Post[] = [
  {
    id: "mock-1",
    userId: "user-2",
    username: "sarah_dev",
    userAvatar: `/placeholder.svg?height=40&width=40&query=woman developer avatar`,
    content:
      "Just launched my first React app! The feeling of seeing your code come to life is incredible. Thanks to everyone who helped me along the way! 🚀",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 24,
    comments: mockComments.filter((c) => c.postId === "mock-1"),
    isLiked: false,
  },
  {
    id: "mock-2",
    userId: "user-3",
    username: "alex_designer",
    userAvatar: `/placeholder.svg?height=40&width=40&query=designer avatar`,
    content:
      "Working on some new UI concepts for mobile apps. Clean design is not just about aesthetics, it's about creating intuitive user experiences.",
    image: `/placeholder.svg?height=300&width=500&query=modern mobile app design mockup`,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    likes: 42,
    comments: mockComments.filter((c) => c.postId === "mock-2"),
    isLiked: true,
  },
  {
    id: "mock-3",
    userId: "user-4",
    username: "mike_startup",
    userAvatar: `/placeholder.svg?height=40&width=40&query=entrepreneur avatar`,
    content:
      "Coffee shop coding session today. Sometimes the best ideas come when you step away from your usual workspace. What's your favorite place to work?",
    image: `/placeholder.svg?height=300&width=500&query=coffee shop laptop coding`,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    likes: 18,
    comments: mockComments.filter((c) => c.postId === "mock-3"),
    isLiked: false,
  },
  {
    id: "mock-4",
    userId: "user-5",
    username: "emma_tech",
    userAvatar: `/placeholder.svg?height=40&width=40&query=tech woman avatar`,
    content:
      "Reminder: Your code doesn't have to be perfect on the first try. Progress over perfection, always. Keep building, keep learning! 💪",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    likes: 67,
    comments: [],
    isLiked: false,
  },
  {
    id: "mock-5",
    userId: "user-6",
    username: "david_ai",
    userAvatar: `/placeholder.svg?height=40&width=40&query=ai researcher avatar`,
    content:
      "Fascinating discussion at today's AI meetup about the future of human-computer interaction. The possibilities are endless when we combine creativity with technology.",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    likes: 35,
    comments: [],
    isLiked: true,
  },
]

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    // Load posts from localStorage on mount
    const storedPosts = localStorage.getItem("social-media-posts")
    let userPosts: Post[] = []

    if (storedPosts) {
      userPosts = JSON.parse(storedPosts).map((post: any) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        comments:
          post.comments?.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
          })) || [],
      }))
    }

    const allPosts = [...userPosts, ...mockPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    setPosts(allPosts)
  }, [])

  const savePosts = (newPosts: Post[]) => {
    const userPosts = newPosts.filter((post) => !post.id.startsWith("mock-"))
    localStorage.setItem("social-media-posts", JSON.stringify(userPosts))

    const allPosts = [...newPosts.filter((post) => !post.id.startsWith("mock-")), ...mockPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    setPosts(allPosts)
  }

  const createPost = async (content: string, image?: string): Promise<boolean> => {
    if (!user || !content.trim()) return false

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newPost: Post = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar || `/placeholder.svg?height=40&width=40&query=user avatar`,
      content: content.trim(),
      image,
      createdAt: new Date(),
      likes: 0,
      comments: [],
      isLiked: false,
    }

    const currentUserPosts = posts.filter((post) => !post.id.startsWith("mock-"))
    const updatedPosts = [newPost, ...currentUserPosts]
    savePosts(updatedPosts)

    setIsLoading(false)
    return true
  }

  const deletePost = async (postId: string): Promise<boolean> => {
    if (!user || postId.startsWith("mock-")) return false

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedPosts = posts.filter((post) => !(post.id === postId && post.userId === user.id))
    savePosts(updatedPosts.filter((post) => !post.id.startsWith("mock-")))

    setIsLoading(false)
    return true
  }

  const likePost = (postId: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
        }
      }
      return post
    })
    setPosts(updatedPosts)

    const userPosts = updatedPosts.filter((post) => !post.id.startsWith("mock-"))
    if (userPosts.length > 0) {
      localStorage.setItem("social-media-posts", JSON.stringify(userPosts))
    }
  }

  const addComment = async (postId: string, content: string): Promise<boolean> => {
    if (!user || !content.trim()) return false

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      postId,
      userId: user.id,
      username: user.username,
      userAvatar: user.avatar || `/placeholder.svg?height=32&width=32&query=user avatar`,
      content: content.trim(),
      createdAt: new Date(),
    }

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment],
        }
      }
      return post
    })

    setPosts(updatedPosts)
    const userPosts = updatedPosts.filter((post) => !post.id.startsWith("mock-"))
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
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter((comment) => !(comment.id === commentId && comment.userId === user.id)),
        }
      }
      return post
    })

    setPosts(updatedPosts)
    const userPosts = updatedPosts.filter((post) => !post.id.startsWith("mock-"))
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
