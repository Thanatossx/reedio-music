import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music, Mic2, ShoppingBag } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-10 px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Stüdyo · Prodüksiyon · Mağaza
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
              Reedio Music
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Stüdyo kayıt, prodüksiyon ve müzik enstrümanlarıyla sesinizi
            keşfedin. Profesyonel ses ve enstrüman çözümleri.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="btn-interactive gap-2 rounded-xl px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30">
              <Link href="/hakkimizda">
                <Music className="size-5" />
                Stüdyoyu İncele
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="btn-interactive gap-2 rounded-xl border-2 px-8"
            >
              <Link href="/shop">
                <ShoppingBag className="size-5" />
                Mağazaya Git
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Kısa hizmet özeti */}
      <section className="border-t border-border bg-card/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div className="space-y-3 rounded-2xl p-6 transition-colors hover:bg-muted/50">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Music className="size-6" />
              </div>
              <h2 className="font-semibold text-foreground">Prodüksiyon</h2>
              <p className="text-sm text-muted-foreground">
                Kayıt ve mix. Profesyonel stüdyo hizmeti.
              </p>
            </div>
            <div className="space-y-3 rounded-2xl p-6 transition-colors hover:bg-muted/50">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mic2 className="size-6" />
              </div>
              <h2 className="font-semibold text-foreground">Menajerlik</h2>
              <p className="text-sm text-muted-foreground">
                Sanatçı yönetimi ve organizasyon.
              </p>
            </div>
            <div className="space-y-3 rounded-2xl p-6 transition-colors hover:bg-muted/50">
              <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShoppingBag className="size-6" />
              </div>
              <h2 className="font-semibold text-foreground">Enstrüman</h2>
              <p className="text-sm text-muted-foreground">
                Gitar, mikrofon, ekipman satışı.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
