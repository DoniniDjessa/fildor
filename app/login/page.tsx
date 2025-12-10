'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const loginSchema = z.object({
  pseudo: z.string().min(1, 'Le pseudo est requis'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);

    try {
      // Automatically add @tip.local if not present
      const email = data.pseudo.includes('@') ? data.pseudo : `${data.pseudo}@tip.local`;
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: data.password,
      });

      if (authError) {
        setError('Identifiants incorrects');
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Wait a bit for cookies to be set
        await new Promise(resolve => setTimeout(resolve, 100));
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-rose-100 dark:border-purple-800">
          {/* Logo/Title */}
          <div className="text-center mb-6">
            <h1 className="font-title text-lg font-bold bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent mb-1">
              Fil d&apos;Or
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">Connexion à votre compte</p>
          </div>

          {error && (
            <div className="mb-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
              <p className="text-[10px] text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="pseudo" className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pseudo
              </label>
              <input
                id="pseudo"
                type="text"
                placeholder="votre-pseudo"
                {...register('pseudo')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-rose-200 dark:border-purple-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-pink-500 transition-all"
              />
              {errors.pseudo && (
                <p className="mt-1 text-[10px] text-red-500 dark:text-red-400">{errors.pseudo.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-rose-200 dark:border-purple-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-pink-500 transition-all"
              />
              {errors.password && (
                <p className="mt-1 text-[10px] text-red-500 dark:text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 text-white text-xs font-medium rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

