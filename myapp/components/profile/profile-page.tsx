"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { ProfileView } from "./profile-view"
import { EditProfileForm } from "./edit-profile-form"

export function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  if (!user) {
    return null
  }

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isEditing ? (
        <EditProfileForm onCancel={handleCancel} onSave={handleSave} />
      ) : (
        <ProfileView user={user} isOwnProfile={true} onEditClick={handleEditClick} />
      )}
    </div>
  )
}
