import { ArrowRight, ClipboardList, Smartphone, UtensilsCrossed, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { WaActions, WaBody, WaBubble, WaButton, WhatsAppChat } from '../home/WhatsAppChat';
import { Container } from '../layout/Container';

const mealEmoji = ['🍳', '🍛', '🥘'];

export function MessVendorWhatsAppSection() {
  const { t } = useTranslation();
  const mealPay = DEMO.share.mealPayment;
  const poll = DEMO.share.pollCustomer;
  const customerFlow: Array<{ Icon: LucideIcon; label: string }> = [
    { Icon: UtensilsCrossed, label: t('home.whatsapp.flow.mess.poll') },
    { Icon: Smartphone, label: t('home.whatsapp.flow.mess.whatsapp') },
    { Icon: Users, label: t('home.whatsapp.flow.mess.customer') },
    { Icon: ClipboardList, label: t('home.whatsapp.flow.mess.headcount') },
  ];

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="mess-whatsapp-heading">
      <Container>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[#128C7E] uppercase">
          {t('home.whatsapp.eyebrow')}
        </p>
        <h2
          id="mess-whatsapp-heading"
          className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          {t('messVendor.whatsapp.title')}
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          {t('messVendor.whatsapp.subtitle')}
        </p>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
          <WhatsAppChat time="8:05 AM" caption={t('home.whatsapp.captions.selectMeal')}>
            <WaBubble>
              <WaBody>
                <p className="font-semibold">{t('home.whatsapp.bubbles.pollOpen')}</p>
                <p className="text-[12px] text-[#667781]">{DEMO.mess.name}</p>
                <p className="mt-1.5">{t('home.whatsapp.bubbles.hiName', { name: poll.name })}</p>
                <p className="mt-1 text-[12px]">{t('home.whatsapp.bubbles.selectMealsBefore')}</p>
                <ul className="mt-2.5 overflow-hidden rounded-md border border-[#e9edef]">
                  {DEMO.share.menu.map((m, i) => (
                    <li
                      key={m.name}
                      className="flex items-start gap-2 border-b border-[#e9edef] px-2 py-2 last:border-b-0"
                    >
                      <span
                        className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                          poll.choices[i].selected
                            ? 'bg-[#00a884] text-white'
                            : 'border border-[#cfd5d9] text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <span>
                        <span className="block font-semibold">
                          {mealEmoji[i]} {m.name}
                        </span>
                        <span className="text-[11px] text-[#667781]">{m.items}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </WaBody>
              <WaActions>
                <WaButton>{t('meals.breakfast')}</WaButton>
                <span className="w-px bg-[#e9edef]" aria-hidden />
                <WaButton>{t('meals.lunch')}</WaButton>
                <span className="w-px bg-[#e9edef]" aria-hidden />
                <WaButton>{t('meals.dinner')}</WaButton>
              </WaActions>
            </WaBubble>
          </WhatsAppChat>

          <WhatsAppChat time="8:24 AM" caption={t('home.whatsapp.captions.todaysMenu')}>
            <WaBubble>
              <WaBody>
                <p className="font-semibold">
                  {t('home.whatsapp.bubbles.todaysMenu', { name: DEMO.mess.name })}
                </p>
                <p className="mt-0.5 text-[12px] text-[#667781]">22 Aug 2026 (Thursday)</p>
                <ul className="mt-2 space-y-1.5">
                  {DEMO.share.menu.map((m, i) => (
                    <li key={m.name}>
                      <span className="font-semibold">
                        {mealEmoji[i]} {m.name}
                      </span>
                      <span className="mt-0.5 block text-[12px] text-[#54656f]">{m.items}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2.5 rounded-md bg-[#E7F6EE] px-2 py-1.5 text-[12px] font-semibold text-[#0F6B4C]">
                  {t('home.whatsapp.bubbles.expectedMeals', {
                    prepare: DEMO.mess.meals[0].prepare,
                    customers: DEMO.mess.customers,
                  })}
                </p>
              </WaBody>
              <WaActions>
                <WaButton>{t('labels.viewMenu')}</WaButton>
                <span className="w-px bg-[#e9edef]" aria-hidden />
                <WaButton>{t('labels.selectMeal')}</WaButton>
              </WaActions>
            </WaBubble>
          </WhatsAppChat>

          <WhatsAppChat time="9:40 AM" caption={t('home.whatsapp.captions.mealPaymentPending')}>
            <WaBubble>
              <WaBody>
                <p className="font-semibold">{t('home.whatsapp.bubbles.mealPaymentPending')}</p>
                <p className="text-[12px] text-[#667781]">{mealPay.place}</p>
                <p className="mt-1.5">{t('home.whatsapp.bubbles.hiName', { name: mealPay.name })}</p>
                <p className="mt-1 text-[12px]">
                  {t('home.whatsapp.bubbles.mealPaymentForMonth', { month: mealPay.month })}
                </p>
                <dl className="mt-2 divide-y divide-[#e9edef] overflow-hidden rounded-md border border-[#e9edef] text-[12px]">
                  <Row k={t('home.whatsapp.bubbles.plan')} v={t('home.whatsapp.bubbles.monthlyMeals')} />
                  <Row k={t('home.whatsapp.bubbles.month')} v={mealPay.month} />
                  <Row k={t('home.whatsapp.bubbles.dueDate')} v={mealPay.due} />
                </dl>
                <p className="mt-2 rounded-md bg-[#FFE8EE] px-2 py-1.5 text-[12px] font-semibold text-[#BE123C]">
                  {t('home.whatsapp.bubbles.amountPending', { amount: mealPay.amount })}
                </p>
              </WaBody>
              <WaActions>
                <WaButton>{t('labels.viewInAcomi')}</WaButton>
                <span className="w-px bg-[#e9edef]" aria-hidden />
                <WaButton>{t('labels.shareReceipt')}</WaButton>
              </WaActions>
            </WaBubble>
          </WhatsAppChat>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-black/5 bg-[#F7F8FA] px-4 py-3">
          <span className="mr-1 text-[11px] font-semibold tracking-[0.12em] text-muted">
            {t('home.whatsapp.flow.customer')}
          </span>
          {customerFlow.map((s, i) => (
            <span key={s.label} className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 text-xs font-semibold text-navy">
                <s.Icon className="h-3.5 w-3.5 text-[#128C7E]" aria-hidden />
                {s.label}
              </span>
              {i < customerFlow.length - 1 ? (
                <ArrowRight className="h-3.5 w-3.5 text-muted" aria-hidden />
              ) : null}
            </span>
          ))}
        </div>
        <DemoLabel className="mt-4">
          {DEMO_LABEL} · {t('home.whatsapp.bubbles.shareableNote')}
        </DemoLabel>
      </Container>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between px-2 py-1.5">
      <dt className="text-[#667781]">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}
