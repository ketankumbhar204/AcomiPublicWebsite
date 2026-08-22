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
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { IconBadge } from '../common/IconBadge';
import { WaActions, WaBody, WaBubble, WaButton, WhatsAppChat } from './WhatsAppChat';

const chips = [
  { Icon: UtensilsCrossed, label: 'Select meal', detail: 'Poll is open', tone: 'amber' as const },
  { Icon: ClipboardList, label: 'Headcount', detail: '78 / 86 responded', tone: 'violet' as const },
  { Icon: IndianRupee, label: 'Rent pending', detail: '₹12,000 due', tone: 'blue' as const },
  { Icon: Megaphone, label: 'Meal pending', detail: '₹4,800 due', tone: 'coral' as const },
];

const messFlow = [
  { Icon: UtensilsCrossed, label: 'Poll' },
  { Icon: Smartphone, label: 'WhatsApp' },
  { Icon: Users, label: 'Customer' },
  { Icon: ClipboardList, label: '78 / 86' },
];

const pgFlow = [
  { Icon: Bell, label: 'Due' },
  { Icon: Smartphone, label: 'Tenant' },
  { Icon: IndianRupee, label: 'Proof' },
  { Icon: ClipboardList, label: 'Review' },
];

const mealEmoji = ['🍳', '🍛', '🥘'];

