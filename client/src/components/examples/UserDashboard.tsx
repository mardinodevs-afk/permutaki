import UserDashboard from '../UserDashboard';

export default function UserDashboardExample() {
  return (
    <UserDashboard
      onLogout={() => console.log('Logout clicked')}
    />
  );
}