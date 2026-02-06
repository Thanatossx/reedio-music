import type { Product } from "@/lib/types/shop";

export const products: Product[] = [
  { id: "1", name: "Klasik Gitar", price: 2499, image: "guitar", category: "Gitar" },
  { id: "2", name: "Elektro Gitar", price: 4599, image: "guitar", category: "Gitar" },
  { id: "3", name: "Bas Gitar", price: 3299, image: "guitar", category: "Gitar" },
  { id: "4", name: "Kondenser Mikrofon", price: 1899, image: "mic", category: "Mikrofon" },
  { id: "5", name: "Dinamik Vokal Mikrofon", price: 899, image: "mic", category: "Mikrofon" },
  { id: "6", name: "USB Stüdyo Mikrofon", price: 1299, image: "mic", category: "Mikrofon" },
  { id: "7", name: "MIDI Klavye 49 Tuş", price: 2199, image: "keyboard", category: "Klavye" },
  { id: "8", name: "Kulaklık (Stüdyo)", price: 1499, image: "headphones", category: "Kulaklık" },
  { id: "9", name: "Hoparlör Monitör (Tek)", price: 3499, image: "monitor", category: "Hoparlör" },
];
