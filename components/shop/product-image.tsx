import Image from "next/image";
import { Guitar, Mic, Piano, Headphones, Speaker } from "lucide-react";
import type { Product } from "@/lib/types/shop";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  guitar: Guitar,
  mic: Mic,
  keyboard: Piano,
  headphones: Headphones,
  monitor: Speaker,
};

export function ProductImage({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const isUrl = product.image?.startsWith("http");
  if (isUrl) {
    return (
      <div
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-lg bg-muted",
          className
        )}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
    );
  }
  const Icon = iconMap[product.image] ?? Guitar;
  return (
    <div
      className={cn(
        "flex aspect-square w-full items-center justify-center rounded-lg bg-muted text-muted-foreground",
        className
      )}
    >
      <Icon className="size-16 md:size-20" />
    </div>
  );
}
