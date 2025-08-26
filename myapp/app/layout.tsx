import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { PostsProvider } from "@/contexts/posts-context"
import { SocialProvider } from "@/contexts/social-context"

export const metadata: Metadata = {
  title: "SocialConnect",
  description: "A modern social media platform for connecting with friends and sharing moments",
  creator: "Gajraj Chakrawarti",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
          <SocialProvider>
            <PostsProvider>{children}</PostsProvider>
          </SocialProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
