import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-slate-500 text-sm max-w-md mt-2 mb-8">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link to="/">
        <Button variant="primary" size="md">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Homepage
        </Button>
      </Link>
    </div>
  );
}