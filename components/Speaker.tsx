import React from 'react';

interface SpeakerProps {
  isPumping: boolean;
  isFeverMode: boolean;
}

export const Speaker: React.FC<SpeakerProps> = ({ isPumping, isFeverMode }) => {
  return (
    <div className="relative flex items-center justify-center z-10 pointer-events-none">
      {/* Base/Stand Shadow */}
      <div className="absolute -bottom-10 w-40 h-10 bg-black/40 blur-xl rounded-full transform scale-x-150"></div>

      {/* Main Body */}
      <div 
        className={`relative rounded-full shadow-2xl flex items-center justify-center transition-all duration-75 ease-out`}
        style={{
          width: '220px',
          height: '220px',
          backgroundColor: '#1a1a1a',
          transform: isPumping ? 'scale(1.05)' : 'scale(1)',
          boxShadow: isFeverMode 
            ? '0 0 50px rgba(168, 85, 247, 0.6), inset 0 0 20px rgba(255,255,255,0.1)' 
            : '0 20px 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.05)'
        }}
      >
        {/* Sphere Shading (Gradient Overlay) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-black/60 pointer-events-none"></div>

        {/* Mesh Texture */}
        <div className="absolute inset-2 rounded-full opacity-60 bg-[radial-gradient(circle,_#000_2px,_transparent_2.5px)] bg-[length:6px_6px] pointer-events-none"></div>

        {/* Top Highlight (Plastic gloss) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-16 bg-gradient-to-b from-white/20 to-transparent rounded-full blur-md"></div>

        {/* Center Control/Logo Area */}
        <div className="relative z-10 flex flex-col items-center justify-center animate-pulse-slow">
            {/* Triangular Logo mark */}
            <div className={`mb-2 transition-colors duration-300 ${isFeverMode ? 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'text-gray-400'}`}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                   <circle cx="12" cy="6" r="3" />
                   <circle cx="6" cy="16" r="3" />
                   <circle cx="18" cy="16" r="3" />
               </svg>
            </div>
            <span className={`font-outfit font-bold text-2xl tracking-widest uppercase ${isFeverMode ? 'text-white drop-shadow-[0_0_10px_white]' : 'text-gray-300'}`}>
                ambrane
            </span>
        </div>

        {/* Dynamic Glow Ring when pumping */}
        {isPumping && (
           <div className={`absolute inset-0 rounded-full border-4 ${isFeverMode ? 'border-purple-500' : 'border-blue-400'} opacity-50 blur-sm animate-ping`}></div>
        )}
      </div>
    </div>
  );
};