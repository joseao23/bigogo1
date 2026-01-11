import React, { useEffect, useState } from 'react';
import { Member } from '../types';

interface Props {
  member: Member;
  isAttending: boolean;
  isBirthday: boolean;
  onToggleAttendance: (id: string) => void;
}

const AttendanceRow: React.FC<Props> = ({ 
  member, 
  isAttending, 
  isBirthday, 
  onToggleAttendance 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation when attendance status changes
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 400); // Matches CSS duration
    return () => clearTimeout(timer);
  }, [isAttending]);

  return (
    <div className={`flex flex-col items-center p-3 transition-all duration-300 transform-gpu relative ${
      isAttending 
        ? 'bg-white active-row-glow' 
        : 'bg-gray-100 opacity-60'
    } ${isAnimating ? 'animate-row-bounce z-40' : 'z-0'} shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] rounded-sm`}>
      
      {/* Spacer for vertical consistency when no hat is present */}
      {!isBirthday && <div className="h-6 w-full" />}

      {/* Photo Container with Birthday Hat Overlay */}
      <div className="relative w-[90px] h-[90px] mb-4 z-10">
        
        {/* Dynamic Birthday Hat - Positioned dead center above the photo */}
        {isBirthday && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
            <div className="relative flex flex-col items-center animate-birthday-wiggle drop-shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              {/* Party Hat SVG */}
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2L5 35H35L20 2Z" fill="#E52521" stroke="white" strokeWidth="2"/>
                <circle cx="20" cy="2" r="3" fill="#FBD000" stroke="white" strokeWidth="1"/>
                <path d="M12 20L28 20" stroke="white" strokeWidth="2" strokeDasharray="2 2"/>
                <path d="M10 25L30 25" stroke="#FBD000" strokeWidth="2"/>
                <path d="M8 30L32 30" stroke="white" strokeWidth="2" strokeDasharray="2 2"/>
              </svg>
              {/* Text underneath the hat */}
              <div className="mario-font text-[5px] text-yellow-300 mt-0.5 tracking-tighter bg-black/80 px-1.5 py-1 rounded-sm whitespace-nowrap border-[1px] border-white/20">
                HAPPY BIRTHDAY
              </div>
            </div>
          </div>
        )}

        {/* The Square Photo itself - Fixed dimensions */}
        <div className={`w-full h-full flex items-center justify-center border-[3px] border-black overflow-hidden transition-all duration-300 transform bg-white shadow-[inset_0_0_8px_rgba(0,0,0,0.1)] ${
          isAttending 
            ? 'scale-100 rotate-0' 
            : 'scale-95 rotate-3 grayscale'
        }`}>
          <img 
            src={member.avatarUrl} 
            alt={member.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Combined Name and Toggle Row - Layered above photo (z-30) */}
      <div className="w-full flex flex-row items-center justify-center gap-2 z-30">
        {/* Name Segment - Increased font size */}
        <div className="flex items-center gap-1 py-0.5">
          <span className={`font-black text-xl transition-colors duration-300 whitespace-nowrap ${isAttending ? 'text-gray-900' : 'text-gray-400'}`} style={{ fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif' }}>
            {member.name}
          </span>
          {isBirthday && (
            <div className="animate-bounce shrink-0">
              {/* Cake icon - size increased by 2x (18 -> 36) */}
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="14" width="16" height="6" rx="1" fill="#FF85C0" stroke="black" strokeWidth="1"/>
                <rect x="6" y="10" width="12" height="4" rx="1" fill="#FFD666" stroke="black" strokeWidth="1"/>
                <path d="M4 14C4 14 6 12 8 12C10 12 11 14 13 14C15 14 17 12 20 12V14H4Z" fill="white" fillOpacity="0.8"/>
                <path d="M8.75 4C8.75 3 8 3 8.75 2C9.5 3 8.75 3 8.75 4Z" fill="#FF4D4F"/>
                <path d="M12 2C12 1 11.25 1 12 0C12.75 1 12 1 12 2Z" fill="#FF4D4F"/>
                <path d="M15.25 4C15.25 3 14.5 3 15.25 2C16 3 15.25 3 15.25 4Z" fill="#FF4D4F"/>
              </svg>
            </div>
          )}
        </div>

        {/* Toggle Button Segment */}
        <button 
          onClick={() => onToggleAttendance(member.id)}
          className={`w-10 h-10 border-2 border-black flex items-center justify-center transition-all duration-200 active:scale-90 hover:brightness-110 shrink-0 ${
            isAttending 
              ? 'bg-[#43B047] shadow-[2px_2px_0_0_#1a4a1b]' 
              : 'bg-gray-400 shadow-[2px_2px_0_0_#2a2a2a]'
          }`}
        >
          {isAttending && (
             <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
               <polyline points="20 6 9 17 4 12"></polyline>
             </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default AttendanceRow;