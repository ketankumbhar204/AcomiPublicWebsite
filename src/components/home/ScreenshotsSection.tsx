import { SHOTS } from '../../data/shots';
import { PhoneMock } from '../common/PhoneMock';

const shots = [
  { ...SHOTS.dashboard, caption: 'PG Dashboard' },
  { ...SHOTS.mess, caption: 'Mess Dashboard' },
  { ...SHOTS.occupancy, caption: 'Occupancy' },
  { ...SHOTS.payments, caption: 'Payments' },
  { ...SHOTS.members, caption: 'Members' },
];

export function ScreenshotsSection() {
  return (
    <section
      id="screenshots"
      className="border-y border-border bg-[#F7F8FA] py-12 sm:py-14"
      aria-labelledby="screenshots-heading"
    >
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <h2
          id="screenshots-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]"
        >
          See ACOMI in action.
        </h2>
        <div className="mt-8 overflow-x-auto pb-2">
          <div className="flex w-max min-w-full flex-nowrap justify-between gap-5">
            {shots.map((s) => (
              <PhoneMock
                key={s.caption}
                src={s.src}
                alt={s.alt}
                caption={s.caption}
                size="sm"
                className="!w-[176px] shrink-0 xl:!w-[196px] 2xl:!w-[210px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
