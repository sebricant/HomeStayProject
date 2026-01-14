import { Icon } from '@/components/ui/Icon';

export default function About() {
    return (
        <section id="about" className="py-24 bg-surface text-center px-6 relative overflow-hidden">
            {/* Decor element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                <span className="text-secondary font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Our Story</span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-8">A Home Away From Home</h2>
                <p className="text-text-muted text-lg leading-relaxed mb-12 font-light">
                    Palm Grove is more than just a place to stay; it's an experience of true Kerala hospitality.
                    Located on the banks of the Pamba river, our heritage home offers a perfect blend of
                    traditional architecture and modern comfort. Wake up to the sound of birds and the
                    gentle flow of the backwaters.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <Feature icon="Coffee" title="Authentic Food" desc="Home-cooked Kerala delicacies" />
                    <Feature icon="Wifi" title="Free Wi-Fi" desc="Stay connected with nature & world" />
                    <Feature icon="MapPin" title="Prime Location" desc="Minutes away from Boat Jetty" />
                </div>
            </div>
        </section>
    );
}

function Feature({ icon, title, desc }: any) {
    return (
        <div className="p-8 bg-surface-sand/50 border border-white rounded-2xl hover:shadow-lift transition-all duration-500 hover:-translate-y-1 group">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-sm">
                <Icon name={icon} size={20} />
            </div>
            <h3 className="font-heading font-bold text-xl text-primary-dark mb-2">{title}</h3>
            <p className="text-sm text-text-muted">{desc}</p>
        </div>
    )
}
