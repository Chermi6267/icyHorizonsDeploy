import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Icy Horizons | Вход",
  description:
    "Войдите в систему, чтобы получить доступ к полному функционалу платформы Icy Horizons",
};

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
