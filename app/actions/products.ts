"use server";

import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { ProductRow } from "@/lib/types/product";

const ADMIN_COOKIE = "admin_session";
const BUCKET = "product-images";

async function requireAdmin() {
  const cookieStore = await cookies();
  if (!cookieStore.get(ADMIN_COOKIE)?.value) {
    throw new Error("unauthorized");
  }
}

export async function getProducts(): Promise<{ ok: true; products: ProductRow[] } | { ok: false; error: string }> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price, image_url, category, stock, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getProducts error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true, products: data ?? [] };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function createProduct(formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "unauthorized" };
  }

  const name = formData.get("name") as string | null;
  const description = (formData.get("description") as string) || null;
  const priceStr = formData.get("price") as string | null;
  const category = (formData.get("category") as string) || "Diğer";
  const stockStr = formData.get("stock") as string | null;
  const file = formData.get("image") as File | null;

  if (!name?.trim()) return { ok: false, error: "Ürün adı gerekli." };
  const price = parseFloat(priceStr ?? "");
  if (Number.isNaN(price) || price < 0) return { ok: false, error: "Please enter a valid price (USD)." };
  const stock = Math.max(0, parseInt(stockStr ?? "0", 10) || 0);

  try {
    const supabase = createServerClient();
    let image_url: string | null = null;

    if (file && file.size > 0) {
      try {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });

        if (uploadError) {
          console.error("upload error:", uploadError);
          return {
            ok: false,
            error:
              "Resim yüklenemedi: " +
              uploadError.message +
              " (Supabase Storage'da 'product-images' bucket'ı oluşturduğunuzdan emin olun.)",
          };
        }
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
        image_url = urlData.publicUrl;
      } catch (uploadErr) {
        console.error("upload exception:", uploadErr);
        return {
          ok: false,
          error:
            "Resim yüklenirken hata. Storage bucket 'product-images' var mı kontrol edin. " +
            (uploadErr instanceof Error ? uploadErr.message : ""),
        };
      }
    }

    const { error } = await supabase.from("products").insert({
      name: name.trim(),
      description: description?.trim() || null,
      price,
      image_url,
      category: category.trim() || "Diğer",
      stock,
    });

    if (error) {
      console.error("createProduct error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    console.error("createProduct exception:", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Beklenmeyen hata. Konsolu kontrol edin.",
    };
  }
}

export async function updateProductStock(id: string, stock: number) {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "unauthorized" };
  }
  const value = Math.max(0, Math.floor(stock));
  const supabase = createServerClient();
  const { error } = await supabase
    .from("products")
    .update({ stock: value })
    .eq("id", id);

  if (error) {
    console.error("updateProductStock error:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function decreaseProductStock(
  productId: string,
  quantity: number
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServerClient();
    const { data: row } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();
    if (!row) return { ok: false, error: "Ürün bulunamadı." };
    const newStock = Math.max(0, (Number(row.stock) ?? 0) - quantity);
    const { error } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", productId);
    if (error) {
      console.error("decreaseProductStock error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (e) {
    console.error("decreaseProductStock exception:", e);
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "unauthorized" };
  }

  const supabase = createServerClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("deleteProduct error:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
