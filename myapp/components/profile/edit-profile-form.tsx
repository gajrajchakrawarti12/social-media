"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Save, X } from "lucide-react"

interface EditProfileFormProps {
  onCancel: () => void
  onSave: () => void
}

export function EditProfileForm({ onCancel, onSave }: EditProfileFormProps) {
  const { user, updateProfile, isLoading } = useAuth()
  const [formData, setFormData] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  })
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.username.trim()) {
      setError("Username is required")
      return
    }

    const success = await updateProfile({
      username: formData.username.trim(),
      bio: formData.bio.trim(),
      avatar: formData.avatar.trim() || `/placeholder.svg?height=120&width=120&query=user avatar`,
    })

    if (success) {
      onSave()
    } else {
      setError("Failed to update profile. Please try again.")
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Edit Profile
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <img
              src={formData.avatar || `/placeholder.svg?height=120&width=120&query=user avatar`}
              alt="Profile preview"
              className="w-24 h-24 rounded-full mx-auto border-4 border-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Profile Picture URL</Label>
            <Input
              id="avatar"
              type="url"
              placeholder="Enter image URL (optional)"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground text-right">{formData.bio.length}/160 characters</p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
