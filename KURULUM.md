# Reedio Music – Shadcn/UI ve Bağımlılık Kurulumu

Proje kökünde (reedio-music klasöründe) terminali açıp aşağıdaki komutları **sırayla** çalıştırın.

## 1. Lucide React (ikonlar)
```bash
npm install lucide-react
```

## 2. Shadcn/UI başlatma (ilk kez)
```bash
npx shadcn@latest init
```
- **Style:** New York  
- **Base color:** Neutral (veya Zinc)  
- **CSS variables:** Yes  
- **Tailwind config:** Projede Tailwind v4 kullanılıyor; `config` boş bırakılabilir veya `tailwind.config.ts` yolu verilebilir.  
- **Import alias:** `@/*` (mevcut tsconfig ile uyumlu)

Not: Zaten `components.json` ve `lib/utils.ts` oluşturulduysa init adımını atlayıp doğrudan bileşen ekleyebilirsiniz.

## 3. Gerekli Shadcn bileşenlerini ekleme
```bash
npx shadcn@latest add button card input sheet dropdown-menu
```

## 4. Tema için next-themes (Dark/Light mode)
```bash
npm install next-themes
```

---

**Tek satırda (init sonrası):**
```bash
npm install lucide-react next-themes
npx shadcn@latest add button card input sheet dropdown-menu
```
