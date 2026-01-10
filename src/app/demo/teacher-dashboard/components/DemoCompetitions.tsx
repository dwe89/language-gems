
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy, Crown, Medal, Swords, Target, Flame, Users,
    Plus, ArrowRight, Zap, Star, Shield
} from 'lucide-react';
import { DEMO_COMPETITIONS } from '../../../../lib/demo/demoFeaturesData';

export function DemoCompetitions() {

    const renderHeader = () => (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    Competitions & Leaderboards
                    <span className="ml-3 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold uppercase rounded-full border border-yellow-200 tracking-wide">
                        Beta
                    </span>
                </h2>
                <p className="text-gray-600">Engage students with gamified challenges and rewards</p>
            </div>
            <button
                onClick={() => alert("Competition wizard disabled in demo")}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-indigo-700 flex items-center shadow-lg shadow-purple-200 transition-all hover:scale-105"
            >
                <Plus className="h-4 w-4 mr-2" />
                Create Challenge
            </button>
        </div>
    );

    const renderActiveCompetitions = () => (
        <div className="mb-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Flame className="h-5 w-5 text-orange-500 mr-2" />
                Active Battles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DEMO_COMPETITIONS.map((comp) => (
                    <div key={comp.id} className="bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-4 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Swords className="h-4 w-4 text-purple-200" />
                                        <span className="text-xs font-bold uppercase tracking-wider text-purple-100">{comp.type.replace('_', ' ')}</span>
                                    </div>
                                    <h4 className="text-xl font-bold">{comp.title}</h4>
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-white/30">
                                    Ends in {comp.endsIn}
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="space-y-4">
                                {comp.leaders.map((leader, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg shadow-sm border border-gray-200">
                                                {leader.avatar}
                                            </div>
                                            <span className={`font-medium ${idx === 0 ? 'text-gray-900' : 'text-gray-600'}`}>
                                                {leader.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${idx === 0 ? 'bg-yellow-400' : 'bg-purple-400'}`}
                                                    style={{ width: `${(leader.score / (comp.leaders[0].score * 1.1)) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 w-12 text-right">{leader.score.toLocaleString()}</span>
                                            {idx === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                <div className="flex items-center text-purple-700">
                                    <Trophy className="h-4 w-4 mr-1.5" />
                                    <span className="font-semibold">Prize:</span>
                                    <span className="ml-1 text-gray-600">{comp.topPrize}</span>
                                </div>
                                <div className="flex items-center text-gray-500">
                                    <Users className="h-4 w-4 mr-1.5" />
                                    {comp.participants} participants
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderGlobalLeaderboard = () => (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Target className="h-5 w-5 text-blue-500 mr-2" />
                    School Season Leaderboard
                </h3>
                <div className="flex gap-2 text-sm bg-gray-100 p-1 rounded-lg">
                    <button className="px-3 py-1 bg-white rounded shadow-sm font-medium text-gray-900">This Week</button>
                    <button className="px-3 py-1 text-gray-500 hover:text-gray-700 font-medium">All Time</button>
                </div>
            </div>

            <div className="space-y-4">
                {/* Mock list for global leaderboard */}
                {[
                    { rank: 1, name: 'Emma S.', class: '10-FR', xp: 4500, avatar: '🦊', trend: 'up' },
                    { rank: 2, name: 'Lucas M.', class: '11-SP', xp: 4230, avatar: '🦁', trend: 'same' },
                    { rank: 3, name: 'Sarah J.', class: '10-FR', xp: 4100, avatar: '🐼', trend: 'up' },
                    { rank: 4, name: 'Mike T.', class: '9-DE', xp: 3850, avatar: '🐯', trend: 'down' },
                    { rank: 5, name: 'Jenny L.', class: '10-SP', xp: 3620, avatar: '🐨', trend: 'up' },
                ].map((student) => (
                    <div key={student.rank} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                ${student.rank === 1 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-200' :
                                    student.rank === 2 ? 'bg-gray-100 text-gray-600 ring-2 ring-gray-200' :
                                        student.rank === 3 ? 'bg-orange-100 text-orange-700 ring-2 ring-orange-200' : 'text-gray-400'}
                           `}>
                                {student.rank}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl shadow-sm border border-gray-100">
                                {student.avatar}
                            </div>
                            <div>
                                <div className="font-bold text-gray-900">{student.name}</div>
                                <div className="text-xs text-gray-500 font-medium">{student.class}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <div className="font-bold text-blue-600">{student.xp.toLocaleString()} XP</div>
                                <div className="text-xs text-green-500 flex justify-end items-center">
                                    <Zap className="h-3 w-3 mr-0.5" />
                                    Active
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm">
                View Full Leaderboard
            </button>
        </div>
    );

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {renderHeader()}
            {renderActiveCompetitions()}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {renderGlobalLeaderboard()}
                </div>

                {/* Badges / Achievements Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl" />
                        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-pink-500 opacity-20 rounded-full blur-2xl" />

                        <h3 className="text-lg font-bold mb-4 flex items-center relative z-10">
                            <Shield className="h-5 w-5 mr-2" />
                            Class Achievements
                        </h3>

                        <div className="space-y-4 relative z-10">
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 flex items-center gap-3">
                                <div className="p-2 bg-yellow-400 rounded-lg text-yellow-900 shadow-sm">
                                    <Star className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">5 Day Streak</div>
                                    <div className="text-xs text-purple-200">Year 10 French</div>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 flex items-center gap-3">
                                <div className="p-2 bg-green-400 rounded-lg text-green-900 shadow-sm">
                                    <Medal className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Vocab Masters</div>
                                    <div className="text-xs text-purple-200">Year 9 German</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
