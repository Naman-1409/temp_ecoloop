import React from 'react';
import Header from '../components/common/Header';
import GameMap from '../components/map/GameMap';

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-green-50 pb-20 overflow-x-hidden">
            <Header />
            
            <main className="w-full px-4 flex flex-col items-center">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-green-800 mb-2">My Journey</h1>
                    <p className="text-gray-600">Complete levels to earn coins and save the planet!</p>
                </div>

                <div className="w-full h-full flex-1">
                    <GameMap />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
