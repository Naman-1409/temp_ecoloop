import React from 'react';
import { useNavigate } from 'react-router-dom';
import MapNode from './MapNode';
import { useGame } from '../../context/GameContext';
import { 
    Cloud, Trees, Mountain, Building2, Waves, Rocket, 
    Bird, Fish, Ship, Car, Tent, Flower, Star, Sun, Moon 
} from 'lucide-react';

const GameMap = () => {
    const navigate = useNavigate();
    const { user, getLevelStatus } = useGame();
    
    // Define levels with thematic zones - adjust Y for longer map
    // Adjusted Level 1 up to 85% to give space for the Start Button at the bottom
    const levels = [
        { id: 1, x: 50, y: 85, theme: 'forest', label: 'Green Forest' },
        { id: 2, x: 20, y: 68, theme: 'river', label: 'Clean River' },
        { id: 3, x: 80, y: 48, theme: 'city', label: 'Eco City' },
        { id: 4, x: 30, y: 28, theme: 'mountain', label: 'Windy Peak' },
        { id: 5, x: 50, y: 8, theme: 'sky', label: 'Space Station' },
    ];

    const getStatus = (levelId) => {
        // Use Context Helper
        return getLevelStatus(levelId);
    };

    const handleLevelClick = (levelId) => {
        navigate(`/level/${levelId}`);
    };

    // Dynamic Path Generation ensuring line passes through nodes
    const generatePath = () => {
        if (levels.length === 0) return '';
        
        // Start at first level
        let path = `M ${levels[0].x} ${levels[0].y}`;
        
        // Simple smooth curve strategy:
        // Use a cubic bezier C from current to next
        for (let i = 0; i < levels.length - 1; i++) {
            const current = levels[i];
            const next = levels[i + 1];
            
            const p1 = current;
            const p2 = next;
            const cy = (p2.y - p1.y) * 0.5;

            // Simplified S-curve control points:
            // This creates a vertical S-curve. 
            // Control Point 1: Same X as current, Y midpoint
            // Control Point 2: Same X as next, Y midpoint
            path += ` C ${p1.x} ${p1.y + cy}, ${p2.x} ${p2.y - cy}, ${p2.x} ${p2.y}`;
        }
        
        return path;
    };
    
    const pathData = generatePath();

    return (
        <div className="relative w-full min-h-[1400px] rounded-t-3xl overflow-hidden shadow-2xl border-x-8 border-t-8 border-white/50 bg-sky-300 mx-auto max-w-full">
            {/* ... Background Layers ... */}
            
            {/* 1. Sky Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-600 to-sky-300"></div>

            {/* --- DECORATIONS --- */}
            
            {/* ZONE 5: SPACE (Top 15%) */}
            <div className="absolute top-0 w-full h-[15%]">
                <Moon className="absolute top-10 left-10 text-yellow-100 opacity-80 animate-pulse" size={60} />
                <div className="absolute top-20 right-20 animate-bounce delay-1000">
                    <Rocket size={50} className="text-white transform rotate-45" />
                </div>
                {[...Array(20)].map((_, i) => (
                    <Star 
                        key={`star-${i}`}
                        size={Math.random() * 10 + 4} 
                        className="text-white absolute animate-pulse"
                        fill="white"
                        style={{ 
                            top: `${Math.random() * 100}%`, 
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`
                        }}
                    />
                ))}
            </div>

            {/* ZONE 4: MOUNTAIN (15% - 35%) */}
            <div className="absolute top-[15%] w-full h-[20%]">
                 <Mountain size={500} className="absolute top-10 left-[-10%] text-slate-400 opacity-80" fill="currentColor" />
                 <Mountain size={300} className="absolute top-20 right-[-5%] text-slate-500 opacity-70" fill="currentColor" />
                 <Cloud size={60} className="absolute top-10 left-[20%] text-white/80 animate-[float_40s_linear_infinite]" fill="white"/>
                 <Cloud size={80} className="absolute top-20 right-[30%] text-white/60 animate-[float_50s_linear_infinite_reverse]" fill="white"/>
                 <Bird size={32} className="absolute top-10 left-1/3 text-slate-800 animate-[float_15s_linear_infinite]" />
            </div>

            {/* ZONE 3: CITY (35% - 55%) */}
            <div className="absolute top-[35%] w-full h-[20%]">
                 <div className="absolute bottom-0 w-full flex items-end justify-center opacity-40 text-indigo-900 gap-2">
                     <Building2 size={100} />
                     <Building2 size={140} />
                     <Building2 size={80} />
                     <Building2 size={180} />
                     <Building2 size={120} />
                     <Building2 size={90} />
                 </div>
                 <div className="absolute bottom-4 w-full h-2 bg-indigo-900/30"></div>
                 <Car size={24} className="absolute bottom-6 left-[10%] text-yellow-400 animate-[float_10s_linear_infinite]" />
                 <Car size={24} className="absolute bottom-6 left-[60%] text-red-400 animate-[float_8s_linear_infinite]" />
            </div>

            {/* ZONE 2: RIVER (55% - 75%) */}
            <div className="absolute top-[55%] w-full h-[20%] overflow-hidden">
                 <div className="absolute inset-0 bg-blue-500/20 transform skew-y-[-2deg] origin-left"></div>
                 <Waves className="absolute bottom-10 left-0 w-full text-blue-300 opacity-50 h-20 animate-pulse" />
                 <Ship size={48} className="absolute top-1/2 left-[20%] text-white animate-[float_20s_linear_infinite]" />
                 <Fish size={20} className="absolute bottom-10 right-[20%] text-orange-400 animate-bounce" />
                 <Fish size={24} className="absolute bottom-14 right-[30%] text-yellow-400 animate-ping" />
            </div>

            {/* ZONE 1: FOREST (75% - 100%) */}
            <div className="absolute top-[75%] w-full h-[25%] bg-gradient-to-t from-green-600 to-green-300 clip-path-hill">
                 {[...Array(15)].map((_, i) => (
                    <Trees 
                        key={`tree-${i}`}
                        size={Math.random() * 40 + 40}
                        className="absolute text-green-800 opacity-60"
                        style={{
                            bottom: `${Math.random() * 60 + 10}%`,
                            left: `${Math.random() * 90}%`
                        }}
                    />
                 ))}
                 <Tent size={48} className="absolute bottom-20 left-20 text-orange-600" fill="currentColor" />
                 <div className="absolute bottom-24 left-32 text-orange-500 animate-pulse">🔥</div>
                 {[...Array(10)].map((_, i) => (
                    <Flower 
                        key={`flower-${i}`}
                        size={16}
                        className={`${i % 2 === 0 ? 'text-pink-500' : 'text-yellow-500'} absolute animate-bounce`}
                         style={{
                            bottom: `${Math.random() * 30}%`,
                            left: `${Math.random() * 90}%`,
                            animationDuration: `${Math.random() * 2 + 1}s`
                        }}
                    />
                 ))}
            </div>

            {/* PATH (Overlay) */}
            <svg 
                className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-xl z-10" 
                viewBox="0 0 100 100" 
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="pathGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="#dcfce7" />
                        <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                </defs>
                <path 
                    d={pathData} 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="1.2" 
                    strokeDasharray="1 3"
                    strokeLinecap="round"
                    className="opacity-90"
                />
                 {/* Animated Dash */}
                 <path 
                    d={pathData} 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="1.2" 
                    strokeDasharray="2 4"
                    strokeLinecap="round"
                    className="animate-[dash_60s_linear_infinite]"
                />
            </svg>

            {/* LEVEL NODES - Container must be absolute to fill min-height parent correctly */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                {levels.map((level) => (
                    <div key={level.id}>
                        {/* Wrapper div provides key, MapNode handles positioning relative to container */}
                        <div className="pointer-events-auto">
                            <MapNode 
                                level={level.id}
                                x={level.x}
                                y={level.y}
                                status={getStatus(level.id)}
                                onClick={handleLevelClick}
                            />
                        </div>
                        <div 
                           className="absolute transform -translate-x-1/2 text-xs font-black uppercase tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] bg-black/30 px-3 py-1 rounded-full backdrop-blur-md transition-all hover:scale-110 cursor-default border border-white/20"
                           style={{ left: `${level.x}%`, top: `${level.y + 5}%` }}
                        >
                            {level.label}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Start Button aligned with Level 1 */}
             <div 
                className="absolute transform -translate-x-1/2 bg-white px-8 py-3 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.6)] border-4 text-green-700 font-extrabold text-lg tracking-widest flex items-center gap-2 animate-bounce z-30 hover:scale-105 transition cursor-pointer"
                style={{ left: '50%', top: '96%' }}
             >
                <span>START ADVENTURE</span>
             </div>
        </div>
    );
};

export default GameMap;
