"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSocial } from "@/contexts/social-context"
import { UserPlus, UserMinus, Users, TrendingUp } from "lucide-react"
import { FILE_URL } from "@/app/file"

export function DiscoverPage() {
  const { users, followUser, unfollowUser } = useSocial()

  const handleFollowToggle = (userId: string, isFollowing: boolean) => {
    if (isFollowing) {
      unfollowUser(userId)
    } else {
      followUser(userId)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover People</h1>
        <p className="text-muted-foreground">Connect with amazing creators and developers in our community</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((userProfile) => (
          <Card key={userProfile._id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <img
                src={userProfile.avatar ? `${FILE_URL}/files/${userProfile.avatar}` : "/placeholder.svg"}
                alt={userProfile.username}
                className="w-16 h-16 rounded-full mx-auto mb-3"
                crossOrigin="anonymous"
              />
              <CardTitle className="text-lg">@{userProfile.username}</CardTitle>
              <div className="flex justify-center gap-4 mt-2">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>Followers</span>
                  </div>
                  <p className="font-semibold">{userProfile.followers}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>Following</span>
                  </div>
                  <p className="font-semibold">{userProfile.following}</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{userProfile.bio}</p>

              <div className="flex gap-2 mb-4">
                <Badge variant="secondary">Active</Badge>
                <Badge variant="outline">Verified</Badge>
              </div>

              <Button
                onClick={() => handleFollowToggle(userProfile._id, !!userProfile.isFollowing)}
                variant={userProfile?.isFollowing ? "outline" : "default"}
                className="w-full"
              >
                {userProfile?.isFollowing ? (
                  <>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Follow
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
