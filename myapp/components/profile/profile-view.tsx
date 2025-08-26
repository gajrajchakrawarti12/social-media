"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Edit, Users, UserPlus } from "lucide-react"
import type { User as UserType } from "@/contexts/auth-context"

interface ProfileViewProps {
  user: UserType
  isOwnProfile: boolean
  onEditClick?: () => void
}

export function ProfileView({ user, isOwnProfile, onEditClick }: ProfileViewProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-4">
        <div className="relative inline-block">
          <img
            src={user.avatar || `/placeholder.svg?height=120&width=120&query=user avatar`}
            alt={user.username}
            className="w-24 h-24 rounded-full mx-auto border-4 border-primary/20"
          />
          {isOwnProfile && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              onClick={onEditClick}
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-muted-foreground">@{user.username}</p>
        </div>

        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Followers</span>
            </div>
            <p className="text-xl font-semibold">{user.followers}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <UserPlus className="w-4 h-4" />
              <span>Following</span>
            </div>
            <p className="text-xl font-semibold">{user.following}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              About
            </h3>
            <p className="text-muted-foreground">{user.bio || "No bio available yet."}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Contact</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <div className="flex gap-2">
            <Badge variant="secondary">Active User</Badge>
            <Badge variant="outline">Member since 2024</Badge>
          </div>

          {isOwnProfile && (
            <Button onClick={onEditClick} className="w-full mt-4">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
