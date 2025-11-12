export interface SocialMediaPost {
  category: string;
  text: string;
}

export interface SocialMediaData {
  result: {
    twitter: SocialMediaPost[];
    linkedin: SocialMediaPost[];
    instagram: SocialMediaPost[];
  };
  status: number;
  projectType: string;
}
