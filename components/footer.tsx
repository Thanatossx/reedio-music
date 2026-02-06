import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { CopyablePhone } from "@/components/copyable-phone";
import { CONTACT_INFO } from "@/lib/contact-info";

const footerLinks = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/ekibimiz", label: "Ekibimiz" },
  { href: "/shop", label: "Mağaza" },
  { href: "/iletisim", label: "İletişim" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Marka */}
          <div className="space-y-4">
            <Logo href="/" showText />
            <p className="text-sm text-muted-foreground max-w-xs">
              Stüdyo kayıt, prodüksiyon ve müzik enstrümanları. Sesinizi keşfedin.
            </p>
          </div>

          {/* Sayfalar */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Sayfalar</h3>
            <ul className="space-y-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">İletişim</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary/80" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary/80" />
                <CopyablePhone
                  phone={CONTACT_INFO.phone}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-left"
                />
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary/80" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-foreground transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Sosyal */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Sosyal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href={CONTACT_INFO.social.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href={CONTACT_INFO.social.facebrowser}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Facebrowser
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Reedio Music. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
