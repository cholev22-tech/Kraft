export const metadata = {
  title: "Крафт Оферти Pro",
  description: "Система за оферти на Крафт Сервиз",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>{children}</body>
    </html>
  );
}
