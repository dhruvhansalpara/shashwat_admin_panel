import { Car } from '@/types';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Users, Briefcase, Car as CarIcon, CheckCircle2, MessageCircle, Info } from 'lucide-react';

interface PublicCarRentalProps {
  cars: Car[];
  whatsappNumber: string;
}

export function PublicCarRental({ cars, whatsappNumber }: PublicCarRentalProps) {
  const getWhatsAppLink = (carName: string) => {
    const message = encodeURIComponent(`Hello Shashwa Holidays, I'm interested in renting a ${carName}. Please provide more details.`);
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <section className="bg-slate-900 py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold uppercase tracking-[0.3em] text-sm"
          >
            Premium Transport
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight"
          >
            Travel in Luxury
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed"
          >
            Explore India with our premium fleet of well-maintained vehicles and professional chauffeurs. Comfort, safety, and reliability guaranteed.
          </motion.p>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {cars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-card rounded-[2.5rem] group h-full flex flex-col">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-6 right-6 backdrop-blur-md bg-white/20 border border-white/30 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                    ₹{car.pricePerKm}/km
                  </div>
                </div>
                <CardHeader className="p-8 pb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      {car.type}
                    </span>
                    {!car.isAvailable && (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        Booked
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-display font-bold">{car.name}</CardTitle>
                </CardHeader>
                <CardContent className="px-8 pb-6 flex-grow space-y-6">
                  <div className="flex gap-6 text-muted-foreground font-semibold text-sm">
                    <div className="flex items-center gap-2">
                       <Users className="w-5 h-5 text-primary" /> {car.seats} Seats
                    </div>
                    <div className="flex items-center gap-2">
                       <Briefcase className="w-5 h-5 text-primary" /> {car.luggage} Bags
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {car.features?.slice(0, 4).map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground/80">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <p className="text-muted-foreground/70 text-sm leading-relaxed italic">
                    {car.description || "Premium transport solution for your journey."}
                  </p>
                </CardContent>
                <CardFooter className="px-8 pb-10 flex gap-3">
                  <Button 
                    variant="secondary"
                    asChild
                    className="w-full rounded-2xl text-xs font-bold uppercase tracking-widest h-14 bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                  >
                    <a href={getWhatsAppLink(car.name)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" /> Book Now
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {cars.length === 0 && (
          <div className="text-center py-20 bg-muted/30 rounded-[3rem] border-2 border-dashed border-muted">
            <CarIcon className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="text-2xl font-display font-bold text-muted-foreground">Fleet Updating</h3>
            <p className="text-muted-foreground mt-2">Checking with our transport team for availability.</p>
          </div>
        )}
      </section>

      {/* Info Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-background rounded-[3rem] p-10 md:p-16 shadow-2xl border-none space-y-12">
            <div className="flex items-center gap-4 text-primary">
              <Info className="w-8 h-8" />
              <h3 className="text-3xl font-display font-bold">Rental Terms & Conditions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Minimum 250km/day billing</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Toll & Parking extra as per actual</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> State tax extra for inter-state</li>
              </ul>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Driver allowance per night applies</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Vehicles subject to availability</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> GST 5% applicable on total bill</li>
              </ul>
            </div>
            <div className="pt-6 border-t font-medium text-center">
              Need a custom quote? <a href={`https://wa.me/${whatsappNumber}`} className="text-primary underline underline-offset-4">Talk to our transport manager</a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
           <div className="space-y-4">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center mx-auto mb-6">
                 <Users className="w-10 h-10 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Safe & Professional</h4>
              <p className="text-muted-foreground font-light px-6 text-sm">Our drivers are vetted and experienced in long-distance travel across diverse terrains.</p>
           </div>
           <div className="space-y-4">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center mx-auto mb-6">
                 <CarIcon className="w-10 h-10 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Well-Maintained</h4>
              <p className="text-muted-foreground font-light px-6 text-sm">Regular servicing and strict hygiene protocols for every vehicle before and after trips.</p>
           </div>
           <div className="space-y-4">
              <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center mx-auto mb-6">
                 <MessageCircle className="w-10 h-10 text-primary" />
              </div>
              <h4 className="text-xl font-bold">Instant Booking</h4>
              <p className="text-muted-foreground font-light px-6 text-sm">Seamless WhatsApp-based communication for quick quotes and booking confirmations.</p>
           </div>
        </div>
      </section>
    </div>
  );
}
