"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, Share, MoreHorizontal, Trash2, Send } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { usePosts, type Post } from "@/contexts/posts-context"
import { useAuth } from "@/contexts/auth-context"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const { likePost, deletePost, addComment, deleteComment } = usePosts()
  const { user } = useAuth()
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m`
    } else if (diffInHours < 24) {
      return `${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d`
    }
  }

  const handleDelete = async () => {
    await deletePost(post.id)
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const success = await addComment(post.id, newComment)
    if (success) {
      setNewComment("")
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment(post.id, commentId)
  }

  const isOwnPost = user?.id === post.userId
  const canDelete = isOwnPost && !post.id.startsWith("mock-")

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img src={post.userAvatar || "/placeholder.svg"} alt={post.username} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-medium">@{post.username}</p>
              <p className="text-sm text-muted-foreground">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {canDelete && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-base leading-relaxed">{post.content}</p>

          {post.image && (
            <div className="rounded-lg overflow-hidden">
              <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full max-h-96 object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => likePost(post.id)}
                className={`gap-2 ${post.isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground"}`}
              >
                <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                <span>{post.likes}</span>
              </Button>

              <Collapsible open={showComments} onOpenChange={setShowComments}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.length}</span>
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>

              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Share className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          <Collapsible open={showComments} onOpenChange={setShowComments}>
            <CollapsibleContent className="space-y-4">
              {post.comments.length > 0 && (
                <div className="space-y-3 pt-2">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <img
                        src={comment.userAvatar || "/placeholder.svg"}
                        alt={comment.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">@{comment.username}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</p>
                          {user?.id === comment.userId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="h-6 w-6 p-0 ml-auto"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleAddComment} className="flex gap-2">
                <img src={user?.avatar || "/placeholder.svg"} alt="Your avatar" className="w-8 h-8 rounded-full" />
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm" disabled={!newComment.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  )
}
