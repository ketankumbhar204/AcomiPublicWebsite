import { useEffect } from 'react';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero } from '../components/common/PageHero';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function HowItWorksPage() {
  useEffect(() => {
    applySeo({
      title: 'How it works — ACOMI',
      description:
        'Create a space, set up beds or menus depending on type, add tenants or customers, and run occupancy or headcount.',
      path: '/how-it-works',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Lodging setup and Mess setup are different"
        description="Space type is chosen once. PG, hostel, co-living, and rental start from property. Mess starts from menus and customers."
      />
      <section className="bg-background py-16 sm:py-20">
        <Container className="space-y-12">
          <Step n="01" title="Create your space">
            Register with name, Indian mobile, and password. Choose PG, Mess, Hostel, Co-living, or Rental.
          </Step>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-7 ring-1 ring-border">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">Lodging</p>
              <h2 className="mt-2 text-xl font-bold text-text">02 — Buildings, rooms, beds</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Quick Setup or manual builder. Then add residents. Meals are optional except rental, which omits the
                meal milestone.
              </p>
            </div>
            <div className="rounded-3xl bg-[#0b5f7a] p-7 text-white">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[#b8e6f3] uppercase">Mess</p>
              <h2 className="mt-2 text-xl font-bold">02 — Menus, meals, serving locations</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Menu library, today&apos;s menu, share. Customers are optional at first. No building or bed map.
              </p>
            </div>
          </div>
          <Step n="03" title="Add people">
            Tenants on lodging. Customers on Mess. Staff and managers on both. Invite a mobile number, or create a
            record without the app.
          </Step>
          <Step n="04" title="Run the day">
            Lodging: occupancy, dues, issues. Mess: participation, headcount, meal dues, food issues. One owner can run
            both.
          </Step>

          <div className="rounded-3xl bg-white p-8 ring-1 ring-border">
            <h2 className="text-xl font-bold text-text">Member invitation</h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-text-secondary">
              <li>Owner or manager invites a 10-digit Indian mobile with a role.</li>
              <li>That person registers or signs in with the same mobile and a password.</li>
              <li>They accept. Tenants and customers may complete a profile.</li>
              <li>They see stay, meals, proofs, and complaints that apply to them — not the full operator console.</li>
            </ol>
          </div>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}

function Step({ n, title, children }: { n: string; title: string; children: string }) {
  return (
    <div className="rounded-3xl bg-white p-7 ring-1 ring-border">
      <p className="text-xs font-bold text-primary">{n}</p>
      <h2 className="mt-2 text-xl font-bold text-text">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{children}</p>
    </div>
  );
}
