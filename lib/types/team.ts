export interface TeamCategoryRow {
  id: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface TeamMemberRow {
  id: string;
  name: string;
  image_url: string | null;
  bio: string | null;
  sort_order: number;
  category_id: string | null;
  created_at: string;
}
