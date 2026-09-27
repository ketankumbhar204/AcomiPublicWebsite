import { SHOTS } from '../../data/shots';
import { PhoneMock } from '../common/PhoneMock';

const PG_CAPTION = "PG · Know who's staying";
const MESS_CAPTION = "MESS · Know who's eating";

export function HeroPhones() {
  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <div className="flex flex-col items-center gap-8 lg:relative lg:block lg:h-[560px]">
        <div
          className="pointer-events-none absolute inset-x-[10%] top-[18%] hidden h-[58%] rounded-full bg-[#b8f0c8]/22 blur-3xl lg:block"
          aria-hidden
        />
        <div className="lg:absolute lg:bottom-0 lg:left-0 lg:z-10">
          <PhoneMock
            src={SHOTS.dashboard.src}
            alt={SHOTS.dashboard.alt}
            caption={PG_CAPTION}
            size="hero"
            tilt={-6}
            priority
            className="lg:[&_figcaption]:hidden"
          />
        </div>
        <div className="lg:absolute lg:bottom-0 lg:right-0 lg:z-20">
          <PhoneMock
            src={SHOTS.mess.src}
            alt={SHOTS.mess.alt}
            caption={MESS_CAPTION}
            size="hero"
            tilt={6}
            priority
            className="lg:[&_figcaption]:hidden"
          />
        </div>
      </div>
      <div className="mt-2 hidden justify-between lg:flex">
        <p className="w-[252px] text-center text-sm font-medium text-text-secondary">{PG_CAPTION}</p>
        <p className="w-[252px] text-center text-sm font-medium text-text-secondary">{MESS_CAPTION}</p>
      </div>
    </div>
  );
}
