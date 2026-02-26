'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useWatchlist } from '@/hooks/use-watchlist';
import { Bookmark, Heart, Star, LogOut, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isLoading, signOut } = useAuth();
  const { watchlist } = useWatchlist();

  const handleSignOut = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) return;
    await signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="text-[#E50914] animate-spin" size={32} />
      </div>
    );
  }

  const displayName = profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <div className="px-4 lg:px-8 py-6 max-w-2xl mx-auto">
      {/* Avatar & Info */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-[#E50914] flex items-center justify-center text-4xl font-bold text-white mb-4">
          {initials}
        </div>
        <h1 className="text-2xl font-extrabold text-white">{displayName}</h1>
        {profile?.username && (
          <p className="text-[#808080] text-sm">@{profile.username}</p>
        )}
        <p className="text-[#B3B3B3] text-sm mt-1">{user?.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon: Heart, label: 'Favorites', count: 0 },
          { icon: Bookmark, label: 'Watchlist', count: watchlist.length },
          { icon: Star, label: 'Reviews', count: 0 },
        ].map(({ icon: Icon, label, count }) => (
          <div key={label} className="bg-[#1F1F1F] border border-[#333] rounded-xl p-4 text-center">
            <Icon size={20} className="text-[#E50914] mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{count}</p>
            <p className="text-[#808080] text-xs">{label}</p>
          </div>
        ))}
      </div>

      {/* Sign Out */}
      <Button variant="outline" className="w-full" onClick={handleSignOut}>
        <LogOut size={18} />
        Sign Out
      </Button>
    </div>
  );
}
