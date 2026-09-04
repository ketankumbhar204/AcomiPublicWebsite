import { useTranslation } from 'react-i18next';
import { SHOTS } from '../../data/shots';
import { PhoneMock } from '../common/PhoneMock';

export function ScreenshotsSection() {
  const { t } = useTranslation();

  const shots = [
    { ...SHOTS.dashboard, caption: t('home.screenshots.captions.dashboard') },
    { ...SHOTS.mess, caption: t('home.screenshots.captions.mess') },
    { ...SHOTS.occupancy, caption: t('home.screenshots.captions.occupancy') },
    { ...SHOTS.payments, caption: t('home.screenshots.captions.payments') },
    { ...SHOTS.members, caption: t('home.screenshots.captions.members') },
  ];

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
          {t('home.screenshots.title')}
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
