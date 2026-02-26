'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Film } from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    }
  };

  return (
    <div className="bg-[#1F1F1F]/80 backdrop-blur-sm border border-[#333] rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Film className="text-[#E50914]" size={32} />
          <h1 className="text-3xl font-extrabold tracking-wider text-white">CINEMATE</h1>
        </div>
        <p className="text-[#B3B3B3]">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-[#E50914]/10 border border-[#E50914]/30 rounded-lg p-3 text-sm text-[#E50914]">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={18} />}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={18} />}
        />

        <Button type="submit" loading={isLoading} className="w-full" size="lg">
          Sign In
        </Button>
      </form>

      <p className="text-center text-[#808080] text-sm mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-[#E50914] hover:underline font-medium">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
