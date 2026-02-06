/** Veritabanındaki ürün (products tablosu) */
export interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
  created_at?: string;
}
