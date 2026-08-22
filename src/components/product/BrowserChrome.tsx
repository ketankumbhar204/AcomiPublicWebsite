import type { ReactNode } from 'react';

type BrowserChromeProps = {
  url: string;
  children: ReactNode;
  className?: string;
};

export function BrowserChrome({ url, children, className = '' }: BrowserChromeProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_24px_50px_rgba(15,107,76,0.12)] ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-slate-100 bg-[#F6F8FA] px-3 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" aria-hidden />
        <div className="ml-2 min-w-0 flex-1 truncate rounded-md bg-white px-3 py-1 text-[11px] text-slate-400 ring-1 ring-slate-100">
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}
