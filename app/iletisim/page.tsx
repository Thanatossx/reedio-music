"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createContactMessage } from "@/app/actions/contact";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Building2, Share2 } from "lucide-react";
import { CONTACT_INFO } from "@/lib/contact-info";
import { CopyablePhone } from "@/components/copyable-phone";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("message", message);
    const result = await createContactMessage(formData);
    setIsSubmitting(false);
    if (result.ok) {
      toast.success("Mesajınız alındı, en kısa sürede dönüş yapacağız.");
      setName("");
      setEmail("");
      setMessage("");
    } else {
      toast.error(result.error ?? "Gönderilemedi.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          İletişim
        </h1>
        <p className="text-muted-foreground">
          Sorularınız veya teklifleriniz için bize ulaşın.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Sol: İletişim bilgileri */}
        <div className="space-y-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-foreground">
            Bize Ulaşın
          </h2>
          <p className="text-sm text-muted-foreground italic">
            ((OOC iletişim kurmak için sitemizde belirtilen Discord adresine katılıp ticket oluşturun lütfen.))
          </p>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-muted-foreground">İsim</p>
                <p className="font-medium text-foreground">{CONTACT_INFO.name}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Adres</p>
                <p className="text-foreground">{CONTACT_INFO.address}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Phone className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Telefon</p>
                <CopyablePhone
                  phone={CONTACT_INFO.phone}
                  className="font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
                />
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Share2 className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sosyal</p>
                <div className="flex flex-wrap gap-3 mt-1">
                  <a
                    href={CONTACT_INFO.social.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-2"
                  >
                    Discord
                  </a>
                  <a
                    href={CONTACT_INFO.social.facebrowser}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-primary transition-colors underline underline-offset-2"
                  >
                    Facebrowser
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Sağ: İletişim formu */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-lg font-semibold text-foreground">
            Mesaj Gönderin
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Ad Soyad</Label>
              <Input
                id="contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Adınız Soyadınız"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">E-posta</Label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Mesaj</Label>
              <Textarea
                id="contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mesajınız..."
                rows={5}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full gap-2 rounded-xl"
              disabled={isSubmitting}
            >
              <Mail className="size-4" />
              {isSubmitting ? "Gönderiliyor…" : "Gönder"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