export function WhatsAppSection() {
  const pay = DEMO.share.payment;
  const mealPay = DEMO.share.mealPayment;
  const poll = DEMO.share.pollCustomer;

  return (
    <section
      id="whatsapp-updates"
      className="bg-white py-10 sm:py-12"
      aria-labelledby="whatsapp-heading"
    >
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[#128C7E] uppercase">
          WhatsApp updates
        </p>
        <h2
          id="whatsapp-heading"
          className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          Keep people updated on WhatsApp.
        </h2>
        <p className="mt-2 max-w-xl text-[15px] text-text-secondary">
          Tenants and customers get menus, poll, and pending payment updates where they already check.
        </p>

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
                Mess · Customers
              </p>
              <div className="flex gap-4">
          <WhatsAppChat time="8:05 AM" caption="Select your meal">
            <WaBubble>
              <WaBody>
                <p className="font-semibold">🍽 Meal poll is open</p>
                <p className="text-[12px] text-[#667781]">{DEMO.mess.name}</p>
                <p className="mt-1.5">Hi {poll.name},</p>
                <p className="mt-1 text-[12px]">Select your meals for today before 10:00 AM.</p>
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
                <WaButton>Breakfast</WaButton>
                <span className="w-px bg-[#e9edef]" aria-hidden />
                <WaButton>Lunch</WaButton>
                <span className="w-px bg-[#e9edef]" aria-hidden />
                <WaButton>Dinner</WaButton>
              </WaActions>
            </WaBubble>
          </WhatsAppChat>

          <WhatsAppChat time="8:24 AM" caption="Today's menu">
            <WaBubble>
              <WaBody>
                <p className="font-semibold">🍽 Today&apos;s Menu — {DEMO.mess.name}</p>
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
                  👥 Expected meals {DEMO.mess.meals[0].prepare} / {DEMO.mess.customers}
                </p>
              </WaBody>
              <WaActions>
                <WaButton>View Menu</WaButton>
                <span className="w-px bg-[#e9edef]" aria-hidden />
                <WaButton>Select meal</WaButton>
              </WaActions>
            </WaBubble>
          </WhatsAppChat>

          <WhatsAppChat time="9:40 AM" caption="Meal payment pending">
            <WaBubble>
              <WaBody>
                <p className="font-semibold">💰 Meal payment pending</p>
                <p className="text-[12px] text-[#667781]">{mealPay.place}</p>
                <p className="mt-1.5">Hi {mealPay.name},</p>
                <p className="mt-1 text-[12px]">
                  Meal payment for {mealPay.month} is pending.
                </p>
                <dl className="mt-2 divide-y divide-[#e9edef] overflow-hidden rounded-md border border-[#e9edef] text-[12px]">
                  <Row k="Plan" v="Monthly meals" />
                  <Row k="Month" v={mealPay.month} />
                  <Row k="Due date" v={mealPay.due} />
                </dl>
                <p className="mt-2 rounded-md bg-[#FFE8EE] px-2 py-1.5 text-[12px] font-semibold text-[#BE123C]">
                  Amount pending {mealPay.amount}
                </p>
              </WaBody>
              <WaActions>
                <WaButton>View in ACOMI</WaButton>
                <span className="w-px bg-[#e9edef]" aria-hidden />
                <WaButton>Share receipt</WaButton>
              </WaActions>
            </WaBubble>
          </WhatsAppChat>
              </div>
            </div>

            <div className="mt-7 h-[353px] w-px shrink-0 bg-[#C5D4CC] 2xl:h-[377px]" aria-hidden />

            <div>
              <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                PG · Tenants
              </p>
              <div className="flex gap-4">
          <WhatsAppChat time="9:12 AM" caption="Payment reminder">
            <WaBubble>
              <WaBody>
                <p className="font-semibold">💰 Payment Reminder</p>
                <p className="text-[12px] text-[#667781]">{DEMO.lodging.name}</p>
                <p className="mt-1.5">Hi {pay.name},</p>
                <p className="mt-1 text-[12px]">This is a friendly reminder for your monthly rent.</p>
                <dl className="mt-2 divide-y divide-[#e9edef] overflow-hidden rounded-md border border-[#e9edef] text-[12px]">
                  <Row k="Room / Bed" v="204 · Bed A" />
                  <Row k="Month" v={pay.month} />
                  <Row k="Due date" v={pay.due} />
                </dl>
                <p className="mt-2 rounded-md bg-[#FFF8E8] px-2 py-1.5 text-[12px] font-semibold text-[#B45309]">
                  Amount due {pay.amount}
                </p>
              </WaBody>
              <WaActions>
                <WaButton>View in ACOMI</WaButton>
                <span className="w-px bg-[#e9edef]" aria-hidden />
                <WaButton>Share receipt</WaButton>
              </WaActions>
            </WaBubble>
          </WhatsAppChat>

          <WhatsAppChat time="11:05 AM" caption="Rent payment pending">
            <WaBubble>
              <WaBody>
                <p className="font-semibold">⚠ Rent payment is pending</p>
                <p className="text-[12px] text-[#667781]">{DEMO.lodging.name}</p>
                <p className="mt-1.5">Hi {pay.name},</p>
                <p className="mt-1 text-[12px]">
                  Rent payment for {pay.month} is still pending.
                </p>
                <dl className="mt-2 divide-y divide-[#e9edef] overflow-hidden rounded-md border border-[#e9edef] text-[12px]">
                  <Row k="Room / Bed" v={pay.place} />
                  <Row k="Status" v="Pending" />
                </dl>
                <p className="mt-2 rounded-md bg-[#FFE8EE] px-2 py-1.5 text-[12px] font-semibold text-[#BE123C]">
                  Amount pending {pay.amount}
                </p>
              </WaBody>
              <WaActions>
                <WaButton>View in ACOMI</WaButton>
                <span className="w-px bg-[#e9edef]" aria-hidden />
                <WaButton>Share receipt</WaButton>
              </WaActions>
            </WaBubble>
          </WhatsAppChat>

          <WhatsAppChat time="11:32 AM" caption="Payment received">
            <WaBubble>
              <WaBody>
                <p className="font-semibold">✅ Payment received</p>
                <p className="text-[12px] text-[#667781]">{DEMO.lodging.name}</p>
                <p className="mt-1.5">Hi {pay.name},</p>
                <p className="mt-1 text-[12px]">Your payment proof for {pay.month} has been received.</p>
                <div className="mt-2 rounded-md bg-[#E7F6EE] px-2 py-2 text-[12px]">
                  <p className="text-lg font-semibold text-[#0F6B4C]">{pay.amount}</p>
                  <p className="mt-1 text-[#54656f]">Received 22 Aug 2026, 11:32 AM</p>
                  <p className="mt-1 font-semibold text-[#1D4ED8]">Status · Under review</p>
                </div>
                <p className="mt-2 text-[11px] text-[#667781]">We will verify and update the status soon.</p>
              </WaBody>
            </WaBubble>
          </WhatsAppChat>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-2 lg:grid-cols-2">
          <Flow title="CUSTOMER" steps={messFlow} />
          <Flow title="TENANT" steps={pgFlow} />
        </div>
        <p className="mt-5 text-sm font-semibold text-navy">One update. Everyone knows.</p>
        <DemoLabel className="mt-2">{DEMO_LABEL} · Shareable text, not automatic WhatsApp sending</DemoLabel>
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
