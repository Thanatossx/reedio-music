"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ProductImage } from "@/components/shop/product-image";
import { useCart } from "@/contexts/cart-context";
import { getProducts } from "@/app/actions/products";
import type { Product } from "@/lib/types/shop";
import { ShoppingCart, PackageSearch, Loader2 } from "lucide-react";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function ShopPage() {
  const { addItem } = useCart();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getProducts().then((res) => {
      if (res.ok) {
        const list = res.products.map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          image: p.image_url ?? "guitar",
          category: p.category,
          stock: Number(p.stock) ?? 0,
        }));
        const inStock = list.filter((p) => p.stock > 0);
        const outOfStock = list.filter((p) => p.stock === 0);
        setProducts([...inStock, ...outOfStock]);
      }
      setLoading(false);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Mağaza
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Enstrümanlar ve ekipmanlar. Sepete ekleyip sipariş talebi oluşturabilirsiniz.
        </p>
        <div className="mt-6">
          <Button variant="outline" asChild className="gap-2 rounded-xl">
            <Link href="/custom-order">
              <PackageSearch className="size-4" />
              Özel Tedarik İsteği
            </Link>
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-muted-foreground">Henüz ürün yok. Yakında eklenecek.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const outOfStock = (product.stock ?? 0) === 0;
            return (
              <Card
                key={product.id}
                className={`flex flex-col overflow-hidden ${outOfStock ? "opacity-60" : "card-hover"}`}
              >
                <CardHeader className="p-0 overflow-hidden rounded-t-2xl">
                  <ProductImage product={product} className="rounded-t-2xl rounded-b-none" />
                </CardHeader>
                <CardContent className="flex-1 space-y-2 pt-5 px-6">
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">
                    {product.category}
                  </p>
                  <h2 className="font-semibold text-foreground leading-tight">{product.name}</h2>
                  <p className="text-lg font-semibold text-foreground">
                    {formatPrice(product.price)}
                  </p>
                  {outOfStock && (
                    <p className="text-sm text-muted-foreground">Stokta yok</p>
                  )}
                </CardContent>
                <CardFooter className="pt-0 px-6 pb-6">
                  <Button
                    className="w-full gap-2 rounded-xl"
                    onClick={() => addItem(product)}
                    disabled={outOfStock}
                  >
                    <ShoppingCart className="size-4" />
                    {outOfStock ? "Stokta yok" : "Sepete Ekle"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
