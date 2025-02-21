import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Icy Horizons | О нас",
  description: "Авторы Icy Horizons",
};

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
