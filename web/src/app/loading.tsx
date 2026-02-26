import { Film } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#141414]">
      <Film className="text-[#E50914] animate-pulse" size={48} />
      <p className="text-[#B3B3B3] mt-4 text-sm">Loading...</p>
    </div>
  );
}
