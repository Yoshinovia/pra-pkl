'use client'; // Wajib untuk interaksi state & event handler di Next.js App Router

import { useState } from 'react';

export default function Home() {
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
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        alert('Selamat Datang!');
      }
    } catch (error) {
      console.error("Gagal terhubung ke server:", error);
      setMessage("Terjadi kesalahan pada server.");
    }
  };

  return (
    <main className="h-screen flex items-center justify-center">
      <section className="w-100 h-150 bg-white/10 backdrop-blur-2xl border border-white/20 py-10 px-2 rounded-2xl">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-semibold">LOGIN PAGE</h1>
        </div>
        {message && (
          <p className="text-center text-sm mb-4 text-amber-300">{message}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col items-center mt-20 gap-10 h-full w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="">Email</label>
            <input type="email" placeholder="@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-transparent border border-white py-2 w-80 px-2 rounded-xl" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Password</label>
            <input type="password" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-transparent border border-white py-2 w-80 px-2 rounded-xl" />
          </div>
          <button type="submit" className="bg-gray-200 px-20 py-2 rounded-xl text-black">Sign In</button>
        </form>

      </section>
    </main>
  );
}
