"use client";

import * as React from "react";
import Link from "next/link";
import { getTeamMembers } from "@/app/actions/team";
import type { TeamMemberRow } from "@/lib/types/team";
import { Card } from "@/components/ui/card";
import { Users, Loader2 } from "lucide-react";

export default function EkibimizPage() {
  const [members, setMembers] = React.useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getTeamMembers()
      .then((res) => {
        if (res.ok && res.members) setMembers(res.members);
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
          Ekibimizi tanıyın. Fotoğrafa tıklayarak kişi hakkında detayları görebilirsiniz.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/30 py-16 text-center">
          <Users className="size-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Henüz ekip üyesi eklenmemiş.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {members.map((member) => (
            <Link key={member.id} href={`/ekibimiz/${member.id}`}>
              <Card className="card-hover h-full overflow-hidden border-border transition-all focus-visible:ring-2 focus-visible:ring-primary">
                <div className="aspect-[3/4] relative bg-muted">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="size-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground">
                      <Users className="size-16" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                    <p className="font-semibold text-white drop-shadow-sm">
                      {member.name}
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
