import { ArrowRight, ClipboardList, Smartphone, UtensilsCrossed, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { WaActions, WaBody, WaBubble, WaButton, WhatsAppChat } from '../home/WhatsAppChat';
import { Container } from '../layout/Container';

const mealEmoji = ['🍳', '🍛', '🥘'];

const customerFlow: Array<{ Icon: LucideIcon; label: string }> = [
  { Icon: UtensilsCrossed, label: 'Poll' },
  { Icon: Smartphone, label: 'WhatsApp' },
  { Icon: Users, label: 'Customer' },
  { Icon: ClipboardList, label: '78 / 86' },
];

export function MessVendorWhatsAppSection() {
  const mealPay = DEMO.share.mealPayment;
  const poll = DEMO.share.pollCustomer;

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="mess-whatsapp-heading">
      <Container>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[#128C7E] uppercase">
          WhatsApp updates
        </p>
        <h2
          id="mess-whatsapp-heading"
          className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          Keep your customers updated on WhatsApp.
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          Menus, meal polls and pending meal dues — as text you share where your customers already
          are.
        </p>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
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
                <p className="mt-1 text-[12px]">Meal payment for {mealPay.month} is pending.</p>
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

        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-black/5 bg-[#F7F8FA] px-4 py-3">
          <span className="mr-1 text-[11px] font-semibold tracking-[0.12em] text-muted">CUSTOMER</span>
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
          {DEMO_LABEL} · Shareable text, not automatic WhatsApp sending
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
