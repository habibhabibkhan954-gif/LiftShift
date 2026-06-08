import React from 'react';
import { X, BookOpen } from 'lucide-react';

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

      <div className="relative w-full max-w-2xl max-h-[85vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in scale-in duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">LiftShift Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-slate-300">
          <section>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              🚀 Getting Started
            </h3>
            <p className="leading-relaxed">
              LiftShift transforms your workout data from apps like <strong className="text-white">Hevy, Strong, and Lyfta</strong> into actionable insights. All processing happens locally in your browser for maximum privacy.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">📱 GUI Usage Guide</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-emerald-400 font-medium mb-1">Getting Around</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-slate-100">Top Bar:</strong> Update Data (sync), Preferences (theme/units), and Calendar Filters.</li>
                  <li><strong className="text-slate-100">Tabs:</strong> Switch between Dashboard, Exercises, Muscle Analysis, History, and Flex views.</li>
                </ul>
              </div>
              <div>
                <h4 className="text-emerald-400 font-medium mb-1">Dashboard Tips</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-slate-100">Muscle Heatmap:</strong> Click any muscle on the model to filter the dashboard.</li>
                  <li><strong className="text-slate-100">Charts:</strong> Hover over points to see exact daily weight totals.</li>
                </ul>
              </div>
              <div>
                <h4 className="text-emerald-400 font-medium mb-1">Exercises & Progress</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-slate-100">Search:</strong> Quickly find exercises in the Exercises tab.</li>
                  <li><strong className="text-slate-100">Coaching:</strong> Look for badges like "PR" or "Normal Fatigue" in workout history.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">🛠️ Development & Features</h3>
            <p className="leading-relaxed mb-3">
              Want to add more features? LiftShift is open source!
            </p>
            <ul className="space-y-3">
              <li className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <span className="text-emerald-400 font-mono text-sm block mb-1">Add Analysis Metric</span>
                <span className="text-xs">Add logic in <code className="text-slate-400">frontend/utils/analysis/core/</code> and integrate with hooks.</span>
              </li>
              <li className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <span className="text-emerald-400 font-mono text-sm block mb-1">Add New Tab</span>
                <span className="text-xs">Update <code className="text-slate-400">Tab</code> enum and add your component to <code className="text-slate-400">AppTabContent.tsx</code>.</span>
              </li>
            </ul>
          </section>

          <div className="pt-4 border-t border-slate-800 flex justify-center text-sm">
             For the full technical manual, see <code className="mx-1 px-1 bg-slate-800 text-emerald-300 rounded">lift_readme.md</code> in the repo.
          </div>
        </div>

        <div className="p-4 bg-slate-950/50 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
