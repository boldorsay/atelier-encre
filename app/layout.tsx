import React from "react";
import "./globals.css";  // Créez ce fichier si vous ne l'avez pas

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="container mx-auto px-4 py-8">
        {children}
      </body>
    </html>
  );
}
