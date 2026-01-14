import Link from 'next/link';

// Components
import Hero from '@/components/landing/Hero';
import About from '@/components/landing/About';
import Rooms from '@/components/landing/Rooms';
import Contact from '@/components/landing/Contact';

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center text-white">
        <div className="text-2xl font-heading font-bold">Palm Grove</div>
        <div className="flex gap-6 font-medium">
          <Link href="#about" className="hover:text-primary-light transition-colors">About</Link>
          <Link href="#rooms" className="hover:text-primary-light transition-colors">Stay</Link>
          <Link href="#contact" className="hover:text-primary-light transition-colors">Contact</Link>
          <Link href="/guest" className="bg-white/20 backdrop-blur px-4 py-2 rounded-full hover:bg-white hover:text-primary transition-all">Guest Portal</Link>
        </div>
      </nav>

      <Hero />
      <About />
      <Rooms />
      <Contact />

      <footer className="bg-gray-900 text-white py-12 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Palm Grove Homestay. All rights reserved.</p>
      </footer>
    </main>
  );
}
