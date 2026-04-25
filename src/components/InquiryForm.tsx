import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package } from '../types';

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal('')),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  selectedPackage?: Package;
  onSubmit: (values: InquiryFormValues) => void;
  isSubmitting?: boolean;
}

export function InquiryForm({ selectedPackage, onSubmit, isSubmitting }: InquiryFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: selectedPackage ? `I am interested in the ${selectedPackage.name} package. Please provide more details.` : '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {selectedPackage && (
        <div className="bg-muted p-4 rounded-lg mb-6 flex items-center gap-4">
          <img src={selectedPackage.image} className="w-16 h-16 rounded object-cover" alt="" />
          <div>
            <p className="text-sm font-medium">Inquiry for:</p>
            <p className="font-bold">{selectedPackage.name}</p>
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" placeholder="John Doe" {...register('name')} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" placeholder="+1 234 567 8900" {...register('phone')} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email (Optional)</Label>
          <Input id="email" placeholder="john@example.com" type="email" {...register('email')} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea 
          id="message"
          placeholder="Tell us what you are looking for..." 
          className="min-h-[120px]"
          {...register('message')} 
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}
