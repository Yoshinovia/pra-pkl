'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.role === 'admin') {
          router.push('/admin');
        } else if (data.user.role === 'inventory_manager') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Gagal terhubung ke server:', error);
      setMessage('Terjadi kesalahan pada server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen flex items-center justify-center">
      <Image 
        src="/images/Background-picsay.jpg.jpeg"
        alt='background'
        fill
        priority
        className='object-cover -z-10'/>
      <section className="w-full max-w-md bg-black/50 text-white backdrop-blur-2xl border border-white/20 py-10 px-8 rounded-2xl shadow-2xl">
        
        <div className="flex flex-col items-center justify-center">
          {/* <img src="images/jembatam.png" alt="logo" className="w-10 h-10 mb-2" /> */}
          <Image src="/images/roxy.png" width={70} height={70} alt="logo" />
          <h1 className="text-2xl font-semibold tracking-wide mt-2">WELCOME</h1>
        </div>
        
        {message && (
          <p className="text-center text-sm mt-4 text-amber-300">{message}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col items-center mt-12 gap-6 h-full w-full">
          
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="email" className="text-sm text-gray-200">Email</label>
            <input 
              id="email"
              type="email" 
              placeholder="user@gmail.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="bg-black/30 border border-white/30 text-white placeholder-gray-400 py-3 px-4 rounded-xl focus:outline-none focus:border-[#edde53] transition-colors" 
            />
          </div>

          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="password" className="text-sm text-gray-200">Password</label>
            <div className="relative w-full">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="bg-black/30 border border-white/30 text-white placeholder-gray-400 py-3 px-4 pr-11 rounded-xl focus:outline-none focus:border-[#edde53] transition-colors w-full" 
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#edde53] hover:bg-yellow-400 disabled:bg-yellow-400/60 text-black font-bold py-3 mt-4 rounded-xl transition-colors shadow-lg cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>
      </section>
    </main>
  );
}