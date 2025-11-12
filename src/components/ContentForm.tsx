"use client"

import type React from "react"

import { useState } from "react"

import { Card } from "../../@/components/ui/card"
import { Label } from "@radix-ui/react-label"
import { Input } from "../../@/components/ui/input"
import { Textarea } from "../../@/components/ui/textarea"

interface ContentFormProps {
  onGenerate: (data: { link: string; projectType: string; todayFeature: string }) => void
  loading: boolean
}

export default function ContentForm({ onGenerate, loading }: ContentFormProps) {
  const [formData, setFormData] = useState({
    link: "",
    projectType: "",
    todayFeature: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.link && formData.projectType && formData.todayFeature) {
      onGenerate(formData)
    }
  }

  return (
    <Card className="p-6 sticky top-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Project Details</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Link Input */}
        <div>
          <Label htmlFor="link" className="text-foreground font-semibold mb-2 block">
            Project Link
          </Label>
          <Input
            id="link"
            name="link"
            type="url"
            placeholder="https://example.com"
            value={formData.link}
            onChange={handleChange}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        {/* Project Type Input */}
        <div>
          <Label htmlFor="projectType" className="text-foreground font-semibold mb-2 block">
            Project Type
          </Label>
          <Input
            id="projectType"
            name="projectType"
            type="text"
            placeholder="e.g., working, beta, launch"
            value={formData.projectType}
            onChange={handleChange}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        {/* Today Feature Input */}
        <div>
          <Label htmlFor="todayFeature" className="text-foreground font-semibold mb-2 block">
            Today's Feature
          </Label>
          <Textarea
            id="todayFeature"
            name="todayFeature"
            placeholder="Describe the feature you're launching or working on..."
            value={formData.todayFeature}
            onChange={handleChange}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
            rows={4}
            required
          />
        </div>

        {/* Submit Button */}
        <Button 
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-2"
        >
          {loading ? "Generating..." : "Generate Posts"}
        </Button>
      </form>
    </Card>
  )
}
