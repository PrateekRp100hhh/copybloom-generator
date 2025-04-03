
import React from 'react';

const DashboardFooter: React.FC = () => {
  return (
    <footer className="py-6 border-t bg-white">
      <div className="container px-4 md:px-6">
        <p className="text-sm text-center text-gray-500">
          © {new Date().getFullYear()} CopyBloom. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default DashboardFooter;
