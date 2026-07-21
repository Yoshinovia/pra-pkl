'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. We import the router here

export default function Home() {
  const router = useRouter(); // 2. We activate the router here
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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

      if (data.success) {
        router.push('/reports'); 
      }
    } catch (error) {
      console.error("Gagal terhubung ke server:", error);
      setMessage("Check connection database.");
    }
  };

  return (
    <main className="h-screen flex items-center justify-center bg-[url('/images/background-picsay.jpg.jpeg')] bg-cover bg-center bg-no-repeat">
      <section className="w-full max-w-md bg-black/50 text-white backdrop-blur-2xl border border-white/20 py-10 px-8 rounded-2xl shadow-2xl">
        
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-semibold tracking-wide">LOGIN PAGE</h1>
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
            <input 
              id="password"
              type="password" 
              placeholder="Enter your password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="bg-black/30 border border-white/30 text-white placeholder-gray-400 py-3 px-4 rounded-xl focus:outline-none focus:border-[#edde53] transition-colors" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#edde53] hover:bg-yellow-400 text-black font-bold py-3 mt-4 rounded-xl transition-colors shadow-lg"
          >
            Sign In
          </button>

        </form>
      </section>
    </main>
  );
}