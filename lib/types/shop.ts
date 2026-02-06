export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderRequest {
  fullName: string;
  phone: string;
  address: string;
  items: CartItem[];
}
