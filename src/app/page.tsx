"use client"

import { useState } from "react"
import ContentForm from "../components/ContentForm"
import PostResults from "../components/PostResults"
import { CardDescription } from "../../@/components/ui/card"
import { Card } from "../../@/components/ui/card"
export default function Home() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (formData: {
    link: string
    projectType: string
    todayFeature: string
  }) => {
    setLoading(true)
    try {
      const response = await fetch("/api/generate-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error generating posts:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-4">Content Generator</h1>
          <p className="text-xl text-muted-foreground">
            Transform your project into engaging social media posts for LinkedIn, Twitter, and Instagram
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <ContentForm onGenerate={handleGenerate} loading={loading} />
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {results ? (
              <PostResults data={results} />
            ) : (
              <CardDescription className="p-12 text-center">
                <div className="text-muted-foreground">
                  <p className="text-lg">Fill in your project details and click "Generate" to see your posts</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
