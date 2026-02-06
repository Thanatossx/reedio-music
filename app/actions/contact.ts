"use server";

import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { ContactMessageRow } from "@/lib/types/contact";

const ADMIN_COOKIE = "admin_session";

export async function createContactMessage(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { ok: false, error: "Ad, e-posta ve mesaj zorunludur." };
  }

  const supabase = createServerClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
  });

  if (error) {
    console.error("createContactMessage error:", error);
    return { ok: false, error: error.message };
  }
  return { ok: true };
}

export async function getContactMessages(): Promise<
  { ok: true; messages: ContactMessageRow[] } | { ok: false; error: string; messages: null }
> {
  const cookieStore = await cookies();
  if (!cookieStore.get(ADMIN_COOKIE)?.value) {
    return { ok: false, error: "unauthorized", messages: null };
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("id, name, email, message, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getContactMessages error:", error);
    return { ok: false, error: error.message, messages: null };
  }
  return { ok: true, messages: data ?? [] };
}
