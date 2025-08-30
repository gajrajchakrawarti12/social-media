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
import { FILE_URL } from "@/app/page"

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

  const [fileBlob, setFileBlob] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFileBlob(file)
      setFormData({ ...formData, avatar: URL.createObjectURL(file) }) // instant preview
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.username.trim()) {
      setError("Username is required")
      return
    }

    try {
      // Upload new avatar if selected
      if (fileBlob) {
        setIsUploadingAvatar(true)

        // Delete old avatar if exists
        if (user?.avatar) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/deleteUserAvatar`, {
            method: "DELETE",
            credentials: "include",
          })
        }

        const uploadFormData = new FormData()
        uploadFormData.append("file", fileBlob, "avatar.jpg")
        console.log(uploadFormData.get("file"));

        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/files/uploadUserAvatar`, {
          method: "POST",
          credentials: "include",
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error("Avatar upload failed")
        }

        setIsUploadingAvatar(false)
      }

      // Update profile details
      const success = await updateProfile({
        username: formData.username.trim(),
        bio: formData.bio.trim(),
      })

      if (success) {
        onSave()
      } else {
        setError("Failed to update profile. Please try again.")
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
      setIsUploadingAvatar(false)
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
          {/* Avatar Preview */}
          <div className="text-center">
            <img
              src={user?.avatar ? `${FILE_URL}/files/${user?.avatar}` : `/placeholder.svg?height=120&width=120&query=user avatar`}
              alt="Profile preview"
              className="w-24 h-24 rounded-full mx-auto border-4 border-primary/20 object-cover"
            />
          </div>

          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="file">Profile Picture</Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Username */}
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

          {/* Bio */}
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
            <p className="text-xs text-muted-foreground text-right">
              {formData.bio.length}/160 characters
            </p>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading || isUploadingAvatar} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isLoading || isUploadingAvatar ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
