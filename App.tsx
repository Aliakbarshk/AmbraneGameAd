
import React, { useEffect } from 'react';
import { useGameEngine } from './hooks/useGameEngine';
import { Speaker } from './components/Speaker';
import { GameCanvas } from './components/GameCanvas';
import { GameStatus } from './types';
import { MAX_FEVER, MAX_HEALTH, MISS_LIMIT, DIFFICULTY_CONFIG } from './constants';
import { Heart, Trophy, Volume2, Sparkles, RotateCcw, Play, Snowflake, Magnet, AlertTriangle, Clock, Home } from 'lucide-react';

export default function App() {
  const { 
    status, setStatus,
    score, 
    health, 
    fever, setFever,
    isFeverMode, setIsFeverMode,
    combo,
    missCount,
    difficulty,
    timeLeft,
    gameState,
    startGame, 
    interact, 
    update,
  } = useGameEngine();

  // Fever Drain Interval
  useEffect(() => {
    let interval: number;
    if (status === GameStatus.PLAYING && isFeverMode) {
      interval = window.setInterval(() => {
        setFever(prev => {
           const next = prev - 1.5;
           if (next <= 0) {
               setIsFeverMode(false);
               return 0;
           }
           return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [status, isFeverMode]);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-black font-outfit">
      
      {/* Background Gradient Layer */}
      <div 
         className="absolute inset-0 transition-colors duration-1000"
         style={{
            background: isFeverMode 
                ? 'radial-gradient(circle at center, #2e1065 0%, #000000 90%)' 
                : 'radial-gradient(circle at center, #0f172a 0%, #020617 90%)'
         }}
      ></div>

      {/* --- CANVAS LAYER (Game World) --- */}
      <GameCanvas 
         gameStateRef={gameState} 
         status={status}
         onInteract={interact} 
         update={update} 
      />

      {/* --- DOM LAYER (UI & Static Elements) --- */}
      
      {/* Central Speaker (Visual Anchor) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <Speaker isPumping={combo > 5} isFeverMode={isFeverMode} />
      </div>

      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-start z-50 pointer-events-none">
        <div className="flex flex-col gap-4 pointer-events-auto">
            {/* Health */}
            <div className="flex gap-2">
                {[...Array(MAX_HEALTH)].map((_, i) => (
                    <Heart 
                        key={i} 
                        className={`w-8 h-8 transition-all duration-300 drop-shadow-lg ${i < health ? 'fill-red-500 text-red-500' : 'fill-slate-900 text-slate-800'}`} 
                    />
                ))}
            </div>

            {/* Danger Meter (Miss Count) - Only for Normal/Hard */}
            {DIFFICULTY_CONFIG[difficulty].damageOnMiss && (
                <div className="flex flex-col gap-1">
                     <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest">
                        <AlertTriangle className="w-3 h-3" /> System Stability
                     </div>
                     <div className="w-48 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                         <div 
                             className={`h-full transition-all duration-200 ${missCount > 7 ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`}
                             style={{ width: `${(missCount / MISS_LIMIT) * 100}%` }}
                         ></div>
                     </div>
                </div>
            )}

            {/* Fever Bar */}
            <div className="w-48 h-6 bg-slate-900/80 rounded-full border border-slate-700 overflow-hidden relative shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                <div 
                    className={`h-full transition-all duration-100 ${isFeverMode ? 'bg-gradient-to-r from-fuchsia-600 to-yellow-400 animate-pulse' : 'bg-blue-600'}`}
                    style={{ width: `${(fever / MAX_FEVER) * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black tracking-widest text-white uppercase shadow-sm">
                    {isFeverMode ? 'FEVER ACTIVE' : 'FEVER'}
                </div>
            </div>
        </div>

        {/* Top Center Timer */}
        <div className="absolute left-1/2 -translate-x-1/2 top-6 flex items-center gap-2 pointer-events-auto">
             <div className={`flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 backdrop-blur-md transition-colors ${timeLeft <= 5 ? 'bg-red-900/60 border-red-500' : 'bg-black/40'}`}>
                <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-blue-300'}`} />
                <span className={`text-2xl font-mono font-bold ${timeLeft <= 5 ? 'text-red-400' : 'text-white'}`}>
                    0:{timeLeft.toString().padStart(2, '0')}
                </span>
             </div>
        </div>

        {/* Score */}
        <div className="text-right pointer-events-auto">
            <div className="flex items-center gap-3 bg-black/40 backdrop-blur px-6 py-2 rounded-2xl border border-white/10">
                <Trophy className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-4xl font-black text-white font-mono">{score.toLocaleString()}</span>
            </div>
            {combo > 1 && (
                <div className="text-yellow-400 font-black text-2xl mt-2 animate-bounce">
                    {combo}x COMBO
                </div>
            )}
             <div className="mt-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                MODE: {DIFFICULTY_CONFIG[difficulty].label}
            </div>
        </div>
      </div>

      {/* Menu Screen */}
      {status === GameStatus.MENU && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="text-center p-8 max-w-lg w-full animate-in fade-in zoom-in duration-300">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                    <Volume2 className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-6xl font-black text-white mb-2 tracking-tighter">BEAT<span className="text-cyan-400">RUSH</span></h1>
                <p className="text-slate-400 mb-8 font-medium">Catch the notes. Don't let the system crash.</p>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                     <button 
                         onClick={() => startGame('EASY')}
                         className="p-4 bg-emerald-500/20 border border-emerald-500/50 hover:bg-emerald-500 hover:text-white text-emerald-400 rounded-xl transition-all font-bold cursor-pointer"
                     >
                         CHILL
                         <div className="text-[10px] opacity-70 font-normal">No Penalty</div>
                     </button>
                     <button 
                         onClick={() => startGame('NORMAL')}
                         className="p-4 bg-blue-500/20 border border-blue-500/50 hover:bg-blue-500 hover:text-white text-blue-400 rounded-xl transition-all font-bold cursor-pointer"
                     >
                         POP
                         <div className="text-[10px] opacity-70 font-normal">Standard</div>
                     </button>
                     <button 
                         onClick={() => startGame('HARD')}
                         className="p-4 bg-red-500/20 border border-red-500/50 hover:bg-red-500 hover:text-white text-red-400 rounded-xl transition-all font-bold cursor-pointer"
                     >
                         METAL
                         <div className="text-[10px] opacity-70 font-normal">Hardcore</div>
                     </button>
                </div>
            </div>
        </div>
      )}

      {/* Game Over Screen */}
      {status === GameStatus.GAME_OVER && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl">
             <div className="text-center p-8 animate-in zoom-in duration-300 relative pointer-events-auto">
                <div className={`absolute inset-0 bg-gradient-to-r blur-3xl opacity-20 ${health > 0 ? 'from-green-500 to-blue-500' : 'from-red-500 to-orange-500'}`}></div>
                
                {health > 0 ? (
                    <>
                        <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300 mb-4 tracking-tighter uppercase">Session Complete</h2>
                        <div className="text-emerald-200 text-lg font-bold mb-8">TIME UP! YOU SURVIVED.</div>
                    </>
                ) : (
                    <>
                        <h2 className="text-6xl font-black text-red-500 mb-4 tracking-tighter uppercase">System Failure</h2>
                        <div className="text-red-300 text-lg font-bold mb-8">CRITICAL ERROR DETECTED.</div>
                    </>
                )}
                
                <div className="bg-white/10 p-6 rounded-2xl border border-white/10 mb-8 backdrop-blur-md shadow-2xl">
                    <div className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">Final Score</div>
                    <div className="text-white text-5xl font-mono font-black">{score.toLocaleString()}</div>
                    <div className="flex justify-center gap-4 mt-4 text-xs text-slate-400">
                        <span>MAX COMBO: {gameState.current.combo}</span>
                        <span>DIFFICULTY: {DIFFICULTY_CONFIG[difficulty].label}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <button 
                        onClick={() => startGame(difficulty)}
                        className="w-64 py-4 bg-white text-black text-xl font-black rounded-xl hover:bg-cyan-300 hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-cyan-500/20 cursor-pointer active:scale-95"
                    >
                        <RotateCcw className="w-6 h-6" /> RETRY
                    </button>

                    <button 
                        onClick={() => setStatus(GameStatus.MENU)}
                        className="flex items-center gap-2 px-6 py-2 text-slate-400 hover:text-white font-bold tracking-widest text-sm transition-colors cursor-pointer"
                    >
                        <Home className="w-4 h-4" /> MAIN MENU
                    </button>
                </div>
             </div>
        </div>
      )}

    </div>
  );
}
