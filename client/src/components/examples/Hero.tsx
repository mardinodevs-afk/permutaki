import Hero from '../Hero';

export default function HeroExample() {
  return (
    <Hero 
      onLoginClick={() => console.log('Login clicked')}
      onRegisterClick={() => console.log('Register clicked')}
    />
  );
}