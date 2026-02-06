import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Headphones,
  Radio,
  Layers,
  Users,
  Mic2,
  Sliders,
  Music2,
  Sparkles,
} from "lucide-react";

export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="hero-gradient border-b border-border pb-16 pt-8">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Hakkımızda
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Reedio Music
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Geleceği dinleyin
          </p>
        </div>
      </section>

      {/* Giriş */}
      <section className="border-b border-border py-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-lg leading-relaxed text-foreground/90">
            Reedio Music, kaybolan gerçek yetenekleri ortaya çıkarmak ve müziğin
            dijital çağdaki yeni frekansı olmak amacıyla kurulmuş, yeni nesil bir
            müzik ve prodüksiyon şirketidir.
          </p>
          <p className="mt-6 text-center leading-relaxed text-muted-foreground">
            Sıradanlığın hüküm sürdüğü bir endüstride &quot;Reedio&quot; ismi sadece bir
            kelime oyunu değil; sanatçının sesini kitlelere parazitsiz ve net
            ulaştıran bir yayın anlayışını temsil eder. Sadece ünlü isimleri değil;
            sokaklarda, stüdyolarda veya evinde kendi ritimlerini yaratan
            keşfedilmemiş cevherleri parlatmayı hedefliyoruz.
          </p>
        </div>
      </section>

      {/* Vizyon ve Misyon */}
      <section className="border-b border-border bg-card/30 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-center gap-3">
            <Headphones className="size-8 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Vizyon ve Misyon
            </h2>
          </div>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Temel felsefemiz <strong className="text-foreground">&quot;Ulaşılabilir Profesyonellik&quot;</strong>tir.
            Kapılarımızı sadece yerleşik sanatçılara değil, potansiyeli yüksek
            herkese açıyoruz.
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-border bg-card/50 transition-colors hover:bg-card">
              <CardContent className="flex gap-4 p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Radio className="size-6" />
                </span>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    Sesin Mimarisi
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Her sanatçının kendine has bir tınısı olduğuna inanıyoruz. Bu
                    tınıyı değiştirmek yerine, en saf ve kaliteli haliyle
                    dinleyiciye sunmak için çalışıyoruz.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50 transition-colors hover:bg-card">
              <CardContent className="flex gap-4 p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Layers className="size-6" />
                </span>
                <div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    Dijital Entegrasyon
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Geleneksel plak şirketi anlayışının ötesinde; dijital
                    yayıncılık, sosyal medya yönetimi ve görsel marka konularında
                    sanatçılarımıza tam destek sağlıyoruz.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hizmetler */}
      <section className="border-b border-border py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-center gap-3">
            <Sliders className="size-8 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Hizmetler ve Stüdyo
            </h2>
          </div>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Bir sanatçının A&apos;dan Z&apos;ye tüm ihtiyaçlarını karşılayacak donanıma sahibiz.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="card-hover flex flex-col border-border">
              <CardContent className="p-6">
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Mic2 className="size-5" />
                </span>
                <h3 className="mb-2 font-semibold text-foreground">
                  Kayıt
                </h3>
                <p className="text-sm text-muted-foreground">
                  Son teknoloji ekipman ve akustik odalarla kristal netliğinde vokal ve enstrüman kayıtları.
                </p>
              </CardContent>
            </Card>
            <Card className="card-hover flex flex-col border-border">
              <CardContent className="p-6">
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sliders className="size-5" />
                </span>
                <h3 className="mb-2 font-semibold text-foreground">
                  Mix & Mastering
                </h3>
                <p className="text-sm text-muted-foreground">
                  Radyo, kulüp ve dijital platform standartlarında ses kalitesi; loudness ve dinamik denge.
                </p>
              </CardContent>
            </Card>
            <Card className="card-hover flex flex-col border-border">
              <CardContent className="p-6">
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Music2 className="size-5" />
                </span>
                <h3 className="mb-2 font-semibold text-foreground">
                  Beat & Aranje
                </h3>
                <p className="text-sm text-muted-foreground">
                  Tarzınıza uygun özgün altyapılar veya mevcut demoların profesyonel düzenlemesi.
                </p>
              </CardContent>
            </Card>
            <Card className="card-hover flex flex-col border-border">
              <CardContent className="p-6">
                <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="size-5" />
                </span>
                <h3 className="mb-2 font-semibold text-foreground">
                  Kariyer Yönetimi
                </h3>
                <p className="text-sm text-muted-foreground">
                  İmaj danışmanlığı, PR, konser rezervasyonları ve yasal hakların korunması.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Neden Reedio + Alıntı */}
      <section className="border-b border-border bg-card/30 py-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-center gap-3">
            <Sparkles className="size-8 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Neden Reedio Music?
            </h2>
          </div>
          <p className="mb-12 text-center leading-relaxed text-muted-foreground">
            Müzik endüstrisi sanatçıları çoğu zaman birer &quot;ürün&quot; olarak görür. Biz
            ise onları birer <strong className="text-foreground">ortak</strong> olarak kabul ediyoruz. Hiyerarşiden uzak,
            yaratıcılığın ve iş birliğinin ön planda olduğu bir aile ortamı
            sunuyoruz.
          </p>
          <blockquote className="relative border-l-4 border-primary pl-6 pr-4 py-4 italic text-foreground/90">
            <span className="absolute -left-1 top-4 text-4xl text-primary/30">&quot;</span>
            <p className="relative text-lg leading-relaxed">
              Müzik sadece duyduğunuz bir şey değildir; hissettiğiniz, yaşadığınız
              ve paylaştığınız bir frekanstır. Biz sadece kayıt tuşuna basmıyoruz,
              geleceği yayınlıyoruz.
            </p>
            <footer className="mt-4 text-sm text-muted-foreground not-italic">
              — Reedio Music
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Gelecek + CTA */}
      <section className="py-16">
        <div className="container mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Gelecek Projeler
          </h2>
          <p className="mb-10 leading-relaxed text-muted-foreground">
            Sadece bir kayıt stüdyosu olmanın ötesine geçerek; canlı performans
            geceleri ve yerel yetenek etkinlikleriyle müzik sahnesine katkıda
            bulunmayı hedefliyoruz.
          </p>
          <Button asChild size="lg" className="rounded-xl gap-2">
            <Link href="/iletisim">
              Bize Ulaşın
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
