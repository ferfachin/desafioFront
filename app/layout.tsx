import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Desafio Front",
  description: "Projeto Desafio Front",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
