import { Package, Banner, Destination } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Clock, MapPin, Eye, Car as CarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { InquiryForm } from '@/components/InquiryForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSearchParams, Link } from 'react-router-dom';

interface HomePageProps {
  packages: Package[];
  banners: Banner[];
  destinations: Destination[];
  onInquiry: (values: any, pkg?: Package) => void;
  whatsappNumber: string;
  defaultMessage: string;
}

export function PublicHome({ packages, banners, destinations, onInquiry, whatsappNumber, defaultMessage }: HomePageProps) {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const filteredPackages = packages.filter(pkg => 
    (pkg.name?.toLowerCase() || '').includes(searchQuery) ||
    (pkg.location?.toLowerCase() || '').includes(searchQuery) ||
    (pkg.description?.toLowerCase() || '').includes(searchQuery)
  );

  const featuredPackages = filteredPackages.filter(p => p.isFeatured).slice(0, 6);
  const displayPackages = featuredPackages.length > 0 ? featuredPackages : filteredPackages.slice(0, 6);

  const getWhatsAppLink = (pkgName: string) => {
    const message = encodeURIComponent(`${defaultMessage} I am interested in the ${pkgName} package.`);
    return `https://wa.me/${whatsappNumber}?text=${message}`;
  };

  const handleInquiry = (values: any) => {
    onInquiry(values, selectedPkg || undefined);
    setIsFormOpen(false);
    setSelectedPkg(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner Section */}
      <section className="relative h-[650px] overflow-hidden">
        {banners.length > 0 ? (
          <div className="h-full relative">
            <AnimatePresence mode="wait">
              {banners.map((banner, index) => index === activeBanner && (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={banner.image} 
                    alt={banner.title || 'Travel Banner'} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col items-start justify-center px-10 md:px-20 text-white z-20">
                    <motion.span 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-primary font-bold uppercase tracking-[0.3em] text-sm mb-4"
                    >
                      Escape to Paradise
                    </motion.span>
                    <motion.h2 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-5xl md:text-8xl font-display font-bold mb-6 tracking-tight leading-[1.1]"
                    >
                      {banner.title || 'Explore the World'}
                    </motion.h2>
                    <motion.p 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="text-lg md:text-xl font-light opacity-90 max-w-xl mb-10 leading-relaxed"
                    >
                      {banner.subtitle || 'Unforgettable journeys crafted just for you by Shashwa Holidays. Experience luxury and adventure in every step.'}
                    </motion.p>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="flex gap-4"
                    >
                      <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold translate-hover tracking-wide shadow-xl shadow-primary/20" asChild>
                        <Link to="/destinations">Explore Tours</Link>
                      </Button>
                      <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-bold border-white/30 text-white hover:bg-white/10" asChild>
                        <a href="#featured">View Featured</a>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="h-full bg-slate-900 flex items-center justify-center">
            <div className="text-center space-y-6">
              <h2 className="text-white text-6xl font-bold tracking-tighter italic">SHASHWA</h2>
              <p className="text-white/60 uppercase tracking-[0.5em] text-xs">Holiday & Travels</p>
            </div>
          </div>
        )}
      </section>

      {/* Featured Destinations */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Our Collection</span>
            <h3 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Top Destinations</h3>
            <p className="text-muted-foreground max-w-md">The most sought-after travel spots curated by our luxury travel experts.</p>
          </div>
          <Button asChild variant="ghost" className="font-bold uppercase tracking-widest text-[10px] gap-2 border-b-2 border-transparent hover:border-primary rounded-none h-12">
            <Link to="/destinations">View All Destinations <Clock className="w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.length > 0 ? (
            destinations.slice(0, 4).map((dest) => (
              <motion.div
                key={dest.id}
                whileHover={{ y: -10 }}
                className="group relative h-[400px] rounded-[32px] overflow-hidden shadow-2xl"
              >
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <h4 className="text-white text-2xl font-bold tracking-tight mb-2">{dest.name}</h4>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all duration-300 opacity-0 group-hover:opacity-100">
                    Explore Packages
                  </p>
                  <Link to={`/?search=${dest.name}`} className="absolute inset-0" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full h-40 bg-muted rounded-2xl flex items-center justify-center italic text-muted-foreground">
              Add destinations in admin panel to see them here.
            </div>
          )}
        </div>
      </section>

      {/* Featured Tours */}
      <section id="featured" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Curated For You</span>
            <h3 className="text-4xl md:text-6xl font-display font-bold tracking-tight">Handpicked Tours</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our most popular journeys designed for maximum comfort and discovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                <Card className="overflow-hidden border-none shadow-2xl hover:shadow-primary/5 transition-all duration-500 bg-card rounded-[2.5rem] group">
                  <Link to={`/tour/${pkg.id}`} className="block relative aspect-[16/11] overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-6 right-6 backdrop-blur-md bg-white/20 border border-white/30 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                      From ₹{pkg.price}
                    </div>
                  </Link>
                  <CardHeader className="p-8 pb-4">
                    <div className="flex items-center gap-2 mb-4">
                       <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                         {pkg.category || 'Tour Package'}
                       </span>
                    </div>
                    <Link to={`/tour/${pkg.id}`} className="hover:text-primary transition-colors">
                      <CardTitle className="text-2xl font-display font-bold leading-tight">{pkg.name}</CardTitle>
                    </Link>
                  </CardHeader>
                  <CardContent className="px-8 pb-6">
                    <div className="flex items-center gap-6 text-muted-foreground font-semibold text-sm mb-6">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" /> {pkg.duration}
                      </span>
                      {pkg.location && (
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" /> {pkg.location}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground/80 line-clamp-2 text-base leading-relaxed font-light italic">
                      "{pkg.description}"
                    </p>
                  </CardContent>
                  <CardFooter className="px-8 pb-10 flex gap-3">
                    <Button 
                      variant="outline"
                      className="flex-1 rounded-2xl text-xs font-bold uppercase tracking-widest h-12 border-muted-foreground/20" 
                      onClick={() => {
                        setSelectedPkg(pkg);
                        setIsFormOpen(true);
                      }}
                    >
                      Inquiry
                    </Button>
                    <Button 
                      variant="secondary"
                      asChild
                      className="flex-1 rounded-2xl text-xs font-bold uppercase tracking-widest h-12 bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                    >
                      <a href={getWhatsAppLink(pkg.name)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" /> WhatsApp
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us / Features */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Shashwa Experience</span>
              <h3 className="text-5xl font-display font-bold tracking-tight leading-tight">Crafting Unforgettable Global Memories</h3>
              <p className="text-muted-foreground text-lg font-light leading-relaxed">
                Since our inception, we've focused on one thing: providing the most authentic and luxury travel experiences across India and the globe.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-10">
              {[
                { title: 'Bespoke Planning', desc: 'Every itinerary is customized to your personal travel style and rhythm.' },
                { title: '24/7 Support', desc: 'Our team is always reachable, ensuring a stress-free journey from start to finish.' },
                { title: 'Premium Fleet', desc: 'Travel in comfort with our diverse range of premium car rentals and chauffeurs.' }
              ].map((feature, i) => (
                <div key={i} className="flex gap-6 items-start group">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <span className="font-bold text-xl">0{i+1}</span>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-xl font-bold">{feature.title}</h5>
                    <p className="text-muted-foreground font-light">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=1500" 
                alt="Taj Mahal" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-10 -left-10 bg-primary text-white p-10 rounded-[2rem] shadow-2xl shadow-primary/30 max-w-[280px]">
              <p className="text-4xl font-display font-bold mb-2">10k+</p>
              <p className="text-sm font-light opacity-80 leading-snug">Smiling travelers moved by our journey across the subcontinent.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Car Rental Preview */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 hidden lg:block">
           <CarIcon className="w-[600px] h-[600px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-8">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Premium Fleet</span>
            <h3 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-tight">Comfortable Journeys Across India</h3>
            <p className="text-slate-400 text-lg font-light leading-relaxed max-w-xl">
              From luxury SUVs for mountain retreats to spacious travellers for group pilgrimages, we provide the perfect wheels for your story.
            </p>
            <div className="flex gap-4">
               <Button size="lg" className="rounded-2xl h-14 px-8 font-bold text-base" asChild>
                 <Link to="/car-rental">View All Vehicles</Link>
               </Button>
               <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl h-14 px-8 font-bold text-base" asChild>
                 <a href={`https://wa.me/${whatsappNumber}`}>Get a Quote</a>
               </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-4">
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-800">
                   <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Luxury Car" />
                </div>
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-800">
                   <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Traveller" />
                </div>
             </div>
             <div className="space-y-4 pt-12">
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-800">
                   <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="SUV" />
                </div>
                <div className="aspect-square rounded-[2rem] overflow-hidden bg-slate-800">
                   <img src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover" alt="Sedan" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Inquiry Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl">
          <DialogHeader className="p-4">
            <DialogTitle className="text-2xl font-bold">Inquire Now</DialogTitle>
            <DialogDescription className="text-base">
              Plan your dream vacation with {selectedPkg?.name || 'us'}.
            </DialogDescription>
          </DialogHeader>
          <div className="px-4 pb-8">
            <InquiryForm 
              selectedPackage={selectedPkg || undefined} 
              onSubmit={handleInquiry} 
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Luxury Footer */}
      <footer className="bg-slate-950 text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2 space-y-8">
              <h4 className="text-3xl font-display font-bold tracking-tighter italic">SHASHWA</h4>
              <p className="text-slate-400 font-light leading-relaxed max-w-sm">
                Luxury Travel Agency based in Ahmedabad, Gujarat. Specialists in Rajasthan, Himachal, Kerala, and International bespoke tours.
              </p>
              <div className="flex gap-4">
                {/* Social icons would go here */}
              </div>
            </div>
            <div className="space-y-6">
              <p className="font-bold uppercase tracking-widest text-xs text-primary">Quick Links</p>
              <ul className="space-y-3 text-slate-400 font-light">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/destinations" className="hover:text-white transition-colors">Destinations</Link></li>
              <li><Link to="/tours" className="hover:text-white transition-colors">Our Tours</Link></li>
              <li><Link to="/car-rental" className="hover:text-white transition-colors">Car Rental</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <p className="font-bold uppercase tracking-widest text-xs text-primary">Contact Us</p>
              <ul className="space-y-3 text-slate-400 font-light">
                <li>Ahmedabad, Gujarat, India</li>
                <li>+91 {whatsappNumber}</li>
                <li>info@shashwatholidays.in</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-xs">© 2024 Shashwa Holiday & Travels. All rights reserved.</p>
            <div className="flex gap-8 text-slate-500 text-xs uppercase tracking-widest font-bold">
              <Link to="/privacy" className="hover:text-white">Privacy</Link>
              <Link to="/terms" className="hover:text-white">Terms</Link>
              <Link to="/admin/login" className="hover:text-emerald-400">Admin</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
