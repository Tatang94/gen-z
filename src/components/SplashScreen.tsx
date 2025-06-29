import React, { useEffect, useState } from 'react';
import { Zap, Heart, MessageCircle, Share2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);

  const texts = [
    "Connecting Gen-Z...",
    "Loading Stories...",
    "Preparing Your Feed...",
    "Almost Ready!"
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const textInterval = setInterval(() => {
      setCurrentText(prev => (prev + 1) % texts.length);
    }, 1200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center z-50">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full animate-ping"></div>
      </div>

      <div className="relative z-10 text-center text-white">
        {/* Logo Area */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white/30 mb-4">
              <Zap className="w-12 h-12 text-white animate-pulse" />
            </div>
            
            {/* Floating Icons */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center animate-bounce">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div className="absolute top-1/2 -right-4 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center animate-bounce" style={{ animationDelay: '1s' }}>
              <Share2 className="w-3 h-3 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
            GEN-Z
          </h1>
          <p className="text-xl font-light text-white/90">Social Media Platform</p>
        </div>

        {/* Loading Text */}
        <div className="mb-8">
          <p className="text-lg font-medium text-white/90 h-6 transition-all duration-500">
            {texts[currentText]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="bg-white/20 rounded-full h-2 backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-white to-pink-200 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-white/70 mt-2">{progress}%</p>
        </div>

        {/* Fun Facts */}
        <div className="mt-8 text-sm text-white/60">
          <p>✨ Connecting millions of Gen-Z users worldwide</p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;