import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { FiAlertOctagon } from 'react-icons/fi';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 text-center">
      <FiAlertOctagon className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
      <h1 className="text-4xl font-extrabold mb-2">404 - Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mb-6">
        The requested screen does not exist or you don't have authorization to view it.
      </p>
      <Button variant="primary" onClick={() => navigate('/login')}>
        Return to Login / Dashboard
      </Button>
    </div>
  );
};
