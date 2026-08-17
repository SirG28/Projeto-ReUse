"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

const MESSAGES: Record<string, string> = {
  published: "Item publicado com sucesso!",
};

export default function ToastFromQuery() {
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = searchParams.get("toast");

  useEffect(() => {
    if (!toast) return;
    const message = MESSAGES[toast];
    if (message) showToast(message);
    router.replace("/home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  return null;
}
