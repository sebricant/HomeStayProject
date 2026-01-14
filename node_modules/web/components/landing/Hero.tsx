export default function Hero() {
    return (
        <section className="relative h-screen flex items-center justify-center bg-primary-dark overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-60 animate-pulse-slow"></div>

            {/* Gradient Overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/40 to-transparent"></div>

            <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <div className="inline-block mb-6 px-4 py-1.5 border border-white/30 rounded-full bg-white/10 backdrop-blur-md animate-fade-in-up">
                    <span className="uppercase tracking-[0.2em] text-xs font-bold text-accent-gold">Welcome to Alleppey</span>
                </div>

                <h1 className="font-heading text-6xl md:text-8xl font-bold mb-6 leading-tight animate-fade-in-up delay-100 drop-shadow-lg">
                    Serenity on the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-light to-white">Backwaters</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-200 font-light leading-relaxed">
                    A heritage homestay nestled in the heart of Kerala’s lush greenery. Experience true luxury, defined by nature.
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up delay-300">
                    <a href="#contact" className="inline-flex items-center justify-center bg-accent-coral hover:bg-white hover:text-primary text-white px-10 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                        Book Your Stay
                    </a>
                    <a href="#about" className="inline-flex items-center justify-center border-2 border-white/30 hover:border-white hover:bg-white/10 text-white px-10 py-4 rounded-full font-bold transition-all backdrop-blur-sm">
                        Explore Rooms
                    </a>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
        </section>
    );
}
