"use server";

import { createServerClient } from "@/lib/supabase/server";
import { decreaseProductStock } from "@/app/actions/products";
import type { NormalOrderItems, CustomRequestItems } from "@/lib/types/order";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "20slm03snmz";

export type CreateNormalOrderInput = {
  customer_name: string;
  phone: string;
  address: string;
  items: NormalOrderItems;
};

export type CreateCustomRequestInput = {
  customer_name: string;
  phone: string;
  category: string;
  productDetail: string;
  budgetRange?: string;
};

export async function createNormalOrder(input: CreateNormalOrderInput) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customer_name,
      phone: input.phone,
      address: input.address,
      items: input.items as unknown as Record<string, unknown>,
      status: "pending_approval",
      type: "normal_order",
    })
    .select("id")
    .single();

  if (error) {
    console.error("createNormalOrder error:", error);
    return { ok: false, error: error.message };
  }
  for (const item of input.items.products) {
    await decreaseProductStock(item.productId, item.quantity);
  }
  return { ok: true, id: data.id };
}

export async function createCustomRequest(input: CreateCustomRequestInput) {
  const supabase = createServerClient();
  const items: CustomRequestItems = {
    category: input.category,
    productDetail: input.productDetail,
    budgetRange: input.budgetRange,
  };
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customer_name,
      phone: input.phone,
      address: null,
      items: items as unknown as Record<string, unknown>,
      status: "pending_approval",
      type: "custom_request",
    })
    .select("id")
    .single();

  if (error) {
    console.error("createCustomRequest error:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true, id: data.id };
}

export async function verifyAdminPassword(password: string) {
  if (password !== ADMIN_PASSWORD) {
    return { ok: false };
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  return { ok: true };
}

export async function checkAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE);
  return { ok: !!session?.value };
}

export async function getOrders() {
  const cookieStore = await cookies();
  if (!cookieStore.get(ADMIN_COOKIE)?.value) {
    return { ok: false, error: "unauthorized", orders: null };
  }
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, customer_name, phone, address, items, status, type, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getOrders error:", error);
    return { ok: false, error: error.message, orders: null };
  }
  return { ok: true, orders: data };
}

export async function updateOrderStatus(
  id: string,
  status: "pending_approval" | "approved_waiting" | "delivered" | "rejected"
) {
  const cookieStore = await cookies();
  if (!cookieStore.get(ADMIN_COOKIE)?.value) {
    return { ok: false, error: "unauthorized" };
  }
  const supabase = createServerClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("updateOrderStatus error:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
