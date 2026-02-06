"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createCustomRequest } from "@/app/actions/orders";
import { ArrowLeft } from "lucide-react";

const CATEGORIES = [
  "Gitar",
  "Piyano",
  "Stüdyo Ekipmanı",
  "Mikrofon",
  "Klavye / MIDI",
  "Bas Gitar",
  "Amplifikatör",
  "Kulaklık",
  "Hoparlör",
  "Diğer",
];

export default function CustomOrderPage() {
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [productDetail, setProductDetail] = React.useState("");
  const [budgetRange, setBudgetRange] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await createCustomRequest({
      customer_name: fullName,
      phone,
      category,
      productDetail,
      budgetRange: budgetRange || undefined,
    });
    setIsSubmitting(false);
    if (!result.ok) {
      toast.error(result.error ?? "Talep gönderilemedi.");
      return;
    }
    toast.success(
      "Talebiniz alındı, ekibimiz tedarik için size dönüş yapacaktır."
    );
    setFullName("");
    setPhone("");
    setCategory("");
    setProductDetail("");
    setBudgetRange("");
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/shop"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Mağazaya dön
      </Link>
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Özel Tedarik İsteği
        </h1>
        <p className="text-muted-foreground">
          Mağazada bulunmayan bir ürünü talep etmek için formu doldurun.
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">İsim Soyisim</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Adınız Soyadınız"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">İletişim Bilgisi (Telefon)</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05XX XXX XX XX"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          >
            <option value="">Kategori seçin</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="productDetail">Ürün Marka / Model Detayı</Label>
          <Textarea
            id="productDetail"
            value={productDetail}
            onChange={(e) => setProductDetail(e.target.value)}
            placeholder="İstediğiniz ürünün markası, modeli veya detaylarını yazın"
            rows={4}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budgetRange">Bütçe Aralığı (Opsiyonel)</Label>
          <Input
            id="budgetRange"
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            placeholder="e.g. $500 - $1,000"
          />
        </div>
        <Button type="submit" className="w-full rounded-xl" disabled={isSubmitting}>
          {isSubmitting ? "Gönderiliyor…" : "Talebi Gönder"}
        </Button>
        </form>
      </div>
    </div>
  );
}
