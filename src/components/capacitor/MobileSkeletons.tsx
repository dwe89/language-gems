import React from 'react';

export function GameCardSkeleton() {
    return (
        <div className="bg-[#24243e] rounded-xl p-4 animate-pulse">
            <div className="w-full h-32 bg-white/5 rounded-lg mb-4" />
            <div className="h-6 w-3/4 bg-white/10 rounded mb-2" />
            <div className="h-4 w-1/2 bg-white/5 rounded" />
        </div>
    );
}

export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-[#24243e] p-4 rounded-xl animate-pulse">
                    <div className="h-8 w-8 bg-white/10 rounded-full mb-2" />
                    <div className="h-6 w-12 bg-white/10 rounded mb-1" />
                    <div className="h-4 w-20 bg-white/5 rounded" />
                </div>
            ))}
        </div>
    );
}

export function ListItemSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center p-4 bg-[#24243e] rounded-xl animate-pulse">
                    <div className="w-10 h-10 bg-white/10 rounded-full mr-4" />
                    <div className="flex-1">
                        <div className="h-5 w-1/3 bg-white/10 rounded mb-2" />
                        <div className="h-4 w-1/2 bg-white/5 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ProfileSkeleton() {
    return (
        <div className="flex flex-col items-center animate-pulse">
            <div className="w-24 h-24 bg-white/10 rounded-full mb-4" />
            <div className="h-8 w-48 bg-white/10 rounded mb-2" />
            <div className="h-4 w-32 bg-white/5 rounded" />
        </div>
    );
}
