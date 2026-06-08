import React from 'react';
import { X, BookOpen, Activity, Target, Flame, History, Settings } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in scale-in duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">LiftShift User Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10 text-slate-300">
          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              🚀 Getting Started
            </h3>
            <p className="leading-relaxed">
              LiftShift transforms your workout data from apps like <strong className="text-white">Hevy, Strong, and Lyfta</strong> into actionable insights. All processing happens locally in your browser for maximum privacy.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              GUI Usage Guide
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-emerald-400 font-medium mb-1">Getting Around</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                    <li><strong className="text-slate-100">Top Bar:</strong> Update Data (sync), Preferences, and Calendar Filters.</li>
                    <li><strong className="text-slate-100">Tabs:</strong> Dashboard, Exercises, Muscle, History, and Flex views.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-medium mb-1 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Dashboard In-Depth
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                    <li><strong className="text-slate-100">Volume vs average:</strong> Compare recent work against your historical data.</li>
                    <li><strong className="text-slate-100">Interactive Heatmap:</strong> Click any muscle to filter dashboard stats.</li>
                    <li><strong className="text-slate-100">Activity Grid:</strong> View your training frequency over the last year.</li>
                  </ul>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-emerald-400 font-medium mb-1 flex items-center gap-2">
                    <Flame className="w-4 h-4" />
                    Exercises & 1RM
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                    <li><strong className="text-slate-100">Search:</strong> Quickly find exercises by name or category.</li>
                    <li><strong className="text-slate-100">PR History:</strong> Tracks all weight and volume records.</li>
                    <li><strong className="text-slate-100">Trend Logic:</strong> Choose "Stable" or "Reactive" in Settings.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-emerald-400 font-medium mb-1 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    History & Coaching
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                    <li><strong className="text-slate-100">Set Feedback:</strong> Look for PR, Normal Fatigue, or Aggressive badges.</li>
                    <li><strong className="text-slate-100">Note Viewing:</strong> View your original session notes here.</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              Advanced Customization
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
                <span className="text-emerald-400 font-medium block mb-1">Secondary Multiplier</span>
                <span>Adjust how much "secondary" muscles (e.g. triceps in bench) count toward volume in Preferences.</span>
              </li>
              <li className="bg-slate-800/30 p-3 rounded-lg border border-slate-700/30">
                <span className="text-emerald-400 font-medium block mb-1">Theme Modes</span>
                <span>Pure Black for OLED, Texture for a paper look, or standard Light/Dark.</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              🛠️ Development & Features
            </h3>
            <p className="leading-relaxed mb-3 text-sm">
              Want to add more features? LiftShift is open source!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <span className="text-emerald-400 font-mono text-sm block mb-1">Add Analysis Metric</span>
                <span className="text-[11px]">Add logic in <code className="text-slate-400">frontend/utils/analysis/core/</code> and integrate with hooks.</span>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <span className="text-emerald-400 font-mono text-sm block mb-1">Add New Tab</span>
                <span className="text-[11px]">Update <code className="text-slate-400">Tab</code> enum and add your component to <code className="text-slate-400">AppTabContent.tsx</code>.</span>
              </div>
            </div>
          </section>

          <div className="pt-4 border-t border-slate-800 flex justify-center text-xs opacity-60">
             For the full technical manual, see <code className="mx-1 px-1 bg-slate-800 text-emerald-300 rounded">lift_readme.md</code> in the repository.
          </div>
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/20 cursor-pointer active:scale-95"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
