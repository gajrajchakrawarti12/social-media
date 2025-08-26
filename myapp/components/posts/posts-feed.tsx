"use client"

import { usePosts } from "@/contexts/posts-context"
import { useAuth } from "@/contexts/auth-context"
import { PostCard } from "./post-card"
import { CreatePostForm } from "./create-post-form"
import { Card, CardContent } from "@/components/ui/card"
import { Users, TrendingUp, Sparkles } from "lucide-react"

export function PostsFeed() {
  const { posts } = usePosts()
  const { user } = useAuth()

  const userPosts = posts.filter((post) => post.userId === user?.id)
  const isNewUser = userPosts.length === 0

  return (
    <div className="space-y-6">
      <CreatePostForm />

      {isNewUser && (
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-primary">Welcome to SocialConnect!</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              You're now part of a vibrant community of creators, developers, and innovators. Share your thoughts,
              connect with others, and discover amazing content!
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-accent" />
                <span>Connect with peers</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span>Share your journey</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground border-b pb-2">
              <TrendingUp className="w-4 h-4" />
              <span>Latest from the community</span>
            </div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}
