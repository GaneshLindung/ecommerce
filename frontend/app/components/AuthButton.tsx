'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { CartIcon, SparkleIcon } from './Icons';

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
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500/90 to-emerald-500/90 px-3 py-1.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl"
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm">
          <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-2xl">
            <div className="grid gap-0 md:grid-cols-[1.15fr_1fr]">
              <div className="relative flex flex-col justify-between space-y-8 bg-gradient-to-br from-sky-500 via-emerald-500 to-blue-600 p-8 text-white">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wide">
                    <SparkleIcon className="h-4 w-4" />
                    MyShop Access
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black leading-tight">
                      {mode === 'login' ? 'Masuk lebih nyaman' : 'Daftar dalam hitungan detik'}
                    </h2>
                    <p className="text-sm text-white/80">
                      Kelola akun, simpan keranjang, dan nikmati checkout yang lebih cepat dengan tampilan baru yang rapi.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 text-sm text-white/90">
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 shadow-sm">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                      <CartIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold">Sinkron keranjang otomatis</p>
                      <p className="text-white/80">Lanjutkan belanja dari perangkat mana pun.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 shadow-sm">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">✨</span>
                    <div>
                      <p className="font-semibold">Status pesanan real-time</p>
                      <p className="text-white/80">Dapatkan notifikasi setiap langkah pengiriman.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/30"
                  aria-label="Tutup jendela login"
                >
                  Tutup
                </button>
              </div>

              <div className="space-y-6 p-8">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-600">{mode === 'login' ? 'Kembali Belanja' : 'Mulai Sekarang'}</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {mode === 'login' ? 'Masuk untuk melanjutkan' : 'Daftar akun baru'}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {mode === 'login'
                        ? 'Gunakan email dan password yang sudah terdaftar.'
                        : 'Isi data berikut untuk membuat akun MyShop.'}
                    </p>
                  </div>
                  <div className="hidden rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 md:flex md:items-center md:gap-2">
                    <SparkleIcon className="h-4 w-4" />
                    Pengalaman baru
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50/70 p-1 text-sm font-semibold text-slate-600">
                  <button
                    onClick={() => setMode('login')}
                    className={`rounded-xl px-3 py-2 transition ${mode === 'login' ? 'bg-white text-sky-700 shadow-sm' : 'hover:text-slate-900'}`}
                  >
                    Masuk
                  </button>
                  <button
                    onClick={() => setMode('register')}
                    className={`rounded-xl px-3 py-2 transition ${mode === 'register' ? 'bg-white text-sky-700 shadow-sm' : 'hover:text-slate-900'}`}
                  >
                    Daftar
                  </button>
                </div>

                {mode === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4 text-sm">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        className="w-full rounded-lg border px-3 py-2 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        className="w-full rounded-lg border px-3 py-2 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-sky-600 hover:to-emerald-600 disabled:opacity-60"
                    >
                      {loading ? 'Memproses...' : 'Masuk'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4 text-sm">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                      <input
                        type="text"
                        className="w-full rounded-lg border px-3 py-2 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        className="w-full rounded-lg border px-3 py-2 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <input
                        type="password"
                        className="w-full rounded-lg border px-3 py-2 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-sky-600 hover:to-emerald-600 disabled:opacity-60"
                    >
                      {loading ? 'Memproses...' : 'Daftar'}
                    </button>
                  </form>
                )}

                {pendingVerificationEmail && (
                  <div className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-emerald-800">
                    <p className="font-semibold">Verifikasi diperlukan</p>
                    <p>
                      Kami sudah mengirim email verifikasi ke{' '}
                      <strong>{pendingVerificationEmail}</strong>. Klik tautan pada email untuk mengaktifkan akun Anda, lalu tekan tombol di bawah ini.
                    </p>
                    <button
                      onClick={handleVerify}
                      disabled={loading}
                      className="rounded-lg bg-white px-3 py-2 font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50 disabled:opacity-50"
                    >
                      Saya sudah verifikasi melalui email
                    </button>
                  </div>
                )}

                {message && (
                  <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" aria-live="polite">
                    {message}
                  </p>
                )}
                {error && (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" aria-live="assertive">
                    {error}
                  </p>
                )}

                {user && (
                  <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm">
                    <div>
                      <p className="font-semibold text-slate-900">{user.name}</p>
                      <p className="text-slate-600">{user.email}</p>
                      <p className="text-emerald-600 text-xs font-semibold">Akun sudah login</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        resetForm();
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 transition hover:bg-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}