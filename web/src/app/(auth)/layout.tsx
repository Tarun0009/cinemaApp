export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/10 via-[#141414] to-[#141414]" />
      <div className="relative z-10 w-full max-w-md mx-4">{children}</div>
    </div>
  );
}
