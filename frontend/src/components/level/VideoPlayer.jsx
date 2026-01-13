import React, { useState, useEffect } from 'react';
import { Play, CheckCircle } from 'lucide-react';

const VideoPlayer = ({ onComplete, levelData }) => {
    // Backend should send video_id, else fallback
    const videoId = levelData?.video_id || "J1Gg3A9hVl0"; 
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval;
        if (isPlaying && progress < 100) {
            // "Watch" the video. 
            // In a real implementation this would hook into the YouTube Player API 'onStateChange'
            // For now, we simulate a 6-minute video being watched in compressed time (e.g. 10 sec for demo)
            interval = setInterval(() => {
                setProgress((prev) => {
                    const next = prev + 1;
                    if (next >= 100) {
                        clearInterval(interval);
                        // Show "Take Quiz" button logic is handled by parent or local state
                        return 100;
                    }
                    return next;
                });
            }, 100); 
        } 
        return () => clearInterval(interval);
    }, [isPlaying, progress]);

    return (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-4xl w-full mx-auto relative group">
             {/* Video Container (Aspect Ratio 16:9) */}
            <div className="relative pb-[56.25%] h-0 bg-black">
                {/* DEBUG: Remove in production */}
                <div className="absolute top-0 right-0 z-50 bg-red-500 text-white text-xs p-1">
                    ID: {videoId}
                </div>

                {!isPlaying ? (
                    <div className="absolute inset-0 bg-gray-900 cursor-pointer group" onClick={() => setIsPlaying(true)}>
                        <img 
                            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                            alt="Cover"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition"
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x450?text=No+Thumbnail'; }}
                        />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/20 backdrop-blur-md p-6 rounded-full group-hover:scale-110 transition shadow-2xl border-2 border-white/50">
                                <Play className="w-16 h-16 text-white ml-2 fill-current" />
                            </div>
                        </div>
                        <div className="absolute bottom-6 left-6 text-white text-left z-10">
                            <div className="bg-green-600/90 px-3 py-1 rounded text-sm font-bold inline-block mb-2">EDUCATIONAL VIDEO</div>
                            <h3 className="text-3xl font-bold text-shadow-lg">{levelData?.title || "Eco Lesson"}</h3>
                            <p className="font-semibold opacity-90">Watch to unlock the quiz!</p>
                        </div>
                    </div>
                ) : (
                    <iframe 
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                        title="Educational Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                )}
            </div>

            {/* Completion State */}
            {progress === 100 && (
                <div className="p-6 bg-green-100 flex items-center justify-between animate-fade-in-up">
                    <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                            <h4 className="font-bold text-green-800">Lesson Completed!</h4>
                            <p className="text-sm text-green-700">You earned +50 XP for watching.</p>
                        </div>
                    </div>
                    <button 
                        onClick={onComplete}
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg transform active:scale-95 transition"
                    >
                        Start Quiz →
                    </button>
                </div>
            )}

            {/* Progress Bar (Only show if playing and not done) */}
            {isPlaying && progress < 100 && (
                <div className="bg-green-800 h-2 w-full">
                     <div 
                        className="bg-green-400 h-full transition-all duration-300 ease-linear shadow-[0_0_10px_rgba(74,222,128,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
