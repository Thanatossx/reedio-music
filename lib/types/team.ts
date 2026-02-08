export type TeamSection = "yonetim" | "sanatci";

export interface TeamCategoryRow {
  id: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  section: TeamSection;
  created_at: string;
}

export interface TeamMemberRow {
  id: string;
  name: string;
  image_url: string | null;
  bio: string | null;
  sort_order: number;
  category_id: string | null;
  section: TeamSection;
  created_at: string;
}
