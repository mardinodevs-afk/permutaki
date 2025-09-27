import LandingPage from '../LandingPage';

export default function LandingPageExample() {
  return (
    <LandingPage
      onLogin={(phone, password) => console.log('Login:', phone, password)}
      onRegister={(data) => console.log('Register:', data)}
    />
  );
}