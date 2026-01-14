import { Card, Button } from '@alleppey/ui';

export default function Rooms() {
    return (
        <section id="rooms" className="py-24 bg-surface-sand px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="text-accent-coral font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Accommodations</span>
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-dark mb-4">Our Rooms</h2>
                    <p className="text-text-muted max-w-2xl mx-auto">Designed for comfort, inspired by nature. Each room offers a unique view of the backwaters.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <RoomCard
                        title="Garden View Deluxe"
                        price="₹2,500"
                        image="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop"
                    />
                    <RoomCard
                        title="Riverfront Villa"
                        price="₹4,000"
                        image="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop"
                    />
                    <RoomCard
                        title="Heritage Suite"
                        price="₹3,500"
                        image="https://images.unsplash.com/photo-1590490360182-c872f5c2015d?q=80&w=2070&auto=format&fit=crop"
                    />
                </div>
            </div>
        </section>
    );
}

function RoomCard({ title, price, image }: any) {
    return (
        <Card noPadding className="group overflow-hidden !bg-white">
            <div className="h-72 overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="p-8">
                <h3 className="font-heading font-bold text-2xl text-primary-dark mb-2">{title}</h3>
                <div className="flex justify-between items-end mt-4">
                    <span className="text-accent-gold font-bold text-2xl font-heading">{price} <span className="text-xs text-text-muted font-sans font-normal">/ night</span></span>
                    <Button variant="ghost" size="sm" className="!p-0 hover:!bg-transparent hover:text-accent-coral">View Details &rarr;</Button>
                </div>
            </div>
        </Card>
    )
}
