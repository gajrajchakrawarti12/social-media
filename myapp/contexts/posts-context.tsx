"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./auth-context"

export interface Comment {
  _id: string
  postId: string
  userId: string | { _id: string, username: string, avatar: string }
  content: string
  createdAt: Date
}
export interface Like {
  _id: string
  postId: string
  userId: string | { _id: string, username: string, avatar: string }
  createdAt: Date
}
export interface Post {
  _id?: string
  userId: string | { _id: string, username: string, avatar: string }
  username?: string
  userAvatar?: string
  content: string
  image?: string | Blob
  createdAt?: Date
  likes: Like[]
  comments: Comment[]
  isLiked?: boolean
}

interface PostsContextType {
  posts: Post[]
  createPost: (content: string, image?: Blob) => Promise<boolean>
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
  const [user, setUser] = useState<User | null>(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

  useEffect(() => {
    // Load posts from API on mount
    const fetchPosts = async () => {
      const response = await fetch(`${API_URL}/posts`, {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      let userPosts: Post[] = [];

      if (data) {
        userPosts = data.map((post: any) => ({
          ...post,
          likes: post.likes || [],
          createdAt: new Date(post.createdAt),
          username: post.userId.username,
          userAvatar: post.userId.avatar ? `${process.env.API_URL}/files/${post.userId.avatar}` : `/placeholder-user.jpg?height=32&width=32&query=user avatar`,
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
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to fetch user")

      const userJson = await res.json()
      const userData: User = userJson.user
      setUser(userData)
      const isUserLike = allPosts.map((post) => ({
        ...post,
        isLiked: post.likes.some((like) => like.userId === userData?._id),
      }))
      setPosts(isUserLike)
    }

    fetchPosts()
  }, [])

  const savePosts = async (newPosts: Post) => {
    console.log(newPosts);

    let response;
    if (newPosts.image && newPosts.image instanceof Blob) {
      const formData = new FormData();
      formData.append("userId", typeof newPosts.userId === "string" ? newPosts.userId : newPosts.userId._id);
      formData.append("content", newPosts.content);
      formData.append("image", newPosts.image);
      response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
    } else {
      response = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newPosts),
      });
    }
    return await response.json()
  }

  const createPost = async (content: string, image?: Blob): Promise<boolean> => {
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
    if (!user) return false

    setIsLoading(true)
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      credentials: "include"
    })
    console.log(response);
    window.location.reload();
    setIsLoading(false)
    return true
  }

  const likePost = async (postId: string) => {
    if (!user) return
    const updatedPosts = await Promise.all(posts.map(async (post) => {
      if (post._id === postId) {
        if (post.isLiked) {
          await fetch(`${API_URL}/posts/${postId}/unlike`, {
            method: "PUT",
            credentials: "include",
          });
          return {
            ...post,
            isLiked: false,
            likes: post.likes.filter((like) => like.userId !== user._id),
          };
        } else {
          await fetch(`${API_URL}/posts/${postId}/like`, {
            method: "PUT",
            credentials: "include",
          });
          return {
            ...post,
            isLiked: true,
            likes: [
              ...post.likes,
              {
                _id: `${user?._id}-${postId}`,
                postId: postId,
                userId: user?._id ?? '',
                createdAt: new Date(),
              } as Like,
            ],
          };
        }
      }
      return post;
    }));
    setPosts(updatedPosts);
  }

  const addComment = async (postId: string, content: string): Promise<boolean> => {
    if (!user || !content.trim()) return false

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newComment: Comment = {
      _id: `comment-${Date.now()}`,
      postId,
      userId: user._id,
      content: content.trim(),
      createdAt: new Date(),
    }

    const updatedPostsPromises = posts.map(async (post) => {
      if (post._id === postId) {
        const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newComment),
        });
        const data = await response.json();
        console.log(data);
        return {
          ...post,
          comments: [data.comments],
        }
      }
      return post
    })

    const updatedPosts = await Promise.all(updatedPostsPromises)
    setPosts(updatedPosts)

    setIsLoading(false)
    return true
  }

  const deleteComment = async (postId: string, commentId: string): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)
    const updatedPosts = posts.map((post) => {
      if (post._id === postId) {
        fetch(`${API_URL}/posts/${postId}/unComment`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ commentId }),
        });
        return {
          ...post,
          comments: post.comments.filter((comment) => !(comment._id === commentId && comment.userId === user._id)),
        }
      }
      return post
    })

    setPosts(updatedPosts)

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
