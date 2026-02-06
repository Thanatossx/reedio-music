"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { ProductImage } from "./product-image";
import { OrderRequestDialog } from "./order-request-dialog";
import { Trash2 } from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function CartSheet() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, cartOpen, setCartOpen } =
    useCart();
  const [orderDialogOpen, setOrderDialogOpen] = React.useState(false);

  return (
    <>
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="flex flex-col">
          <SheetHeader>
            <SheetTitle>Sepet ({totalItems} ürün)</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sepetiniz boş.</p>
            ) : (
              <ul className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <li
                    key={product.id}
                    className="flex gap-3 rounded-lg border border-border p-3"
                  >
                    <ProductImage
                      product={product}
                      className="size-16 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(product.price)} × {quantity}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          type="button"
                          className="text-xs text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            updateQuantity(product.id, quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span className="text-sm">{quantity}</span>
                        <button
                          type="button"
                          className="text-xs text-muted-foreground hover:text-foreground"
                          onClick={() =>
                            updateQuantity(product.id, quantity + 1)
                          }
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="ml-auto text-destructive hover:opacity-80"
                          onClick={() => removeItem(product.id)}
                          aria-label="Kaldır"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {items.length > 0 && (
            <SheetFooter className="flex-col gap-2 border-t border-border pt-4 sm:flex-col">
              <p className="w-full text-right font-semibold">
                Toplam: {formatPrice(totalPrice)}
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  setCartOpen(false);
                  setOrderDialogOpen(true);
                }}
              >
                Sipariş Talebi Oluştur
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
      <OrderRequestDialog
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
      />
    </>
  );
}
