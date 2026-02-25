import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';

export const metadata: Metadata = {
  title: {
    default: 'Epstein Files Database',
    template: '%s | Epstein Files Database',
  },
  description:
    'A searchable database of people, events, and connections from the Epstein public record — compiled from EFTA releases, court documents, and published journalism.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-surface">
      <body className="bg-surface text-text-primary min-h-screen">
        <Navbar />
        <DisclaimerBanner />
        <main className="pt-14 min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
