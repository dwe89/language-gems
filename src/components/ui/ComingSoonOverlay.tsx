import React from 'react';
import { Lock, Construction } from 'lucide-react';

interface ComingSoonOverlayProps {
    featureName: string;
    description?: string;
}

export const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({
    featureName,
    description = "We're currently fine-tuning this feature to ensure the best learning experience."
}) => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="max-w-md p-8 text-center mx-auto">
                <div className="relative inline-block mb-6">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-blue-600 to-violet-600 p-4 rounded-2xl shadow-xl border border-white/10">
                        <Construction className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-950 text-xs font-bold px-2 py-1 rounded-full border border-yellow-400 shadow-lg">
                        BETA
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3">
                    {featureName} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Coming Soon</span>
                </h3>

                <p className="text-slate-400 mb-8 leading-relaxed">
                    {description}
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm text-slate-300">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <span>Locked during Open Beta phase</span>
                </div>
            </div>
        </div>
    );
};
