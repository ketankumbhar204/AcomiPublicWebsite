import type { LucideIcon } from 'lucide-react';

type HeroValueRowProps = {
  Icon: LucideIcon;
  text: string;
  iconBg: string;
  iconFg: string;
};

export function HeroValueRow({ Icon, text, iconBg, iconFg }: HeroValueRowProps) {
  return (
    <span className="flex items-center gap-2.5 sm:gap-4">
      <span
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl ${iconBg} ${iconFg}`}
      >
        <Icon className="h-5 w-5 sm:h-9 sm:w-9" strokeWidth={1.75} aria-hidden />
      </span>
      <span className="whitespace-nowrap text-[1.15rem] leading-[1.15] font-semibold tracking-[-0.03em] text-navy sm:text-[1.85rem]">
        {text}
      </span>
    </span>
  );
}
