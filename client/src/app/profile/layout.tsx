import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Icy Horizons | Профиль",
  description: "Ваш личный профиль Icy Horizons",
};

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
