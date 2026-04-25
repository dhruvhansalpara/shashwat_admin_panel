import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Package, Inquiry } from '@/types';
import { 
  Calendar, MapPin, Users, Globe, 
  CheckCircle2, XCircle, ArrowLeft, 
  MessageSquare, ChevronDown, ChevronUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { InquiryForm } from '@/components/InquiryForm';

interface TourDetailsProps {
  packages: Package[];
  onInquiry: (values: any, pkg?: Package) => Promise<void>;
  whatsappNumber: string;
}

export function TourDetails({ packages, onInquiry, whatsappNumber }: TourDetailsProps) {
  const { id } = useParams();
  const pkg = packages.find(p => p.id === id);
  const [openDay, setOpenDay] = React.useState<number | null>(1);

  if (!pkg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <h2 className="text-2xl font-bold mb-4">Tour Package Not Found</h2>
        <Button asChild variant="outline">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hi, I'm interested in the "${pkg.name}" tour.`);
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        <img 
          src={pkg.bannerImage || pkg.image} 
          className="w-full h-full object-cover" 
          alt={pkg.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-20">
          <div className="max-w-7xl mx-auto w-full space-y-4">
            <Link to="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Tours
            </Link>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary text-white border-none">{pkg.days} Days</Badge>
              {pkg.location && (
                <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-md border-none flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {pkg.location}
                </Badge>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">{pkg.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Highlights Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center">
                <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Duration</p>
                <p className="font-bold text-sm">{pkg.days} Days</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center">
                <MapPin className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Location</p>
                <p className="font-bold text-sm truncate">{pkg.location || 'India'}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Group Size</p>
                <p className="font-bold text-sm">{pkg.groupSize || '10+ People'}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl border border-border/50 text-center">
                <Globe className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Language</p>
                <p className="font-bold text-sm">{pkg.languages || 'English, Hindi'}</p>
              </div>
            </div>

            {/* Overview */}
            <section className="space-y-4">
              <h3 className="text-2xl font-display font-bold">Tour Overview</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {pkg.description}
              </p>
            </section>

            {/* Gallery */}
            {pkg.gallery && pkg.gallery.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-2xl font-display font-bold">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {pkg.gallery.map((img, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ scale: 1.02 }}
                      className="aspect-square rounded-2xl overflow-hidden border border-border/50 shadow-sm"
                    >
                      <img src={img} className="w-full h-full object-cover" alt="" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <section className="space-y-6">
                <h3 className="text-2xl font-display font-bold">Tour Itinerary</h3>
                <div className="space-y-3">
                  {pkg.itinerary.map((item) => (
                    <div key={item.day} className="border rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-md transition-all">
                      <button 
                        onClick={() => setOpenDay(openDay === item.day ? null : item.day)}
                        className="w-full h-16 px-6 flex items-center justify-between font-bold text-left hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                            {item.day}
                          </span>
                          <span className="text-sm md:text-base">{item.title}</span>
                        </div>
                        {openDay === item.day ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <AnimatePresence>
                        {openDay === item.day && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed">
                              <Separator className="mb-4" />
                              <p className="whitespace-pre-wrap">{item.description}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {pkg.inclusions && pkg.inclusions.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-xl font-display font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Inclusions
                  </h3>
                  <ul className="space-y-2">
                    {pkg.inclusions.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {pkg.exclusions && pkg.exclusions.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-xl font-display font-bold flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-rose-500" /> Exclusions
                  </h3>
                  <ul className="space-y-2">
                    {pkg.exclusions.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

          </div>

          {/* Sidebar Booking */}
          <div className="space-y-6">
            <Card className="sticky top-24 border-none shadow-xl bg-card overflow-hidden">
              <div className="bg-primary p-6 text-white text-center">
                <p className="text-xs uppercase font-bold tracking-widest opacity-80">Starting from</p>
                <p className="text-4xl font-display font-bold mt-1">${pkg.price}</p>
                <p className="text-[10px] uppercase font-medium mt-1 opacity-60">Per Person / All Inclusive</p>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <Button className="w-full h-12 rounded-xl text-md font-bold" size="lg" onClick={handleWhatsApp}>
                    Quick Booking
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-xl text-md font-bold gap-2" size="lg" onClick={handleWhatsApp}>
                    <MessageSquare className="w-4 h-4" /> WhatsApp Us
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <p className="font-bold text-center text-sm uppercase tracking-widest text-muted-foreground/80">Send Inquiry</p>
                  <InquiryForm packageId={pkg.id} packageName={pkg.name} onSubmit={(values) => onInquiry(values, pkg)} />
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 text-center space-y-2">
              <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Need Help?</p>
              <p className="text-lg font-bold">+91 {whatsappNumber}</p>
              <p className="text-[10px] text-muted-foreground">Available Mon-Sat 9AM-7PM</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
