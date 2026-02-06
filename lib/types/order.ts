export type OrderStatus =
  | "pending_approval"
  | "approved_waiting"
  | "delivered"
  | "rejected";
export type OrderType = "normal_order" | "custom_request";

export interface OrderRow {
  id: string;
  customer_name: string;
  phone: string;
  address: string | null;
  items: OrderItemsJSON;
  status: OrderStatus;
  type: OrderType;
  created_at?: string;
}

/** Mağaza siparişi: sepetteki ürünler */
export interface NormalOrderItems {
  products: Array<{ productId: string; name: string; price: number; quantity: number }>;
  totalPrice: number;
}

/** Özel tedarik: kategori, detay, bütçe */
export interface CustomRequestItems {
  category: string;
  productDetail: string;
  budgetRange?: string;
}

export type OrderItemsJSON = NormalOrderItems | CustomRequestItems;

export function isNormalOrderItems(
  items: OrderItemsJSON
): items is NormalOrderItems {
  return "products" in items && Array.isArray((items as NormalOrderItems).products);
}
