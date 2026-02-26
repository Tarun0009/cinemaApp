import Navbar from '@/components/navbar';
import MobileNav from '@/components/mobile-nav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#141414]">
      <Navbar />
      <main className="pt-16 pb-20 lg:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}
