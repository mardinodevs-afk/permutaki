import LoginModal from '../LoginModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function LoginModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="p-6">
      <Button onClick={() => setIsOpen(true)}>Open Login Modal</Button>
      
      <LoginModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSwitchToRegister={() => console.log('Switch to register')}
        onLogin={(phone, password) => {
          console.log('Login:', phone, password);
          setIsOpen(false);
        }}
      />
    </div>
  );
}