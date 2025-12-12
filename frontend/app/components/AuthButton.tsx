'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

export function AuthButton() {
  const { user, login, logout, register, verifyEmail, pendingVerificationEmail } =
    useAuth();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const buttonLabel = useMemo(
    () => (user ? 'Kelola Akun' : 'Masuk / Daftar'),
    [user],
  );

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setMessage('');
  };

  const closeModal = () => {
    setOpen(false);
    resetForm();
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await login(email, password);
      setMessage('Login berhasil. Mengarahkan ke halaman utama...');
      router.push('/');
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await register(name, email, password);
      setMessage(
        'Pendaftaran berhasil. Kami mengirim tautan verifikasi ke email Anda.',
      );
      setMode('login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mendaftar.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await verifyEmail();
      setMessage('Email terverifikasi. Anda sekarang sudah masuk.');
      router.push('/');
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verifikasi gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(true)}
        className="border rounded px-3 py-1 text-sm hover:bg-gray-100"
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Kelola Akun</h2>
              <button onClick={closeModal} className="text-sm text-gray-500">
                Tutup
              </button>
            </div>

            <div className="flex gap-2 text-sm">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 border rounded px-3 py-2 ${
                  mode === 'login' ? 'bg-gray-100 font-semibold' : ''
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 border rounded px-3 py-2 ${
                  mode === 'register' ? 'bg-gray-100 font-semibold' : ''
                }`}
              >
                Register
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full border rounded px-3 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white rounded px-3 py-2 hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Memproses...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-700 mb-1">Nama</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border rounded px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full border rounded px-3 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white rounded px-3 py-2 hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Memproses...' : 'Register'}
                </button>
              </form>
            )}

            {pendingVerificationEmail && (
              <div className="border rounded p-3 text-sm bg-gray-50">
                <p className="font-semibold">Verifikasi diperlukan</p>
                <p className="text-gray-700">
                  Kami sudah mengirim email verifikasi ke{' '}
                  <strong>{pendingVerificationEmail}</strong>. Klik tautan pada
                  email untuk mengaktifkan akun Anda, lalu tekan tombol di bawah
                  ini.
                </p>
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="mt-2 border rounded px-3 py-2 text-left hover:bg-white disabled:opacity-50"
                >
                  Saya sudah verifikasi melalui email
                </button>
              </div>
            )}

            {message && <p className="text-green-700 text-sm">{message}</p>}
            {error && <p className="text-red-600 text-sm">{error}</p>}

            {user && (
              <div className="border-t pt-3 text-sm flex items-center justify-between">
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-green-600 text-xs">Akun sudah login</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    resetForm();
                  }}
                  className="border rounded px-3 py-1 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}