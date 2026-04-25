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
    whileHover={{ y: -8 }}
    className="group relative h-[400px] rounded-3xl overflow-hidden shadow-xl"
  >
    <img 
      src={dest.image} 
      alt={dest.name} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
    
    <div className="absolute inset-x-0 bottom-0 p-8 space-y-4">
      <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-md border-none gap-1 font-bold uppercase tracking-widest text-[10px]">
        {dest.category === 'domestic' ? <MapPin className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
        {dest.category}
      </Badge>
      <h3 className="text-3xl font-display font-bold text-white tracking-tight">{dest.name}</h3>
      <p className="text-white/70 text-sm line-clamp-2 leading-relaxed font-medium">
        {dest.description}
      </p>
      <Button asChild variant="link" className="text-primary font-bold p-0 h-auto gap-2 group-hover:translate-x-1 transition-transform">
        <Link to={`/?search=${dest.name}`}>Explore Tours <ArrowRight className="w-4 h-4" /></Link>
      </Button>
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
