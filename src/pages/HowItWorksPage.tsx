import { useEffect } from 'react';
import { ArrowRight, CalendarDays, Settings2, UserPlus, Warehouse } from 'lucide-react';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero, PageSectionHead } from '../components/common/PageHero';
import { IconBadge } from '../components/common/IconBadge';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

const steps = [
  { n: '01', title: 'Create your space', line: 'Register with name, Indian mobile, and password. Choose Mess, PG, Hostel, Co-living, or Rental.', Icon: Warehouse, tone: 'teal' as const },
  { n: '02', title: 'Set up operations', line: 'Lodging starts from buildings and beds. Mess starts from menus and serving locations.', Icon: Settings2, tone: 'blue' as const },
  { n: '03', title: 'Add people', line: 'Tenants on lodging. Customers on Mess. Staff and managers on both.', Icon: UserPlus, tone: 'violet' as const },
  { n: '04', title: 'Run the day', line: 'Lodging: occupancy, dues, issues. Mess: participation, headcount, meal dues, food issues.', Icon: CalendarDays, tone: 'amber' as const },
];

const lodgingFlow = ['Create PG', 'Configure rooms/beds', 'Add residents', 'Track occupancy', 'Track payments'];
const messFlow = ['Create Mess', 'Add customers', 'Create menu', 'Collect participation', 'See headcount'];

const invite = [
  'Owner or manager invites a 10-digit Indian mobile with a role.',
  'That person registers or signs in with the same mobile and a password.',
  'They accept. Tenants and customers may complete a profile.',
  'They see stay, meals, proofs, and complaints that apply to them — not the full operator console.',
];

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
        title="Mess setup and lodging setup are different."
        description="Space type is chosen once. Mess starts from menus and customers. PG, hostel, co-living, and rental start from property."
      />

      <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="steps-heading">
        <Container>
          <PageSectionHead id="steps-heading" title="Four steps." />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
                <IconBadge icon={s.Icon} tone={s.tone} />
                <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] text-muted">{s.n}</p>
                <p className="mt-1 text-lg font-semibold text-navy">{s.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.line}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-14" aria-labelledby="setup-heading">
        <Container>
          <PageSectionHead id="setup-heading" title="Step 02 is different by type." />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[24px] border border-black/5 bg-[#FFF8F1] p-6 shadow-[var(--shadow-sm)]">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-orange uppercase">Mess · Food operations</p>
              <h3 className="mt-2 text-[1.35rem] font-semibold text-navy">Menus, meals, serving locations</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Menu library, today&apos;s menu, share. Customers are optional at first. No building or bed map.
              </p>
              <Flow label="MESS" steps={messFlow} />
            </article>
            <article className="rounded-[24px] border border-black/5 bg-mint p-6 shadow-[var(--shadow-sm)]">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                PG · Hostel · Co-living · Rental
              </p>
              <h3 className="mt-2 text-[1.35rem] font-semibold text-navy">Buildings, rooms, beds</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Quick Setup or manual builder. Then add residents. Meals are optional except rental, which omits the
                meal milestone.
              </p>
              <Flow label="PG" steps={lodgingFlow} />
            </article>
          </div>
        </Container>
      </section>

      <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="invite-heading">
        <Container>
          <PageSectionHead
            id="invite-heading"
            eyebrow="Members"
            eyebrowClass="text-blue"
            title="Member invitation."
            intro="Invite a mobile number, or create a record without the app."
          />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {invite.map((line, i) => (
              <li key={line} className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-muted">0{i + 1}</p>
                <p className="mt-2 text-sm leading-relaxed font-medium text-navy">{line}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}

function Flow({ label, steps }: { label: string; steps: readonly string[] }) {
  return (
    <p className="mt-5 flex flex-wrap items-center gap-1.5 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-navy">
      <span className="mr-1 text-[11px] tracking-[0.12em] text-muted">{label}</span>
      {steps.map((s, i) => (
        <span key={s} className="inline-flex items-center gap-1.5">
          {s}
          {i < steps.length - 1 ? <ArrowRight className="h-3 w-3 text-muted" aria-hidden /> : null}
        </span>
      ))}
    </p>
  );
}
