import {
  ArrowRight,
  Bell,
  ClipboardList,
  IndianRupee,
  Megaphone,
  Smartphone,
  UtensilsCrossed,
  Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { IconBadge } from '../common/IconBadge';
import { WaActions, WaBody, WaBubble, WaButton, WhatsAppChat } from './WhatsAppChat';

const mealEmoji = ['🍳', '🍛', '🥘'];

export function WhatsAppSection() {
  const { t } = useTranslation();
  const pay = DEMO.share.payment;
  const mealPay = DEMO.share.mealPayment;
  const poll = DEMO.share.pollCustomer;

  const chips = [
    {
      Icon: UtensilsCrossed,
      label: t('home.whatsapp.chips.selectMeal'),
      detail: t('home.whatsapp.chips.pollOpen'),
      tone: 'amber' as const,
    },
    {
      Icon: ClipboardList,
      label: t('home.whatsapp.chips.headcount'),
      detail: t('home.whatsapp.chips.headcountDetail'),
      tone: 'violet' as const,
    },
    {
      Icon: IndianRupee,
      label: t('home.whatsapp.chips.rentPending'),
      detail: t('home.whatsapp.chips.rentPendingDetail'),
      tone: 'blue' as const,
    },
    {
      Icon: Megaphone,
      label: t('home.whatsapp.chips.mealPending'),
      detail: t('home.whatsapp.chips.mealPendingDetail'),
      tone: 'coral' as const,
    },
  ];

  const messFlow = [
    { Icon: UtensilsCrossed, label: t('home.whatsapp.flow.mess.poll') },
    { Icon: Smartphone, label: t('home.whatsapp.flow.mess.whatsapp') },
    { Icon: Users, label: t('home.whatsapp.flow.mess.customer') },
    { Icon: ClipboardList, label: t('home.whatsapp.flow.mess.headcount') },
  ];

  const pgFlow = [
    { Icon: Bell, label: t('home.whatsapp.flow.pg.due') },
    { Icon: Smartphone, label: t('home.whatsapp.flow.pg.tenant') },
    { Icon: IndianRupee, label: t('home.whatsapp.flow.pg.proof') },
    { Icon: ClipboardList, label: t('home.whatsapp.flow.pg.review') },
  ];

  return (
    <section
      id="whatsapp-updates"
      className="bg-white py-10 sm:py-12"
      aria-labelledby="whatsapp-heading"
    >
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[#128C7E] uppercase">
          {t('home.whatsapp.eyebrow')}
        </p>
        <h2
          id="whatsapp-heading"
          className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          {t('home.whatsapp.title')}
        </h2>
        <p className="mt-2 max-w-xl text-[15px] text-text-secondary">{t('home.whatsapp.subtitle')}</p>

        <ul className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {chips.map((c) => (
            <li
              key={c.label}
              className="flex items-center gap-2 rounded-xl border border-black/5 bg-[#F7F8FA] px-2.5 py-2"
            >
              <IconBadge icon={c.Icon} tone={c.tone} size="sm" />
              <span>
                <span className="block text-[13px] font-semibold text-navy">{c.label}</span>
                <span className="text-[11px] text-muted">{c.detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-6 overflow-x-auto pb-2">
          <div className="flex w-max min-w-full items-start gap-5">
            <div>
              <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-orange uppercase">
                {t('home.person.messCustomers')}
              </p>
              <div className="flex gap-4">
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
            </div>

            <div className="mt-7 h-[353px] w-px shrink-0 bg-[#C5D4CC] 2xl:h-[377px]" aria-hidden />

            <div>
              <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                {t('home.person.pgTenants')}
              </p>
              <div className="flex gap-4">
                <WhatsAppChat time="9:12 AM" caption={t('home.whatsapp.captions.paymentReminder')}>
                  <WaBubble>
                    <WaBody>
                      <p className="font-semibold">{t('home.whatsapp.bubbles.paymentReminder')}</p>
                      <p className="text-[12px] text-[#667781]">{DEMO.lodging.name}</p>
                      <p className="mt-1.5">{t('home.whatsapp.bubbles.hiName', { name: pay.name })}</p>
                      <p className="mt-1 text-[12px]">{t('home.whatsapp.bubbles.friendlyRentReminder')}</p>
                      <dl className="mt-2 divide-y divide-[#e9edef] overflow-hidden rounded-md border border-[#e9edef] text-[12px]">
                        <Row k={t('home.whatsapp.bubbles.roomBed')} v="204 · Bed A" />
                        <Row k={t('home.whatsapp.bubbles.month')} v={pay.month} />
                        <Row k={t('home.whatsapp.bubbles.dueDate')} v={pay.due} />
                      </dl>
                      <p className="mt-2 rounded-md bg-[#FFF8E8] px-2 py-1.5 text-[12px] font-semibold text-[#B45309]">
                        {t('home.whatsapp.bubbles.amountDue', { amount: pay.amount })}
                      </p>
                    </WaBody>
                    <WaActions>
                      <WaButton>{t('labels.viewInAcomi')}</WaButton>
                      <span className="w-px bg-[#e9edef]" aria-hidden />
                      <WaButton>{t('labels.shareReceipt')}</WaButton>
                    </WaActions>
                  </WaBubble>
                </WhatsAppChat>

                <WhatsAppChat time="11:05 AM" caption={t('home.whatsapp.captions.rentPending')}>
                  <WaBubble>
                    <WaBody>
                      <p className="font-semibold">{t('home.whatsapp.bubbles.rentPending')}</p>
                      <p className="text-[12px] text-[#667781]">{DEMO.lodging.name}</p>
                      <p className="mt-1.5">{t('home.whatsapp.bubbles.hiName', { name: pay.name })}</p>
                      <p className="mt-1 text-[12px]">
                        {t('home.whatsapp.bubbles.stillPendingRent', { month: pay.month })}
                      </p>
                      <dl className="mt-2 divide-y divide-[#e9edef] overflow-hidden rounded-md border border-[#e9edef] text-[12px]">
                        <Row k={t('home.whatsapp.bubbles.roomBed')} v={pay.place} />
                        <Row k={t('home.whatsapp.bubbles.status')} v={t('status.pending')} />
                      </dl>
                      <p className="mt-2 rounded-md bg-[#FFE8EE] px-2 py-1.5 text-[12px] font-semibold text-[#BE123C]">
                        {t('home.whatsapp.bubbles.amountPending', { amount: pay.amount })}
                      </p>
                    </WaBody>
                    <WaActions>
                      <WaButton>{t('labels.viewInAcomi')}</WaButton>
                      <span className="w-px bg-[#e9edef]" aria-hidden />
                      <WaButton>{t('labels.shareReceipt')}</WaButton>
                    </WaActions>
                  </WaBubble>
                </WhatsAppChat>

                <WhatsAppChat time="11:32 AM" caption={t('home.whatsapp.captions.paymentReceived')}>
                  <WaBubble>
                    <WaBody>
                      <p className="font-semibold">{t('home.whatsapp.bubbles.paymentReceived')}</p>
                      <p className="text-[12px] text-[#667781]">{DEMO.lodging.name}</p>
                      <p className="mt-1.5">{t('home.whatsapp.bubbles.hiName', { name: pay.name })}</p>
                      <p className="mt-1 text-[12px]">
                        {t('home.whatsapp.bubbles.proofReceived', { month: pay.month })}
                      </p>
                      <div className="mt-2 rounded-md bg-[#E7F6EE] px-2 py-2 text-[12px]">
                        <p className="text-lg font-semibold text-[#0F6B4C]">{pay.amount}</p>
                        <p className="mt-1 text-[#54656f]">Received 22 Aug 2026, 11:32 AM</p>
                        <p className="mt-1 font-semibold text-[#1D4ED8]">
                          {t('home.whatsapp.bubbles.statusUnderReview')}
                        </p>
                      </div>
                      <p className="mt-2 text-[11px] text-[#667781]">{t('home.whatsapp.bubbles.verifySoon')}</p>
                    </WaBody>
                  </WaBubble>
                </WhatsAppChat>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2 lg:grid-cols-2">
          <Flow title={t('home.whatsapp.flow.customer')} steps={messFlow} />
          <Flow title={t('home.whatsapp.flow.tenant')} steps={pgFlow} />
        </div>
        <p className="mt-5 text-sm font-semibold text-navy">{t('home.whatsapp.bubbles.oneUpdate')}</p>
        <DemoLabel className="mt-2">
          {DEMO_LABEL} · {t('home.whatsapp.bubbles.shareableNote')}
        </DemoLabel>
      </div>
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

function Flow({
  title,
  steps,
}: {
  title: string;
  steps: readonly { Icon: typeof UtensilsCrossed; label: string }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-black/5 bg-[#F7F8FA] px-4 py-3">
      <span className="mr-1 text-[11px] font-semibold tracking-[0.12em] text-muted">{title}</span>
      {steps.map((s, i) => (
        <span key={s.label} className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 text-xs font-semibold text-navy">
            <s.Icon className="h-3.5 w-3.5 text-[#128C7E]" aria-hidden />
            {s.label}
          </span>
          {i < steps.length - 1 ? <ArrowRight className="h-3.5 w-3.5 text-muted" aria-hidden /> : null}
        </span>
      ))}
    </div>
  );
}
