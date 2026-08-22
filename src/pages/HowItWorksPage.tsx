import { useEffect } from 'react';
import { LayoutDashboard, PlusSquare, Settings2, UserPlus, UserRound } from 'lucide-react';
import { FinalCta } from '../components/home/FinalCta';
import { StepCard } from '../components/cards/StepCard';
import { PageHero } from '../components/common/PageHero';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

const ownerSteps = [
  {
    step: '01',
    title: 'Create an account',
    description: 'Register with your name, Indian mobile number, and a password. This is the current production sign-in model.',
    icon: UserRound,
  },
  {
    step: '02',
    title: 'Create your space',
    description: 'Choose PG, Mess, Hostel, Co-living, or Rental. Space type cannot be changed later.',
    icon: PlusSquare,
  },
  {
    step: '03',
    title: 'Configure the space',
    description:
      'Set up buildings, rooms, and beds for lodging spaces — or menus and customers for a mess.',
    icon: Settings2,
  },
  {
    step: '04',
    title: 'Add or invite members',
    description:
      'Create an operational record, or send an invitation to a mobile number. There is no public join code.',
    icon: UserPlus,
  },
  {
    step: '05',
    title: 'Run daily operations',
    description: 'Occupancy, meals, payment proofs, complaints, and in-app pending work from one space.',
    icon: LayoutDashboard,
  },
];

export function HowItWorksPage() {
  useEffect(() => {
    applySeo({
      title: 'How it works — ACOMI',
      description: 'Create a space, set up beds or menus, add members, and run day-to-day operations.',
      path: '/how-it-works',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="Three steps. One space."
        description="Owners create and configure. Members join only by invitation. ACOMI is not a place to browse or book a bed."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold text-text">Owner and operator workflow</h2>
          <p className="mt-3 max-w-2xl text-text-secondary">
            This is the path after you choose “I am an owner” in ACOMI.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ownerSteps.map((s) => (
              <StepCard key={s.step} {...s} />
            ))}
          </div>
        </Container>
      </section>
      <section className="border-t border-border bg-white py-16 sm:py-20">
        <Container>
          <h2 className="text-2xl font-bold text-text">Member invitation workflow</h2>
          <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-sm leading-relaxed text-text-secondary">
            <li>An owner or manager invites a 10-digit Indian mobile number with a role.</li>
            <li>That person registers or signs in with the same mobile number and a password.</li>
            <li>They accept the invitation. Tenants and customers may be asked to complete a profile.</li>
            <li>They see stay, meals, payment proofs, and complaints that apply to them — not the full operator console.</li>
          </ol>
          <p className="mt-6 max-w-2xl text-sm text-text-secondary">
            Owners can also add a member record without that person installing ACOMI.
          </p>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
