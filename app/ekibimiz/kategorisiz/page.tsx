import Link from "next/link";
import { getTeamMembersUncategorized } from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, ArrowLeft } from "lucide-react";

export default async function KategorisizPage() {
  const membersRes = await getTeamMembersUncategorized();
  const members = membersRes.ok ? membersRes.members : [];

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="mb-6 gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link href="/ekibimiz">
          <ArrowLeft className="size-4" />
          Ekibimize geri dön
        </Link>
      </Button>

      <div className="mb-10">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Kategorisiz
        </h1>
        <p className="text-muted-foreground">
          Kategorisi olmayan ekip üyeleri. Üyelere tıklayarak detaylarını görebilirsiniz.
        </p>
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/30 py-16 text-center">
          <Users className="size-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Kategorisiz üye yok.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {members.map((member) => (
            <Link key={member.id} href={`/ekibimiz/uye/${member.id}`}>
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
