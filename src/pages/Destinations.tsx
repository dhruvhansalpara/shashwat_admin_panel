import * as React from 'react';
import { Destination } from '@/types';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { MapPin, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface DestinationsPageProps {
  destinations: Destination[];
}

const DestinationCard = ({ dest }: { dest: Destination, key?: React.Key }) => (
  <motion.div 
    whileHover={{ 
      y: -15,
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(0, 150, 136, 0.25)"
    }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
    className="group relative h-[400px] rounded-[32px] overflow-hidden shadow-xl transition-all duration-300"
  >
    <div className="absolute inset-0 rounded-[32px] border-2 border-transparent group-hover:border-[#009688]/20 transition-all duration-500 z-20 pointer-events-none" />
    <img 
      src={dest.image} 
      alt={dest.name} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
    
    <div className="absolute inset-x-0 bottom-0 p-10 space-y-4 z-30">
      <Badge variant="secondary" className="bg-[#009688] text-white backdrop-blur-md border-none gap-2 font-black uppercase tracking-[0.2em] text-[9px] px-4 py-1.5 shadow-lg">
        {dest.category === 'domestic' ? <MapPin className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
        {dest.category} UNIT
      </Badge>
      <h3 className="text-4xl font-display font-black text-white tracking-tight uppercase italic">{dest.name}</h3>
      <p className="text-white/70 text-sm line-clamp-2 leading-relaxed font-medium">
        {dest.description}
      </p>
      <div className="pt-2">
        <Button asChild variant="link" className="text-[#009688] font-black p-0 h-auto gap-3 uppercase tracking-widest text-[10px] group-hover:translate-x-2 transition-transform">
          <Link to={`/?search=${dest.name}`}>Synchronize Tours <ArrowRight className="w-4 h-4" strokeWidth={3} /></Link>
        </Button>
      </div>
    </div>
  </motion.div>
);

export function DestinationsPage({ destinations }: DestinationsPageProps) {
  const domestic = destinations.filter(d => d.category === 'domestic');
  const international = destinations.filter(d => d.category === 'international');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">Our Destinations</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Crafting unforgettable memories across India and the most beautiful corners of the world.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        
        {/* Domestic Section */}
        {domestic.length > 0 && (
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-display font-bold">Domestic Wonders</h2>
              <div className="h-px bg-border flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {domestic.map(dest => <DestinationCard key={dest.id} dest={dest} />)}
            </div>
          </section>
        )}

        {/* International Section */}
        {international.length > 0 && (
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-display font-bold">International Escapes</h2>
              <div className="h-px bg-border flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {international.map(dest => <DestinationCard key={dest.id} dest={dest} />)}
            </div>
          </section>
        )}

        {destinations.length === 0 && (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-20" />
            <h3 className="text-2xl font-display font-bold text-muted-foreground">Coming Soon</h3>
            <p className="text-muted-foreground mt-2">Our team is curating the best locations for you.</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tight">Ready for your next adventure?</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="h-14 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs" asChild>
              <Link to="/">Browse All Tours</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs border-white text-white hover:bg-white hover:text-primary transition-colors" asChild>
              <Link to="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
