"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { usePosts } from "@/contexts/posts-context"
import { Send, ImageIcon, X } from "lucide-react"
import { FILE_URL } from "@/app/page"

export function CreatePostForm() {
  const { user } = useAuth()
  const { createPost, isLoading } = usePosts()
  const [content, setContent] = useState("")
  const [image, setImage] = useState<Blob | null>(null)
  const [showImageInput, setShowImageInput] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    const success = await createPost(content, image || undefined)
    if (success) {
      setContent("")
      setImage(null)
      setShowImageInput(false)
      window.location.reload() // Refresh to show the new post
    }
  }

  const handleImageToggle = () => {
    setShowImageInput(!showImageInput)
    if (showImageInput) {
      setImage(null)
    }
  }

  if (!user) return null

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <img src={user.avatar ? `${FILE_URL}/files/${user.avatar}` : "/placeholder-user.jpg"} alt={user.username} className="w-8 h-8 rounded-full" crossOrigin="anonymous" />
          <div>
            <p className="font-medium">@{user.username}</p>
            <p className="text-sm text-muted-foreground">Share your thoughts...</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            maxLength={280}
            className="resize-none border-0 p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {showImageInput && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImage(file);
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="sm" onClick={handleImageToggle}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {image && (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={handleImageToggle}>
                <ImageIcon className="w-4 h-4 mr-1" />
                Photo
              </Button>
              <span className="text-xs text-muted-foreground">{content.length}/280</span>
            </div>

            <Button type="submit" disabled={!content.trim() || isLoading} size="sm">
              <Send className="w-4 h-4 mr-2" />
              {isLoading ? "Posting..." : "Post"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
