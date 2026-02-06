"use client";

import * as React from "react";
import { toast } from "sonner";

interface CopyablePhoneProps {
  phone: string;
  className?: string;
  children?: React.ReactNode;
}

export function CopyablePhone({ phone, className, children }: CopyablePhoneProps) {
  const handleClick = React.useCallback(() => {
    const raw = phone.replace(/\s/g, "");
    navigator.clipboard.writeText(raw).then(
      () => toast.success("Numara kopyalandı"),
      () => toast.error("Kopyalanamadı")
    );
  }, [phone]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      title="Numarayı kopyala"
    >
      {children ?? phone}
    </button>
  );
}
