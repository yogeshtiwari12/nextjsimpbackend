"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../@/components/ui/tabs"
import { Card } from "../../@/components/ui/card"
import { Button } from "../../@/components/ui/button"

interface PostResultsProps {
  data: any
}

export default function PostResults({ data }: PostResultsProps) {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  const copyToClipboard = (text: string, index: string) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const platforms = [
    { id: "twitter", label: "Twitter", icon: "𝕏", posts: data.result?.twitter || [] },
    { id: "linkedin", label: "LinkedIn", icon: "in", posts: data.result?.linkedin || [] },
    { id: "instagram", label: "Instagram", icon: "ig", posts: data.result?.instagram || [] },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="twitter" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-input">
          {platforms.map((platform) => (
            <TabsTrigger key={platform.id} value={platform.id} className="text-foreground">
              {platform.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {platforms.map((platform) => (
          <TabsContent key={platform.id} value={platform.id} className="space-y-4">
            {platform.posts.length > 0 ? (
              platform.posts.map((post: any, idx: number) => {
                const copyKey = `${platform.id}-${idx}`
                return (
                  <Card key={idx} className="p-6 bg-card border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-3">
                          {post.category}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(post.text, copyKey)}
                        className="ml-2"
                      >
                        {copiedIndex === copyKey ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-foreground leading-relaxed text-base">{post.text}</p>
                  </Card>
                )
              })
            ) : (
              <Card className="p-6 bg-card border-border text-center">
                <p className="text-muted-foreground">No posts generated for this platform yet.</p>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
