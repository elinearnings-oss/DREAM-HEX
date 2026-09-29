import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <aside aria-label="System notifications" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 md:px-0">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-[#12161f] border border-[#222b3b] shadow-xl shadow-black/50 rounded-lg text-slate-200 transition-all duration-200"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-500" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-rose-400" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-100">{toast.title}</h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
