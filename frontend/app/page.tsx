export default function Home() {
  return (
    <main className="h-screen flex items-center justify-center">
      <section className="w-100 h-150 bg-white/10 backdrop-blur-2xl border border-white/20 py-10 px-2 rounded-2xl">
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-semibold">LOGIN PAGE</h1>
        </div>
        <form action="" className="flex flex-col items-center mt-20 gap-10 h-full w-full">
          <div className="flex flex-col gap-2">
            <label htmlFor="">Email</label>
            <input type="email" placeholder="@gmail.com" className="bg-transparent border border-white py-2 w-80 px-2 rounded-xl" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="">Password</label>
            <input type="password" placeholder="******" className="bg-transparent border border-white py-2 w-80 px-2 rounded-xl" />
          </div>
          <button type="submit" className="bg-gray-200 px-20 py-2 rounded-xl text-black">Sign In</button>
        </form>
      </section>
    </main>
  );
}
