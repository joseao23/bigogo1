
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MEMBERS, MONTH_NAMES, MONTHLY_CONTRIBUTION, MAX_ABSENCES_FOR_BONUS } from './constants';
import { MonthlyRecord, YearEndSummary } from './types';
import { calculateMonth, calculateYearEnd } from './services/calculator';
import AttendanceRow from './components/AttendanceRow';

const App: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [records, setRecords] = useState<MonthlyRecord[]>(() => {
    const saved = localStorage.getItem('dinner_pool_records');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((r: MonthlyRecord) => ({
        ...r,
        birthdayIds: MEMBERS.filter(m => m.birthdayMonth === r.month + 1).map(m => m.id)
      }));
    }
    return Array.from({ length: 12 }, (_, i) => ({
      month: i,
      attendeeIds: MEMBERS.map(m => m.id),
      birthdayIds: MEMBERS.filter(m => m.birthdayMonth === i + 1).map(m => m.id),
      actualExpense: 0,
    }));
  });

  const [activeMonth, setActiveMonth] = useState(0);
  const [isSpentAnimating, setIsSpentAnimating] = useState(false);
  const [isBudgetAnimating, setIsBudgetAnimating] = useState(false);

  useEffect(() => {
    localStorage.setItem('dinner_pool_records', JSON.stringify(records));
  }, [records]);

  const activeRecord = records[activeMonth];
  const monthlyCalculation = useMemo(() => calculateMonth(activeRecord), [activeRecord]);
  const yearEndSummary = useMemo(() => calculateYearEnd(records), [records]);

  // Trigger animation when the actual expense of the ACTIVE record changes
  useEffect(() => {
    if (activeRecord.actualExpense > 0) {
      setIsSpentAnimating(true);
      const timer = setTimeout(() => setIsSpentAnimating(false), 400);
      return () => clearTimeout(timer);
    }
  }, [activeRecord.actualExpense, activeMonth]);

  // Trigger animation when the available budget changes
  useEffect(() => {
    setIsBudgetAnimating(true);
    const timer = setTimeout(() => setIsBudgetAnimating(false), 400);
    return () => clearTimeout(timer);
  }, [monthlyCalculation.availableBudget]);

  const updateRecord = (month: number, updates: Partial<MonthlyRecord>) => {
    setRecords(prev => prev.map(r => r.month === month ? { ...r, ...updates } : r));
  };

  const toggleAttendance = (memberId: string) => {
    const current = activeRecord.attendeeIds;
    const next = current.includes(memberId) 
      ? current.filter(id => id !== memberId)
      : [...current, memberId];
    updateRecord(activeMonth, { attendeeIds: next });
  };

  const exportRecords = () => {
    const dataStr = JSON.stringify(records, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `dinner_pool_records_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = event.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') return;
        const parsed = JSON.parse(content);
        // Basic validation: must be an array of 12 records
        if (Array.isArray(parsed) && parsed.length === 12) {
          setRecords(parsed);
          alert('匯入記錄成功！');
        } else {
          alert('無效的記錄格式。');
        }
      } catch (err) {
        alert('匯入失敗，檔案可能已損壞。');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    fileReader.readAsText(files[0]);
  };

  const heitiFont = { fontFamily: '"Microsoft JhengHei", "Heiti TC", sans-serif' };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 space-y-8">
      {/* Header - Mario Scoreboard */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left flex items-center gap-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-8 pipe-top z-10"></div>
            <div className="w-16 h-12 pipe-green border-x-4 border-black border-b-4 -mt-1 shadow-[inset:2px_2px_0_rgba(255,255,255,0.3)]"></div>
          </div>
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl text-white drop-shadow-[4px_4px_0px_#E52521] font-black tracking-tight transition-transform duration-300 hover:scale-105 cursor-pointer" style={heitiFont}>
                貝戈戈會計系統
              </h1>
              
              {/* SAVE / LOAD Icons */}
              <div className="flex gap-2">
                <button 
                  onClick={exportRecords}
                  title="SAVE"
                  className="w-10 h-10 bg-[#049CD8] hover:bg-[#007ba8] text-white border-2 border-white flex flex-col items-center justify-center transition-all active:scale-90 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] group"
                >
                  <span className="text-xs">💾</span>
                  <span className="mario-font text-[5px] mt-0.5 group-hover:scale-110">SAVE</span>
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  title="LOAD"
                  className="w-10 h-10 bg-[#43B047] hover:bg-[#2e7d32] text-white border-2 border-white flex flex-col items-center justify-center transition-all active:scale-90 shadow-[2px_2px_0_0_rgba(0,0,0,0.5)] group"
                >
                  <span className="text-xs">📂</span>
                  <span className="mario-font text-[5px] mt-0.5 group-hover:scale-110">LOAD</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImport} 
                  accept=".json" 
                  className="hidden" 
                />
              </div>
            </div>
            <p className="mario-font text-[10px] text-yellow-300 mt-2 tracking-widest uppercase opacity-80">ACCOUNTING SYSTEM</p>
          </div>
        </div>

        <div className="bg-black border-4 border-white p-4 flex gap-6 items-center text-white shadow-[8px_8px_0_0_rgba(255,255,255,0.1)]">
          <div className="text-center">
            <p className="mario-font text-[7px] mb-2 text-yellow-400">TOTAL POOL 💰</p>
            <p className="mario-font text-xl">${yearEndSummary.totalBonusPool}</p>
          </div>
          <div className="w-1 h-12 bg-white/20"></div>
          <div className="text-center">
            <p className="mario-font text-[7px] mb-2 text-emerald-400">WINNERS ⭐</p>
            <p className="mario-font text-xl">{yearEndSummary.eligibleMemberIds.length}</p>
          </div>
          <div className="w-1 h-12 bg-white/20"></div>
          <div className="text-center">
            <p className="mario-font text-[7px] mb-2 text-pink-400">EST. REWARD 🌟</p>
            <p className="mario-font text-xl text-yellow-300">${Math.floor(yearEndSummary.bonusPerPerson).toLocaleString()}</p>
          </div>
        </div>
      </header>

      {/* Side-by-Side Control Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
        {/* Section 1: Month Select - Narrower column */}
        <div className="lg:col-span-4 stone-wall-pattern shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] flex flex-col">
          <div className="bg-[#E52521] px-4 py-2 border-b-4 border-white flex justify-between items-center">
            <h2 className="mario-font text-[8px] text-white uppercase">Select Stage</h2>
            <div className="text-white text-xs">🧱</div>
          </div>
          
          <div className="p-3 grid grid-cols-4 sm:grid-cols-6 gap-1.5 flex-grow items-center">
            {MONTH_NAMES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveMonth(idx)}
                className={`aspect-square flex items-center justify-center border-2 text-[10px] font-bold transition-all transform active:scale-90 ${
                  activeMonth === idx 
                  ? 'bg-[#FBD000] border-black text-black shadow-[inset:2px_2px_0px_white]' 
                  : 'bg-black/50 border-white/50 text-white hover:border-white shadow-[inset:2px_2px_0px_rgba(255,255,255,0.1)]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Stage Stats & Spent Input - Wider column */}
        <div className="lg:col-span-8 question-block border-4 border-white p-4 space-y-4 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <h2 className="mario-font text-[10px] text-black uppercase">Stage Stats</h2>
             <div className="coin-float text-3xl">🪙</div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-6">
            <div className="space-y-4">
              <div className="flex flex-col border-b-2 border-black/10 pb-1">
                <span className="mario-font text-[6px] text-black/50 uppercase">Budget</span>
                <p className={`mario-font text-xl text-black inline-block ${isBudgetAnimating ? 'animate-budget-jump' : ''}`}>
                  ${monthlyCalculation.availableBudget}
                </p>
              </div>
              <div className="flex flex-col border-b-2 border-black/10 pb-1">
                <span className="mario-font text-[6px] text-black/50 uppercase">Collected</span>
                <p className="mario-font text-xl text-blue-700">+${monthlyCalculation.absentContribution + monthlyCalculation.surplus}</p>
              </div>
              <div className="flex flex-col">
                <span className="mario-font text-[6px] text-black/50 uppercase">Extra Cost</span>
                <p className="mario-font text-xl text-red-600">
                  {monthlyCalculation.extraPerPerson > 0 ? `$${Math.ceil(monthlyCalculation.extraPerPerson)}` : '$0'}
                </p>
              </div>
            </div>

            <div className="bg-black/5 p-3 border-2 border-black/20 flex flex-col justify-center items-center gap-2">
              <label className="mario-font text-[10px] text-black text-center uppercase">Actual Spent Amount</label>
              <div className="relative w-full">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 mario-font text-xl text-black/30">$</span>
                <input 
                  type="number"
                  value={activeRecord.actualExpense || ''}
                  placeholder="0"
                  onChange={(e) => updateRecord(activeMonth, { actualExpense: Number(e.target.value) })}
                  className={`w-full bg-white border-4 border-black px-4 py-4 pl-12 mario-font text-3xl text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] transition-all ${isSpentAnimating ? 'animate-input-success' : ''}`}
                />
              </div>
              <p className="text-[10px] text-black/40 font-bold italic text-center mt-1">INPUT STAGE DINNER COST</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Party Section with Integrated Rankings */}
      <section className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] overflow-hidden">
        <div className="bg-[#049CD8] px-6 py-4 border-b-4 border-black flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏰</span>
            <h2 className="text-lg text-white font-bold uppercase tracking-widest" style={heitiFont}>
              {MONTH_NAMES[activeMonth]} PARTY
            </h2>
          </div>
          <div className="mario-font text-[8px] text-white/70">WORLD {activeMonth + 1}-1</div>
        </div>
        
        {/* Adjusted grid for exactly 4 columns on larger screens (md and up) */}
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {MEMBERS.map(m => (
            <AttendanceRow 
              key={m.id}
              member={m}
              isAttending={activeRecord.attendeeIds.includes(m.id)}
              isBirthday={m.birthdayMonth === activeMonth + 1}
              onToggleAttendance={toggleAttendance}
            />
          ))}

          {/* Integrated Ranking Tile */}
          <div className="flex flex-col castle-pattern p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] text-white">
            <div className="flex justify-between items-center border-b border-white/20 pb-1 mb-2">
              <span className="mario-font text-[7px] text-yellow-400 uppercase">Rankings</span>
              <span className="text-sm">🚩</span>
            </div>
            <div className="space-y-1.5 overflow-y-auto max-h-[120px] pr-1 custom-scrollbar">
              {[...MEMBERS].sort((a, b) => yearEndSummary.attendanceStats[a.id] - yearEndSummary.attendanceStats[b.id]).map(m => {
                const count = yearEndSummary.attendanceStats[m.id];
                const isEligible = count <= MAX_ABSENCES_FOR_BONUS;
                return (
                  <div key={m.id} className="flex justify-between items-center text-[10px] leading-tight">
                    <span className="flex items-center gap-1">
                      <span>{isEligible ? '🟢' : '💀'}</span>
                      <span style={heitiFont} className="drop-shadow-sm">{m.name}</span>
                    </span>
                    <span className="mario-font text-[6px] opacity-70">{count} MISS</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 pt-1 border-t border-white/10 text-center">
               <span className="mario-font text-[5px] text-blue-300">BEST PLAYER STATUS</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-12">
        <p className="mario-font text-[8px] text-white opacity-40 tracking-widest uppercase">
          VERSION 1.0 2026.01
        </p>
      </footer>
    </div>
  );
};

export default App;
