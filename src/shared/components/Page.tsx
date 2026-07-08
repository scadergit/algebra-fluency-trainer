import type { ReactNode } from "react";

interface PageProps {
  title: string;
  children: ReactNode;
}

export function Page({
  title,
  children,
}: PageProps) {
  return (
    <>
      <h1 className="mb-8 text-4xl font-bold text-slate-900">
        {title}
      </h1>

      {children}
    </>
  );
}