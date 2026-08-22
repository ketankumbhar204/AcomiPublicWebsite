import { SHOTS } from '../../data/shots';
import { PhoneMock } from '../common/PhoneMock';

export function HeroPhones() {
  return (
    <div className="relative mx-auto flex w-full max-w-[560px] flex-col items-center gap-8 lg:h-[580px] lg:block">
      <div
        className="pointer-events-none absolute inset-x-[10%] top-[18%] hidden h-[58%] rounded-full bg-[#b8f0c8]/22 blur-3xl lg:block"
        aria-hidden
      />
      <div className="lg:absolute lg:top-[10%] lg:left-0 lg:z-10">
        <PhoneMock
          src={SHOTS.dashboard.src}
          alt={SHOTS.dashboard.alt}
          caption="PG · Know who's staying"
          size="hero"
          tilt={-6}
          priority
        />
      </div>
      <div className="lg:absolute lg:top-0 lg:right-0 lg:z-20">
        <PhoneMock
          src={SHOTS.mess.src}
          alt={SHOTS.mess.alt}
          caption="MESS · Know who's eating"
          size="hero"
          tilt={6}
          priority
        />
      </div>
    </div>
  );
}
