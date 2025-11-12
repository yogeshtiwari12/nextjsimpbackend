import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Twitter, Linkedin, Instagram } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PlatformCardProps {
  platform: "twitter" | "linkedin" | "instagram";
  category: string;
  text: string;
  index: number;
}

const platformConfig: Record<"twitter" | "linkedin" | "instagram", {
  name: string;
  color: string;
  icon: LucideIcon;
  gradient: string;
}> = {
  twitter: {
    name: "Twitter",
    color: "bg-twitter",
    icon: Twitter,
    gradient: "",
  },
  linkedin: {
    name: "LinkedIn",
    color: "bg-linkedin",
    icon: Linkedin,
    gradient: "",
  },
  instagram: {
    name: "Instagram",
    color: "bg-gradient-to-br from-instagram-start to-instagram-end",
    icon: Instagram,
    gradient: "from-instagram-start to-instagram-end",
  },
};

export const PlatformCard = ({ platform, category, text, index }: PlatformCardProps) => {
  const config = platformConfig[platform];
  const IconComponent = config.icon;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success(`${config.name} post copied to clipboard!`);
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden bg-card border-border transition-all duration-300 hover:scale-[1.02]",
        "hover:shadow-2xl animate-in fade-in-50 slide-in-from-bottom-4 h-full flex flex-col"
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <div className={cn("absolute top-0 left-0 w-full h-1", config.color)} />
      
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-white",
              config.gradient ? `bg-gradient-to-br ${config.gradient}` : config.color
            )}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{config.name}</h3>
              <Badge variant="secondary" className="mt-1">
                {category}
              </Badge>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed flex-1">
          {text}
        </p>

        <div className="flex gap-2 pt-2 mt-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={copyToClipboard}
            className="flex-1 group-hover:bg-accent transition-colors"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const urls = {
                twitter: "https://twitter.com/compose/tweet",
                linkedin: "https://www.linkedin.com/feed/",
                instagram: "https://www.instagram.com/",
              };
              window.open(urls[platform], "_blank");
            }}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
