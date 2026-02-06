import Link from "next/link";
import { notFound } from "next/navigation";
import { getTeamMemberById } from "@/app/actions/team";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getTeamMemberById(id);

  if (!result.ok || !result.member) {
    notFound();
  }

  const member = result.member;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-3xl">
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

      <article className="space-y-6">
        <div className="aspect-[3/4] w-full max-w-sm mx-auto overflow-hidden rounded-2xl bg-muted">
          {member.image_url ? (
            <img
              src={member.image_url}
              alt={member.name}
              className="size-full object-cover object-center"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-muted-foreground">
              <Users className="size-24" />
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {member.name}
          </h1>
          {member.bio ? (
            <div className="mt-4 w-full break-words">
              <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                {member.bio}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-muted-foreground italic">
              Henüz detay eklenmemiş.
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
