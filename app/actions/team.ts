"use server";

import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import type { TeamCategoryRow, TeamMemberRow } from "@/lib/types/team";

const ADMIN_COOKIE = "admin_session";
const BUCKET = "team-images";

async function requireAdmin() {
  const cookieStore = await cookies();
  if (!cookieStore.get(ADMIN_COOKIE)?.value) {
    throw new Error("unauthorized");
  }
}

export async function getTeamCategories(): Promise<
  { ok: true; categories: TeamCategoryRow[] } | { ok: false; error: string }
> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("team_categories")
      .select("id, name, image_url, sort_order, created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("getTeamCategories error:", error);
      return { ok: false, error: String(error.message) };
    }
    const list = Array.isArray(data) ? data : [];
    return { ok: true, categories: list.map((c) => ({
      id: String(c.id),
      name: String(c.name ?? ""),
      image_url: c.image_url != null ? String(c.image_url) : null,
      sort_order: Number(c.sort_order) ?? 0,
      created_at: String(c.created_at ?? ""),
    })) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function getTeamMembers(): Promise<
  { ok: true; members: TeamMemberRow[] } | { ok: false; error: string }
> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("id, name, image_url, bio, sort_order, category_id, created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("getTeamMembers error:", error);
      return { ok: false, error: String(error.message) };
    }
    const members = Array.isArray(data) ? data : [];
    return { ok: true, members: members.map((m) => ({
      id: String(m.id),
      name: String(m.name ?? ""),
      image_url: m.image_url != null ? String(m.image_url) : null,
      bio: m.bio != null ? String(m.bio) : null,
      sort_order: Number(m.sort_order) ?? 0,
      category_id: m.category_id != null ? String(m.category_id) : null,
      created_at: String(m.created_at ?? ""),
    })) };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: String(message) };
  }
}

export async function getTeamMembersByCategory(categoryId: string): Promise<
  { ok: true; members: TeamMemberRow[] } | { ok: false; error: string }
> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("id, name, image_url, bio, sort_order, category_id, created_at")
      .eq("category_id", categoryId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("getTeamMembersByCategory error:", error);
      return { ok: false, error: String(error.message) };
    }
    const members = Array.isArray(data) ? data : [];
    return { ok: true, members: members.map((m) => ({
      id: String(m.id),
      name: String(m.name ?? ""),
      image_url: m.image_url != null ? String(m.image_url) : null,
      bio: m.bio != null ? String(m.bio) : null,
      sort_order: Number(m.sort_order) ?? 0,
      category_id: m.category_id != null ? String(m.category_id) : null,
      created_at: String(m.created_at ?? ""),
    })) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function getTeamCategoryById(id: string): Promise<
  { ok: true; category: TeamCategoryRow } | { ok: false; error: string }
> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("team_categories")
      .select("id, name, image_url, sort_order, created_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Bulunamadı." };
    }
    return {
      ok: true,
      category: {
        id: String(data.id),
        name: String(data.name ?? ""),
        image_url: data.image_url != null ? String(data.image_url) : null,
        sort_order: Number(data.sort_order) ?? 0,
        created_at: String(data.created_at ?? ""),
      },
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function getTeamMemberById(
  id: string
): Promise<{ ok: true; member: TeamMemberRow } | { ok: false; error: string }> {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("team_members")
      .select("id, name, image_url, bio, sort_order, category_id, created_at")
      .eq("id", id)
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message ?? "Bulunamadı." };
    }
    const member: TeamMemberRow = {
      id: String(data.id),
      name: String(data.name ?? ""),
      image_url: data.image_url != null ? String(data.image_url) : null,
      bio: data.bio != null ? String(data.bio) : null,
      sort_order: Number(data.sort_order) ?? 0,
      category_id: data.category_id != null ? String(data.category_id) : null,
      created_at: String(data.created_at ?? ""),
    };
    return { ok: true, member };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Unknown error",
    };
  }
}

export async function createTeamMember(formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Yetkisiz. Lütfen tekrar giriş yapın." };
  }

  let name: string;
  let bio: string | null;
  let categoryId: string | null;
  let file: File | null;
  try {
    name = (formData.get("name") as string)?.trim() ?? "";
    bio = (formData.get("bio") as string)?.trim() || null;
    categoryId = (formData.get("category_id") as string)?.trim() || null;
    file = formData.get("image") as File | null;
  } catch {
    return { ok: false, error: "Form verisi okunamadı." };
  }

  if (!name) return { ok: false, error: "İsim gerekli." };
  if (!categoryId) return { ok: false, error: "Kategori seçin." };
  if (!file || typeof file.size !== "number" || file.size === 0) {
    return { ok: false, error: "Fotoğraf gerekli (3:4 oran önerilir)." };
  }

  try {
    const supabase = createServerClient();
    const fileName = String(file.name || "");
    const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("team image upload error:", uploadError);
      return {
        ok: false,
        error: "Fotoğraf yüklenemedi: " + String(uploadError.message) + " (Supabase’de 'team-images' bucket’ı oluşturdunuz mu?)",
      };
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const image_url = urlData.publicUrl;

    const { error } = await supabase.from("team_members").insert({
      name,
      image_url,
      bio,
      sort_order: 0,
      category_id: categoryId,
    });

    if (error) {
      console.error("createTeamMember error:", error);
      return {
        ok: false,
        error: "Kayıt eklenemedi: " + String(error.message) + " (Supabase’de team_members tablosu ve SQL şeması güncel mi?)",
      };
    }
    return { ok: true };
  } catch (e) {
    console.error("createTeamMember exception:", e);
    return {
      ok: false,
      error: String(e instanceof Error ? e.message : "Beklenmeyen hata."),
    };
  }
}

export async function createTeamCategory(formData: FormData) {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Yetkisiz. Lütfen tekrar giriş yapın." };
  }

  const name = (formData.get("name") as string)?.trim() ?? "";
  const file = formData.get("image") as File | null;

  if (!name) return { ok: false, error: "Kategori adı gerekli." };
  if (!file || typeof file.size !== "number" || file.size === 0) {
    return { ok: false, error: "Fotoğraf gerekli (3:4 oran önerilir)." };
  }

  try {
    const supabase = createServerClient();
    const fileName = String(file.name || "");
    const ext = fileName.split(".").pop()?.toLowerCase() || "jpg";
    const path = `category-${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      console.error("category image upload error:", uploadError);
      return {
        ok: false,
        error: "Fotoğraf yüklenemedi: " + String(uploadError.message),
      };
    }

    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const image_url = urlData.publicUrl;

    const { error } = await supabase.from("team_categories").insert({
      name,
      image_url,
      sort_order: 0,
    });

    if (error) {
      console.error("createTeamCategory error:", error);
      return { ok: false, error: String(error.message) };
    }
    return { ok: true };
  } catch (e) {
    console.error("createTeamCategory exception:", e);
    return {
      ok: false,
      error: String(e instanceof Error ? e.message : "Beklenmeyen hata."),
    };
  }
}

export async function deleteTeamCategory(id: string) {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Yetkisiz." };
  }
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("team_categories").delete().eq("id", id);
    if (error) {
      console.error("deleteTeamCategory error:", error);
      return { ok: false, error: String(error.message) };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Beklenmeyen hata.",
    };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Yetkisiz." };
  }
  try {
    const supabase = createServerClient();
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (error) {
      console.error("deleteTeamMember error:", error);
      return { ok: false, error: String(error.message) };
    }
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Beklenmeyen hata.",
    };
  }
}
