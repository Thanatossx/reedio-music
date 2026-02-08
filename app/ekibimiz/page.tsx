"use client";

import * as React from "react";
import Link from "next/link";
import { getTeamCategories } from "@/app/actions/team";
import type { TeamCategoryRow } from "@/lib/types/team";
import { Card } from "@/components/ui/card";
import { Users, Loader2 } from "lucide-react";

export default function EkibimizPage() {
  const [categories, setCategories] = React.useState<TeamCategoryRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getTeamCategories()
      .then((res) => {
        if (res.ok && res.categories) setCategories(res.categories);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ekibimiz
        </h1>
        <p className="text-muted-foreground break-words">
          Müzik gruplarımızı ve ekip üyelerimizi tanıyın. Bir kategoriye tıklayarak o gruptaki üyeleri görün, ardından istediğiniz kişiye tıklayarak detaylarına ulaşın.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/30 py-16 text-center">
          <Users className="size-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Henüz kategori eklenmemiş.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/ekibimiz/kategori/${category.id}`}>
              <Card className="card-hover h-full overflow-hidden border-border transition-all focus-visible:ring-2 focus-visible:ring-primary">
                <div className="aspect-[3/4] relative bg-muted">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="size-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <Users className="size-16" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                    <p className="font-semibold text-white drop-shadow-sm">
                      {category.name}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
