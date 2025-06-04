import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const [videoEnded, setVideoEnded] = useState(false);

  useEffect(() => {
    // If video has ended, navigate to auth page after a short delay
    if (videoEnded) {
      const timer = setTimeout(() => {
        navigate('/auth');
      }, 500); // Half second delay after video ends

      return () => clearTimeout(timer);
    }
  }, [videoEnded, navigate]);

  return (
    <div className="fixed inset-0 w-full h-full bg-black">
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        onEnded={() => setVideoEnded(true)}
      >
        {/* Replace the source with your video file */}
        <source src="/sss.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Optional loading indicator or logo overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-white text-4xl font-bold">
          {/* Add your logo or text here */}
          
        </div>
      </div>
    </div>
  );
};

export default SplashScreen; 