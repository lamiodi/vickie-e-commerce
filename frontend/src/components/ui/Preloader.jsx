import React from 'react';

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-white">
      <div className="w-40 h-40 md:w-56 md:h-56 flex items-center justify-center">
        <img 
          src="/vickie-logo-high-res.jpg" 
          alt="Loading..." 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Preloader;
