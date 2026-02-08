"use client";

import * as React from "react";
import Link from "next/link";
import { getTeamCategories, getTeamMembersUncategorized } from "@/app/actions/team";
import type { TeamCategoryRow, TeamMemberRow, TeamSection } from "@/lib/types/team";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Loader2 } from "lucide-react";

const SECTION_LABELS: Record<TeamSection, string> = {
  yonetim: "Yönetim Ekibi",
  sanatci: "Sanatçılar",
};

function SectionGrid({
  items,
}: {
  items: Array<{ type: "member"; data: TeamMemberRow } | { type: "category"; data: TeamCategoryRow }>;
}) {
  if (items.length === 0) return null;

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map((item) =>
        item.type === "member" ? (
          <Link key={`m-${item.data.id}`} href={`/ekibimiz/uye/${item.data.id}`}>
            <Card className="card-hover h-full overflow-hidden border-border transition-all focus-visible:ring-2 focus-visible:ring-primary">
              <div className="aspect-[3/4] relative bg-muted">
                {item.data.image_url ? (
                  <img
                    src={item.data.image_url}
                    alt={item.data.name}
                    className="size-full object-cover object-center"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <Users className="size-16" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                  <p className="font-semibold text-white drop-shadow-sm">{item.data.name}</p>
                </div>
              </div>
            </Card>
          </Link>
        ) : (
          <Link key={`c-${item.data.id}`} href={`/ekibimiz/kategori/${item.data.id}`}>
            <Card className="card-hover h-full overflow-hidden border-border transition-all focus-visible:ring-2 focus-visible:ring-primary">
              <div className="aspect-[3/4] relative bg-muted">
                {item.data.image_url ? (
                  <img
                    src={item.data.image_url}
                    alt={item.data.name}
                    className="size-full object-cover object-center"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <Users className="size-16" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                  <p className="font-semibold text-white drop-shadow-sm">{item.data.name}</p>
                </div>
              </div>
            </Card>
          </Link>
        )
      )}
    </div>
  );
}

export default function EkibimizPage() {
  const [categories, setCategories] = React.useState<TeamCategoryRow[]>([]);
  const [uncategorizedMembers, setUncategorizedMembers] = React.useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const loadData = React.useCallback(() => {
    setFetchError(null);
    setLoading(true);
    Promise.all([getTeamCategories(), getTeamMembersUncategorized()])
      .then(([catRes, memRes]) => {
        if (catRes.ok && catRes.categories) setCategories(catRes.categories);
        if (memRes.ok && memRes.members) setUncategorizedMembers(memRes.members);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setFetchError(err?.message === "Failed to fetch" ? "Bağlantı kurulamadı. Aşağıdaki maddeleri kontrol edin." : (err?.message || "Bir hata oluştu."));
      });
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const yonetimMembers = uncategorizedMembers.filter((m) => m.section === "yonetim");
  const sanatciMembers = uncategorizedMembers.filter((m) => m.section === "sanatci");
  const yonetimCategories = categories.filter((c) => c.section === "yonetim");
  const sanatciCategories = categories.filter((c) => c.section === "sanatci");
  const yonetimItems = React.useMemo(() => {
    const a = yonetimMembers.map((data) => ({ type: "member" as const, data }));
    const b = yonetimCategories.map((data) => ({ type: "category" as const, data }));
    return [...a, ...b].sort(
      (x, y) => (x.data.sort_order ?? 0) - (y.data.sort_order ?? 0)
    );
  }, [yonetimMembers, yonetimCategories]);
  const sanatciItems = React.useMemo(() => {
    const a = sanatciMembers.map((data) => ({ type: "member" as const, data }));
    const b = sanatciCategories.map((data) => ({ type: "category" as const, data }));
    return [...a, ...b].sort(
      (x, y) => (x.data.sort_order ?? 0) - (y.data.sort_order ?? 0)
    );
  }, [sanatciMembers, sanatciCategories]);
  const hasContent = uncategorizedMembers.length > 0 || categories.length > 0;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ekibimiz
        </h1>
        <p className="text-muted-foreground break-words">
          Yönetim ekibimiz ve sanatçılarımız. Kategorisiz üyeler ile gruplar aynı alanda; gruplara tıklayarak o gruptaki üyeleri görebilirsiniz.
        </p>
      </div>

      {fetchError ? (
        <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-6 text-center">
          <p className="mb-2 font-medium text-destructive">{fetchError}</p>
          <ul className="mb-4 list-inside list-disc text-left text-sm text-muted-foreground">
            <li>İnternet bağlantınızı kontrol edin.</li>
            <li>Yerelde çalışıyorsanız: <code className="rounded bg-muted px-1">npm run dev</code> çalışıyor mu?</li>
            <li>Vercel’de ise: Proje → Settings → Environment Variables içinde <code className="rounded bg-muted px-1">NEXT_PUBLIC_SUPABASE_URL</code> ve <code className="rounded bg-muted px-1">SUPABASE_SERVICE_ROLE_KEY</code> tanımlı mı?</li>
          </ul>
          <Button variant="outline" size="sm" onClick={loadData}>
            Tekrar dene
          </Button>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-12">
          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              {SECTION_LABELS.yonetim}
            </h2>
            <SectionGrid items={yonetimItems} />
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              {SECTION_LABELS.sanatci}
            </h2>
            <SectionGrid items={sanatciItems} />
          </section>

          {!loading && !hasContent && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/30 py-16 text-center">
              <Users className="size-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Henüz ekip üyesi veya grup eklenmemiş.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
