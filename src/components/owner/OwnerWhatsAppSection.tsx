import { ArrowRight, Bell, ClipboardList, IndianRupee, Smartphone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { WaActions, WaBody, WaBubble, WaButton, WhatsAppChat } from '../home/WhatsAppChat';
import { Container } from '../layout/Container';

const tenantFlow: Array<{ Icon: LucideIcon; label: string }> = [
  { Icon: Bell, label: 'Due' },
  { Icon: Smartphone, label: 'Tenant' },
  { Icon: IndianRupee, label: 'Proof' },
  { Icon: ClipboardList, label: 'Review' },
];

export function OwnerWhatsAppSection() {
  const pay = DEMO.share.payment;

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="owner-whatsapp-heading">
      <Container>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-[#128C7E] uppercase">
          WhatsApp updates
        </p>
        <h2
          id="owner-whatsapp-heading"
          className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          Keep your tenants updated on WhatsApp.
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          Rent reminders, pending dues and payment confirmations — as text you share where your
          tenants already are.
        </p>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
          <WhatsAppChat time="9:12 AM" caption="Payment reminder">
            <WaBubble>
              <WaBody>
                <p className="font-semibold">💰 Payment Reminder</p>
                <p className="text-[12px] text-[#667781]">{DEMO.lodging.name}</p>
                <p className="mt-1.5">Hi {pay.name},</p>
                <p className="mt-1 text-[12px]">
                  This is a friendly reminder for your monthly rent.
                </p>
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
                <p className="mt-1 text-[12px]">Rent payment for {pay.month} is still pending.</p>
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
                <p className="mt-1 text-[12px]">
                  Your payment proof for {pay.month} has been received.
                </p>
                <div className="mt-2 rounded-md bg-[#E7F6EE] px-2 py-2 text-[12px]">
                  <p className="text-lg font-semibold text-[#0F6B4C]">{pay.amount}</p>
                  <p className="mt-1 text-[#54656f]">Received 22 Aug 2026, 11:32 AM</p>
                  <p className="mt-1 font-semibold text-[#1D4ED8]">Status · Under review</p>
                </div>
                <p className="mt-2 text-[11px] text-[#667781]">
                  We will verify and update the status soon.
                </p>
              </WaBody>
            </WaBubble>
          </WhatsAppChat>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-black/5 bg-[#F7F8FA] px-4 py-3">
          <span className="mr-1 text-[11px] font-semibold tracking-[0.12em] text-muted">TENANT</span>
          {tenantFlow.map((s, i) => (
            <span key={s.label} className="inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white px-2.5 py-1.5 text-xs font-semibold text-navy">
                <s.Icon className="h-3.5 w-3.5 text-[#128C7E]" aria-hidden />
                {s.label}
              </span>
              {i < tenantFlow.length - 1 ? (
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
