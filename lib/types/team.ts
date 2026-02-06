export interface TeamMemberRow {
  id: string;
  name: string;
  image_url: string | null;
  bio: string | null;
  sort_order: number;
  created_at: string;
}
