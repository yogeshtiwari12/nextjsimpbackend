"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Sparkles, ExternalLink, Twitter, Linkedin, Instagram, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Add types
interface SocialPost {
  category: string;
  text: string;
}
type PlatformKey = 'twitter' | 'linkedin' | 'instagram';

export default function SocialPostsDashboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState<string>('');
  const [link, setLink] = useState<string>("");
  const [projectType, setProjectType] = useState<string>("working");
  const [todayFeature, setTodayFeature] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<Record<PlatformKey, SocialPost[]> | null>(null);
  const [showLinkError, setShowLinkError] = useState(false);

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#000000';
    document.body.style.backgroundColor = '#000000';
    document.body.style.overscrollBehavior = 'none';
  }, []);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setPopupMessage('Copied to clipboard!');
      setShowPopup(true);
      setTimeout(() => {
        setCopiedId(null);
        setShowPopup(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      setPopupMessage('Failed to copy');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  const handleGenerate = async () => {
    if (!projectType || !todayFeature) {
      setPopupMessage('Please fill in all required fields');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    // Check if link is required based on project type
    if (projectType !== 'working' && !link) {
      setShowLinkError(true);
      setPopupMessage('Project link is required for this project type');
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
      return;
    }

    setShowLinkError(false);
    setIsGenerating(true);
    try {
      const response = await axios.post('/api/ai', {
        projectLink: link || undefined,
        projectType,
        todayFeature,
      });
      console.log('Generation response:', response.data);

      // Fix: Check for result property and set data correctly
      if (response.data && response.data.result) {
        setGeneratedData(response.data.result);
        setPopupMessage('Posts generated successfully!');
      } else if (response.data && response.data.twitter) {
        // If result is at root level
        setGeneratedData(response.data);
        setPopupMessage('Posts generated successfully!');
      } else {
        throw new Error('Invalid response format');
      }
      
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2000);
    } catch (error: any) {
      console.error('Error generating posts:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Failed to generate posts';
      setPopupMessage(errorMessage);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 4000);
    } finally {
      setIsGenerating(false);
    }
  };

  const platforms: { key: PlatformKey; name: string; icon: any; color: string; iconBg: string }[] = [
    { key: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-blue-500', iconBg: 'bg-blue-500' },
    { key: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600', iconBg: 'bg-blue-600' },
    { key: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500', iconBg: 'bg-pink-500' }
  ];

  const groupByCategory = (posts: SocialPost[]): Record<string, SocialPost[]> => {
    const grouped: Record<string, SocialPost[]> = {};
    posts.forEach(post => {
      (grouped[post.category] ||= []).push(post);
    });
    return grouped;
  };

  const PlatformSection = ({ platform, posts }: { platform: PlatformKey; posts: SocialPost[] }) => {
    const platformData = platforms.find(p => p.key === platform)!;
    const Icon = platformData.icon;

    // Add safety check for posts
    if (!posts || !Array.isArray(posts) || posts.length === 0) {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${platformData.iconBg} flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{platformData.name} Posts</h2>
          </div>
          <div className="text-center py-10 text-gray-400">
            <p>No posts available for {platformData.name}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${platformData.iconBg} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold">{platformData.name} Posts</h2>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {posts.map((post, index) => {
            const postId = `${platform}-${post.category}-${index}`;
            const isCopied = copiedId === postId;
            
            return (
              <Card key={postId} className="bg-zinc-900 border-t-4 border-l-0 border-r-0 border-b-0 overflow-hidden min-h-[280px] flex flex-col" style={{ borderTopColor: platformData.key === 'twitter' ? '#3B82F6' : platformData.key === 'linkedin' ? '#2563EB' : '#EC4899' }}>
                <div className="p-6 space-y-4 flex flex-col flex-1">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full ${platformData.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white">{platformData.name}</h3>
                      <p className="text-sm text-gray-400">{post.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 leading-relaxed flex-1">
                    {post.text}
                  </p>
                  
                  <div className="flex gap-2 pt-2 mt-auto">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border-0"
                      onClick={() => handleCopy(post.text, postId)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {isCopied ? 'Copied' : 'Copy'}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-zinc-800 hover:bg-zinc-700 text-white border-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <div className="container mx-auto px-4 py-12 space-y-10 max-w-7xl">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Personalized AI Social Media Post Generator</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Personalized AI Post Generator</h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Create tailored social media content for Twitter, LinkedIn, and Instagram with AI
          </p>
        </div>

        <Card className="p-6 bg-zinc-900/50 border-zinc-800">
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-bold text-white">Generate Social Media Posts</h2>
            <p className="text-gray-400">Enter your project details to generate optimized posts for all platforms</p>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="link" className="text-white">
                  Project Link {projectType !== 'working' && <span className="text-red-500">*</span>}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="link"
                    type="url"
                    placeholder="https://your-project.com"
                    value={link}
                    onChange={(e) => {
                      setLink(e.target.value);
                      if (e.target.value) setShowLinkError(false);
                    }}
                    className={`bg-black border-zinc-800 text-white ${
                      showLinkError ? 'border-red-500' : ''
                    }`}
                  />
                  {link && (
                    <Button variant="secondary" className="bg-zinc-800 hover:bg-zinc-700 border-0" onClick={() => window.open(link, "_blank")}>
                      Open
                    </Button>
                  )}
                </div>
                {showLinkError && projectType !== 'working' && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <span></span> Link is required for {projectType} projects
                  </p>
                )}
                {!showLinkError && (
                  <p className="text-xs text-gray-500">
                    {projectType === 'working' 
                      ? 'Paste a public URL to your project, demo, or repo (optional).'
                      : 'Paste a public URL to your project, demo, or repo (required).'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType" className="text-white">Project Type *</Label>
                <Select 
                  value={projectType} 
                  onValueChange={(value) => {
                    setProjectType(value);
                    if (value !== 'working' && !link) {
                      setShowLinkError(true);
                    } else {
                      setShowLinkError(false);
                    }
                  }}
                >
                  <SelectTrigger id="projectType" className="bg-black border-zinc-800 text-white">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-zinc-800">
                    <SelectItem value="working" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">Working</SelectItem>
                    <SelectItem value="completed" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">Completed</SelectItem>
                    <SelectItem value="ongoing" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">Ongoing</SelectItem>
                    <SelectItem value="launched" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">Launched</SelectItem>
                    <SelectItem value="beta" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">Beta</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Choose the current status of your project.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="todayFeature" className="text-white">Today&apos;s Feature *</Label>
              <Select value={todayFeature} onValueChange={setTodayFeature}>
                <SelectTrigger id="todayFeature" className="bg-black border-zinc-800 text-white">
                  <SelectValue placeholder="Select the feature you implemented" />
                </SelectTrigger>
                <SelectContent className="bg-black border-zinc-800">
                  <SelectItem value="authentication" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">Authentication</SelectItem>
                  <SelectItem value="responsive-design" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">Responsive Design</SelectItem>
                  <SelectItem value="api-integration" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">API Integration</SelectItem>
                  <SelectItem value="database-setup" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">Database Setup</SelectItem>
                  <SelectItem value="payment-integration" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">Payment Integration</SelectItem>
                  <SelectItem value="search-functionality" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">Search Functionality</SelectItem>
                  <SelectItem value="user-dashboard" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">User Dashboard</SelectItem>
                  <SelectItem value="performance-optimization" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">Performance Optimization</SelectItem>
                  <SelectItem value="accessibility" className="text-white hover:bg-zinc-800 focus:bg-zinc-800">Accessibility Features</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">What did you work on today? This personalizes the copy.</p>
            </div>

            <Button 
              className="w-full bg-blue-500 hover:bg-blue-700 text-white" 
              size="lg"
              onClick={handleGenerate}
              disabled={isGenerating || !projectType || !todayFeature}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Posts
                </>
              )}
            </Button>
          </div>
        </Card>

        {generatedData && (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 bg-black border border-zinc-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white text-gray-400">All</TabsTrigger>
              <TabsTrigger value="twitter" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-gray-400 flex items-center gap-2">
                <Twitter className="w-4 h-4" /> Twitter
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 flex items-center gap-2">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </TabsTrigger>
              <TabsTrigger value="instagram" className="data-[state=active]:bg-pink-500 data-[state=active]:text-white text-gray-400 flex items-center gap-2">
                <Instagram className="w-4 h-4" /> Instagram
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-12 mt-8">
              {generatedData.twitter && <PlatformSection platform="twitter" posts={generatedData.twitter} />}
              {generatedData.linkedin && <PlatformSection platform="linkedin" posts={generatedData.linkedin} />}
              {generatedData.instagram && <PlatformSection platform="instagram" posts={generatedData.instagram} />}
            </TabsContent>

            <TabsContent value="twitter" className="mt-8">
              {generatedData.twitter && <PlatformSection platform="twitter" posts={generatedData.twitter} />}
            </TabsContent>

            <TabsContent value="linkedin" className="mt-8">
              {generatedData.linkedin && <PlatformSection platform="linkedin" posts={generatedData.linkedin} />}
            </TabsContent>

            <TabsContent value="instagram" className="mt-8">
              {generatedData.instagram && <PlatformSection platform="instagram" posts={generatedData.instagram} />}
            </TabsContent>
          </Tabs>
        )}

        {!generatedData && (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h3 className="text-2xl font-bold mb-2">Ready to Generate Posts</h3>
            <p className="text-gray-400">Fill in the form above and click Generate Posts to create your social media content</p>
          </div>
        )}
      </div>

      {showPopup && (
        <div
          className={`fixed bottom-4 right-4 ${
            popupMessage.includes('success') || popupMessage.includes('Copied') 
              ? 'bg-zinc-900' 
              : 'bg-red-900'
          } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 border ${
            popupMessage.includes('success') || popupMessage.includes('Copied')
              ? 'border-zinc-800'
              : 'border-red-700'
          }`}
          role="status"
          aria-live="polite"
        >
          <Check className={`w-5 h-5 ${
            popupMessage.includes('success') || popupMessage.includes('Copied')
              ? 'text-blue-400'
              : 'text-red-400'
          }`} />
          <span className="font-medium">{popupMessage}</span>
        </div>
      )}
    </main>
  );
}