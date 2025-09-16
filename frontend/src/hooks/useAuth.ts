'use client';

import { useSession, signIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import type { User } from '@/types';

interface SignInParams {
  email: string;
  password: string;
  callbackUrl?: string;
}

interface SignUpParams {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const user = session?.user as User | undefined;
  const isAuthenticated = !!user;
  const isLoading_ = status === 'loading' || isLoading;

  const signInWithCredentials = useCallback(async ({
    email,
    password,
    callbackUrl = '/dashboard/feed'
  }: SignInParams) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        router.push(callbackUrl);
        return { success: true };
      }

      throw new Error('Authentication failed');
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Authentication failed'
      };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const signUp = useCallback(async ({
    username,
    email,
    password,
    displayName,
  }: SignUpParams) => {
    setIsLoading(true);
    try {
      // Call the registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          displayName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Auto sign in after successful registration
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/dashboard/feed');
        return { success: true };
      }

      throw new Error('Registration successful but sign in failed');
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const signOut = useCallback(async (callbackUrl: string = '/') => {
    setIsLoading(true);
    try {
      await nextAuthSignOut({
        redirect: false,
      });
      router.push(callbackUrl);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const updateProfile = useCallback(async (profileData: Partial<User>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Update the session with new data
      await update();
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Update failed'
      };
    } finally {
      setIsLoading(false);
    }
  }, [update]);

  const refreshSession = useCallback(async () => {
    await update();
  }, [update]);

  return {
    user,
    isAuthenticated,
    isLoading: isLoading_,
    signIn: signInWithCredentials,
    signUp,
    signOut,
    updateProfile,
    refreshSession,
    session,
  };
}