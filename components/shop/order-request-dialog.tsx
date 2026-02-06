"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/cart-context";
import { createNormalOrder } from "@/app/actions/orders";
import { toast } from "sonner";

interface OrderRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderRequestDialog({ open, onOpenChange }: OrderRequestDialogProps) {
  const { items, clearCart, totalPrice } = useCart();
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Sepetiniz boş.");
      return;
    }
    setIsSubmitting(true);
    const result = await createNormalOrder({
      customer_name: fullName,
      phone,
      address,
      items: {
        products: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
        })),
        totalPrice,
      },
    });
    setIsSubmitting(false);
    if (!result.ok) {
      toast.error(result.error ?? "Sipariş gönderilemedi.");
      return;
    }
    toast.success("Sipariş talebiniz alındı.");
    clearCart();
    setFullName("");
    setPhone("");
    setAddress("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sipariş Talebi Oluştur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="fullName">İsim Soyisim</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Adınız Soyadınız"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefon Numarası</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="05XX XXX XX XX"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Açık Adres</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Teslimat adresi"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              İptal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Gönderiliyor…" : "Gönder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
