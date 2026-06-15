import "./globals.css";

export const metadata = {
  title: "Paprika Smart Meal Planner",
  description: "Import recipes from Paprika",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
