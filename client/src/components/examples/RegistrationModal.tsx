import RegistrationModal from '../RegistrationModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function RegistrationModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="p-6">
      <Button onClick={() => setIsOpen(true)}>Open Registration Modal</Button>
      
      <RegistrationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSwitchToLogin={() => console.log('Switch to login')}
        onRegister={(data) => {
          console.log('Registration:', data);
          setIsOpen(false);
        }}
      />
    </div>
  );
}