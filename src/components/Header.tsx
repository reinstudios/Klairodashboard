import React from 'react';
import { Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from 'figma:asset/71db4ddb4dff2b50b549faea40c66d8a85b2e660.png';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#F9F8F4]/80 backdrop-blur-md border-b border-gray-100/50 max-w-[100vw]">
      {/* Centered Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Link to="/">
          <div className="w-24 md:w-28">
            <ImageWithFallback
              src={logoImage}
              alt="Klairo Logo"
              className="w-full h-auto object-contain"
            />
          </div>
        </Link>
      </div>

      {/* Left: Brand guidelines link */}
      <div>
        <Link
          to="/brand"
          className="text-sm font-medium text-[#888888] hover:text-[#1C1C1C] transition-colors px-4 py-2 hidden md:inline-block"
        >
          Brand
        </Link>
      </div>

      {/* Right: Log in */}
      <div className="ml-auto">
        <Link
          to="/dashboard"
          className="text-sm font-medium text-[#1C1C1C] hover:text-[#555555] transition-colors px-4 py-2"
        >
          Log in
        </Link>
      </div>
    </header>
  );
};
