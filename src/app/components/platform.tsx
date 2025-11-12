import { PlatformCard } from "./platformcard";
import { SocialMediaPost } from "./types";

interface PlatformSectionProps {
  platform: "twitter" | "linkedin" | "instagram";
  posts: SocialMediaPost[];
}

export const PlatformSection = ({ platform, posts }: PlatformSectionProps) => {
  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-fr">
        {posts.map((post, index) => (
          <PlatformCard
            key={`${platform}-${index}`}
            platform={platform}
            category={post.category}
            text={post.text}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};
