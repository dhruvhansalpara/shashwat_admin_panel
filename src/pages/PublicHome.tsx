import { Package, Banner, Destination } from '../types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Clock, MapPin, Eye, Car as CarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { InquiryForm } from '@/components/InquiryForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSearchParams, Link } from 'react-router-dom';

import { Logo } from '@/components/Logo';

interface HomePageProps {
  packages: Package[];
  banners: Banner[];
  destinations: Destination[];
  onInquiry: (values: any, pkg?: Package) => void;
  whatsappNumber: string;
  defaultMessage: string;
}

export function PublicHome({ packages, banners, destinations, onInquiry, whatsappNumber, defaultMessage }: HomePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = (searchParams.get('search') || searchParams.get('destination'))?.toLowerCase() || '';
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

  const filteredPackages = packages.filter(pkg => {
    const isSearchMatch = 
      (pkg.name?.toLowerCase() || '').includes(searchQuery) ||
      (pkg.location?.toLowerCase() || '').includes(searchQuery) ||
      (pkg.category?.toLowerCase() || '').includes(searchQuery) ||
      (pkg.description?.toLowerCase() || '').includes(searchQuery);

    const linkedDestinations = destinations.filter(d => pkg.destination_ids?.includes(d.id));
    const isDestMatch = linkedDestinations.some(d => 
      d.name.toLowerCase().includes(searchQuery) || 
      (d.slug && d.slug.toLowerCase().includes(searchQuery))
    );

    return isSearchMatch || isDestMatch;
  });

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
                      Explore Incredible India
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
                      {banner.subtitle || 'Unforgettable journeys crafted just for you by Shashwat Holidays. Experience luxury and adventure in every step.'}
                    </motion.p>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="flex gap-4"
                    >
                      <Button size="lg" className="rounded-full px-8 h-14 text-base font-bold translate-hover tracking-wide shadow-xl shadow-primary/20" asChild>
                        <Link to="/destinations">View Tour Packages</Link>
                      </Button>
                      <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-bold border-white/30 text-white hover:bg-white/10" asChild>
                        <a href="#featured">Featured Trips</a>
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
      <motion.section 
        whileHover={{ backgroundColor: "rgba(0, 150, 136, 0.02)" }}
        transition={{ duration: 0.5 }}
        className="py-24 px-6 max-w-7xl mx-auto rounded-[4rem] transition-colors duration-500 my-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Special Collection</span>
            <h3 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Best Selling Destinations</h3>
            <p className="text-muted-foreground max-w-md">Our most loved travel spots handpicked by Shashwat Holidays experts.</p>
          </div>
          <Button asChild variant="ghost" className="font-bold uppercase tracking-widest text-[10px] gap-2 border-b-2 border-transparent hover:border-primary rounded-none h-12">
            <Link to="/destinations">View All Places <Clock className="w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.length > 0 ? (
            destinations.slice(0, 4).map((dest) => (
              <motion.div
                key={dest.id}
                whileHover={{ 
                  y: -15,
                  scale: 1.03,
                  boxShadow: "0 25px 50px -12px rgba(0, 150, 136, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="group relative h-[400px] rounded-[32px] overflow-hidden shadow-2xl transition-all duration-300"
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
                  <Link to={`/home?search=${dest.slug || dest.name.toLowerCase()}`} className="absolute inset-0" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full h-40 bg-muted rounded-2xl flex items-center justify-center italic text-muted-foreground">
              Add destinations in admin panel to see them here.
            </div>
          )}
        </div>
      </motion.section>

      {/* Featured Tours */}
      <motion.section 
        id="featured" 
        whileHover={{ backgroundColor: "rgba(0, 150, 136, 0.03)" }}
        className="py-24 bg-muted/10 transition-colors duration-500 rounded-v-t-[4rem] rounded-v-b-[4rem]"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div className="space-y-4">
              <h3 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-emerald-900/10 absolute -top-10 left-0 pointer-events-none select-none">TRIPS</h3>
              <div className="relative">
                <span className="text-primary font-bold uppercase tracking-widest text-xs">Handpicked For You</span>
                <h3 className="text-5xl md:text-7xl font-display font-bold tracking-tight leading-none text-[#004D40]">Explore Our Popular <br /> <span className="text-primary italic">Tour Packages</span></h3>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:justify-center bg-white/50 p-2 rounded-[2rem] border border-white/50 backdrop-blur-sm self-center">
              {['ALL', 'HERITAGE', 'HILL STATION', 'SPIRITUAL', 'BEACH & LEISURE', 'WILDLIFE & DESERT', 'ADVENTURE'].map((cat) => (
                <Button
                  key={cat}
                  variant={searchQuery.toUpperCase() === cat ? "default" : "ghost"}
                  onClick={() => {
                    if (cat === 'ALL') {
                      searchParams.delete('search');
                      searchParams.delete('destination');
                    } else {
                      searchParams.set('search', cat);
                    }
                    setSearchParams(searchParams);
                  }}
                  className={cn(
                    "rounded-full px-6 h-11 text-[10px] font-black uppercase tracking-widest transition-all",
                    searchQuery.toUpperCase() === cat 
                      ? "bg-[#E91E63] text-white hover:bg-[#D81B60] shadow-lg shadow-pink-500/20" 
                      : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {cat}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-3 self-end md:self-auto text-slate-400 bg-white/80 px-6 h-14 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-widest">Sort By:</span>
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Recommended</span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-8">
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[11px]">
              Showing <span className="text-slate-900">{filteredPackages.length}</span> tours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {displayPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -12,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
              >
                <Card className="overflow-hidden border-none shadow-[0_20px_60px_rgba(0,0,0,0.05)] hover:shadow-[0_45px_90px_rgba(0,150,136,0.12)] transition-all duration-500 bg-white rounded-[2.5rem] group border border-slate-50 relative">
                  <div className="absolute inset-0 rounded-[2.5rem] border-2 border-transparent group-hover:border-[#009688]/10 transition-all duration-500 pointer-events-none" />
                  <Link to={`/tour/${pkg.id}`} className="block relative aspect-[1.4] overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.name} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />
                    
                    {/* Top Right Tag - Category (from screenshot) */}
                    <div className="absolute top-6 right-6 backdrop-blur-md bg-white text-slate-900 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20">
                      {pkg.category || 'HOLIDAY'}
                    </div>

                    {/* Top Left Tag - Popular (as requested in text) */}
                    {pkg.isFeatured && (
                      <div className="absolute top-6 left-6 backdrop-blur-md bg-primary text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30">
                        POPULAR
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                       <div className="flex items-center justify-center w-24 h-24 rounded-full border border-white/20 backdrop-blur-md bg-white/10 mx-auto text-center transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <span className="text-white text-[10px] font-black leading-tight uppercase tracking-tighter">Explore The Beauty<br/>Of Colorful<br/><span className="text-xs text-primary">Gujarat Heritage</span></span>
                       </div>
                    </div>
                  </Link>
                  <CardHeader className="p-8 pb-4">
                    <Link to={`/tour/${pkg.id}`} className="hover:text-primary transition-colors">
                      <CardTitle className="text-3xl font-display font-black leading-tight tracking-tight text-slate-800">{pkg.name}</CardTitle>
                    </Link>
                  </CardHeader>
                  <CardContent className="px-8 pb-6">
                    <div className="flex items-center gap-6 text-slate-400 font-bold text-xs mb-6 uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" strokeWidth={3} /> {pkg.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" strokeWidth={3} /> {pkg.days} Days
                      </span>
                      <span className="flex items-center gap-2 font-black text-primary">
                         ₹{pkg.price}
                      </span>
                    </div>
                  </CardContent>
                  <div className="px-8 pb-10">
                    <div className="h-px bg-slate-100 mb-8" />
                    <div className="flex gap-4">
                      <Button 
                        variant="ghost"
                        className="flex-1 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] h-14 border-2 border-slate-100 hover:bg-slate-50 transition-all" 
                        onClick={() => {
                          setSelectedPkg(pkg);
                          setIsFormOpen(true);
                        }}
                      >
                        Inquire Now
                      </Button>
                      <Button 
                        variant="secondary"
                        asChild
                        className="flex-1 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] h-14 bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02]"
                      >
                        <a href={getWhatsAppLink(pkg.name)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
                          <MessageCircle className="w-4 h-4" strokeWidth={3} /> WhatsApp
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Why Choose Us / Features */}
      <motion.section 
        whileHover={{ backgroundColor: "rgba(0, 150, 136, 0.01)" }}
        className="py-24 bg-background transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Shashwat Experience</span>
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
      </motion.section>

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
        <AnimatePresence>
          {isFormOpen && (
            <DialogContent className="sm:max-w-[550px] p-0 rounded-[48px] border-none shadow-[0_32px_120px_rgba(0,0,0,0.15)] overflow-hidden bg-[#fcfdfe]">
              <div className="relative p-12">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="relative z-10 space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                         <MessageCircle className="w-6 h-6" strokeWidth={3} />
                       </div>
                       <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase font-display leading-none">Plan Your Dream Trip</h2>
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] pl-1 opacity-70">
                      Planning your journey for: <span className="text-primary">{selectedPkg?.name || 'CUSTOM TOUR'}</span>
                    </p>
                  </div>

                  <InquiryForm 
                    packageId={selectedPkg?.id} 
                    packageName={selectedPkg?.name}
                    onSubmit={handleInquiry} 
                  />
                  
                  <div className="pt-6 border-t border-slate-100 flex items-center justify-center gap-6">
                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Secure Data Link Established</p>
                  </div>
                </div>
              </div>
            </DialogContent>
          )}
        </AnimatePresence>
      </Dialog>

      {/* Luxury Footer */}
      <footer className="bg-slate-950 text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="md:col-span-2 space-y-8">
              <Logo variant="light" className="scale-125 origin-left" />
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
            <p className="text-slate-500 text-xs">© 2024 Shashwat Holiday & Travels. All rights reserved.</p>
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
