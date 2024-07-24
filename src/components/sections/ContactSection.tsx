import { contactItems } from '@/lib/items/contactItem';
import ContactCard from '../cards/ContactCard';

export default function ContactSection() {
  return (
    <div className='space-y-4'>
      <h2 className='text-4xl font-bold'>Get In Touch</h2>
      <div className='flex md:flex-row flex-col items-center gap-6'>
        {contactItems.map((item) => (
          <ContactCard key={item.href} item={{ ...item }} />
        ))}
      </div>
    </div>
  );
}
