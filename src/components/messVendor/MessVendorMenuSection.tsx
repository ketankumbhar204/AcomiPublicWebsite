import { ClipboardList, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { SHOTS } from '../../data/shots';
import { DemoLabel } from '../common/DemoLabel';
import { PhoneMock } from '../common/PhoneMock';
import { Container } from '../layout/Container';

const mealEmoji = ['🍳', '🍛', '🥘'];

export function MessVendorMenuSection() {
  const { t } = useTranslation();
  const poll = DEMO.share.pollCustomer;

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="mess-menu-heading">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-orange uppercase">
              {t('messVendor.menu.eyebrow')}
            </p>
            <h2
              id="mess-menu-heading"
              className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]"
            >
              {t('messVendor.menu.title')}
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
              {t('messVendor.menu.body')}
            </p>

            <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-md)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-orange">
                <UtensilsCrossed className="h-4 w-4" aria-hidden />
                {t('messVendor.menu.todaysMenu', { name: DEMO.mess.name })}
              </div>
              <ul className="mt-4 space-y-3">
                {DEMO.share.menu.map((m, i) => (
                  <li key={m.name} className="rounded-xl bg-[#FFF8F1] px-3 py-2.5">
                    <p className="text-sm font-semibold text-navy">
                      {mealEmoji[i]} {m.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{m.items}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F7F8FA] px-3 py-2.5 text-sm">
                <ClipboardList className="h-4 w-4 text-orange" aria-hidden />
                <span className="font-semibold text-navy">
                  {t('messVendor.menu.noResponseCount', {
                    poll: DEMO.mess.poll,
                    count: DEMO.mess.noResponse,
                  })}
                </span>
              </div>
              <p className="mt-3 text-xs text-text-secondary">
                {t('messVendor.menu.selectedSummary', {
                  name: poll.name,
                  choices: poll.choices
                  .filter((c) => c.selected)
                  .map((c) => c.name)
                  .join(' and '),
                })}
              </p>
            </div>
            <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
          </div>
          <div className="flex justify-center lg:justify-end">
            <PhoneMock {...SHOTS.meals} size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}
