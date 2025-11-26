import './globals.css';

export const metadata = {
  title: 'Tech Learning Community',
  description: 'Connect, Learn, Grow Together',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}