import type { LucideIcon } from 'lucide-react';

const tones = {
  teal: 'bg-[#E7F6EE] text-[#0F6B4C]',
  blue: 'bg-[#E8F1FF] text-[#2563EB]',
  amber: 'bg-[#FFF1E0] text-[#D97706]',
  violet: 'bg-[#F1EBFF] text-[#7C3AED]',
  coral: 'bg-[#FFE8EE] text-[#E11D48]',
} as const;

type IconBadgeProps = {
  icon: LucideIcon;
  tone?: keyof typeof tones;
  size?: 'sm' | 'md';
};

export function IconBadge({ icon: Icon, tone = 'teal', size = 'md' }: IconBadgeProps) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const glyph = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  return (
    <span className={`inline-flex shrink-0 items-center justify-center rounded-xl ${box} ${tones[tone]}`}>
      <Icon className={glyph} strokeWidth={1.9} aria-hidden />
    </span>
  );
}
