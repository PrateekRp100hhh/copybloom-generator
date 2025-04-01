
import React from 'react';
import { User } from '@/lib/auth';

interface DashboardHeaderProps {
  user: User | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  if (!user) return null;
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
      <p className="text-muted-foreground">Manage your marketing copy and campaigns</p>
    </div>
  );
};

export default DashboardHeader;
