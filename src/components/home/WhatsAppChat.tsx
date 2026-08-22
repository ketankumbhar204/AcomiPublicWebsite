import type { ReactNode } from 'react';
import { Camera, Check, ChevronLeft, MoreVertical, Paperclip, Phone, Smile } from 'lucide-react';
import { BrandMark } from '../common/BrandMark';

type WhatsAppChatProps = {
  children: ReactNode;
  time?: string;
  caption?: string;
};

export function WhatsAppChat({ children, time = '8:24 AM', caption }: WhatsAppChatProps) {
  return (
    <figure className="w-[176px] shrink-0 2xl:w-[188px]">
      <div className="h-[353px] overflow-hidden 2xl:h-[377px]">
        <div className="w-[286px] origin-top-left scale-[0.615] 2xl:scale-[0.657]">
      <div className="overflow-hidden rounded-[32px] border border-[#b9c4be] bg-[#111b21] p-[7px] shadow-[0_8px_28px_rgba(11,28,22,0.16)]">
        <div className="flex h-[560px] flex-col overflow-hidden rounded-[26px] bg-[#efeae2]">
          <div className="flex items-center justify-between bg-[#075e54] px-3 pt-1.5 pb-0.5 text-[11px] font-semibold text-white">
            <span>{time.replace(' AM', '')}</span>
            <span className="text-white/80">5G · 86%</span>
          </div>
          <div className="flex items-center gap-1 bg-[#075e54] px-1.5 pb-2 text-white">
            <ChevronLeft className="h-5 w-5 shrink-0" strokeWidth={2} aria-hidden />
            <BrandMark size={34} className="!rounded-full !shadow-none" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-[15px] leading-tight font-semibold">
                ACOMI
                <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#25d366]">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden />
                </span>
              </p>
              <p className="text-[11px] text-white/70">Business Account</p>
            </div>
            <Phone className="h-4 w-4 text-white/90" strokeWidth={1.8} aria-hidden />
            <MoreVertical className="h-4 w-4 text-white/90" strokeWidth={1.8} aria-hidden />
          </div>

          <div className="wa-wallpaper flex flex-1 flex-col px-2.5 pt-3 pb-2">
            <p className="mx-auto mb-3 rounded-full bg-white/80 px-3 py-0.5 text-[11px] font-semibold text-[#54656f] shadow-sm">
              Today
            </p>
            {children}
            <p className="mt-1 pr-1 text-right text-[10px] text-[#667781]">{time}</p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f0f2f5] px-2 py-1.5">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-2 text-[#54656f]">
              <Smile className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              <span className="flex-1 text-[13px]">Message</span>
              <Paperclip className="h-4 w-4" strokeWidth={1.8} aria-hidden />
              <Camera className="h-4 w-4" strokeWidth={1.8} aria-hidden />
            </div>
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#00a884] text-white">
              <MicIcon />
            </span>
          </div>
        </div>
      </div>
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-2 text-center text-[12px] leading-tight text-muted">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function WaBubble({ children }: { children: ReactNode }) {
  return (
    <div className="wa-bubble-tail relative mr-6 max-w-[92%]">
      <span
        className="absolute top-0 -left-1.5 h-0 w-0 border-y-[7px] border-r-[8px] border-y-transparent border-r-white"
        aria-hidden
      />
      <div className="overflow-hidden rounded-lg rounded-tl-none bg-white text-[13px] leading-[1.35] text-[#111b21] shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
        {children}
      </div>
    </div>
  );
}

export function WaBody({ children }: { children: ReactNode }) {
  return <div className="px-2.5 pt-2 pb-1.5">{children}</div>;
}

export function WaActions({ children }: { children: ReactNode }) {
  return <div className="flex border-t border-[#e9edef]">{children}</div>;
}

export function WaButton({ children, full }: { children: ReactNode; full?: boolean }) {
  return (
    <span
      className={`py-2 text-center text-[13px] font-semibold text-[#027eb5] ${
        full ? 'block w-full border-t border-[#e9edef]' : 'flex-1'
      }`}
    >
      {children}
    </span>
  );
}

export function WaBar({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[12px]">
        <span className="font-semibold text-[#111b21]">{label}</span>
        <span className="tabular-nums text-[#54656f]">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[#e9edef]">
        <span className="block h-full rounded-full bg-[#00a884]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3zm5-3a5 5 0 01-10 0H5a7 7 0 0014 0h-2zm-5 8a1 1 0 001-1v-1.07A7.002 7.002 0 0019 11h-2a5 5 0 01-10 0H5a7.002 7.002 0 006 6.93V18a1 1 0 001 1z" />
    </svg>
  );
}
