import { type ReactNode } from "react";

interface ChartModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function ChartModal({ title, children, onClose }: ChartModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="chart-modal-title"
    >
      <div
        className="glass-panel max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[1.6rem] border border-white/85 bg-white/[0.76] shadow-[0_28px_60px_rgba(15,23,42,0.24)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center justify-between border-b border-white/75 bg-white/55 px-6 py-4">
          <h2 id="chart-modal-title" className="text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/90 bg-white/85 p-2 text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.98),0_10px_22px_rgba(15,23,42,0.08)] transition hover:bg-white hover:text-slate-700"
            aria-label="Fechar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className="bg-white/48 p-6">{children}</div>
      </div>
    </div>
  );
}
