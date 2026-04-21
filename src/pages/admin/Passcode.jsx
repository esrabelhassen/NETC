import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';

export default function PasscodePage({ initialAttemptsLeft, maxAttempts = 4, errorMessage }) {
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(initialAttemptsLeft ?? maxAttempts);
  const { checkAppState } = useAuth();

  const lockedOut = attemptsLeft !== null && attemptsLeft <= 0;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (lockedOut || !passcode.trim()) return;
    setLoading(true);
    setError('');
    try {
      const payload = await base44.auth.loginWithPasscode(passcode.trim());
      setAttemptsLeft(payload.attemptsLeft ?? maxAttempts);
      await checkAppState();
    } catch (err) {
      setError(err.message || 'Invalid passcode');
      if (err.data?.attemptsLeft !== undefined) {
        setAttemptsLeft(err.data.attemptsLeft);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-background/80 p-10 text-center shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground mb-6">Admin</p>
        <h1 className="text-3xl font-semibold text-foreground mb-2">Passcode required</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Enter the secret passcode to access the CMS. You have {lockedOut ? 0 : attemptsLeft} of {maxAttempts} attempts remaining.
        </p>
        {errorMessage && (
          <p className="text-xs text-destructive mb-4">{errorMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Passcode"
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            className="rounded-2xl border-border/50 bg-secondary/5 text-foreground"
            disabled={lockedOut}
          />
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-accent to-accent/80 text-accent-foreground"
            disabled={loading || lockedOut}
          >
            {loading ? 'Verifying...' : lockedOut ? 'Locked' : 'Continue'}
          </Button>
        </form>

        {lockedOut && (
          <p className="mt-6 text-xs text-muted-foreground">
            Too many failed attempts. Wait a moment and try again.
          </p>
        )}
      </div>
    </div>
  );
}
