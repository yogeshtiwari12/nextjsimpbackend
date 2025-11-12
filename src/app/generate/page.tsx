"use client"

import { useState } from "react"
import ContentForm from "../../components/ContentForm"
import PostResults from "../../components/PostResults"


export default function GeneratePage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (payload: { link: string; projectType: string; todayFeature: string }) => {
    setLoading(true)
    setError(null)
    setData(null)

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok || json.error) {
        setError(json.error || "Failed to generate posts")
      } else {
        setData(json)
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ContentForm onGenerate={handleGenerate} loading={loading} />

        </div>
        <div className="lg:col-span-2">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : data ? (
            <PostResults data={data} />
          ) : (
            <div className="text-muted-foreground">Fill the form to generate posts.</div>
          )}
        </div>
      </div>
    </main>
  )
}
