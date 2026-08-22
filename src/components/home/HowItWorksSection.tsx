import { ArrowRight, LayoutDashboard, PlusSquare, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP } from '../../constants/links';
import { StepCard } from '../cards/StepCard';
import { ButtonLink } from '../common/ButtonLink';
import { SectionHeading } from '../common/SectionHeading';
import { Container } from '../layout/Container';

const steps = [
  {
    step: '01',
    title: 'Create your space',
    description:
      'Register with an Indian mobile number and password. Choose PG, Mess, Hostel, Co-living, or Rental.',
    icon: PlusSquare,
  },
  {
    step: '02',
    title: 'Set up beds or menus',
    description:
      'For PGs, hostels, co-living, and rentals, set up buildings, rooms, and beds. For a mess, start with customers and the menu.',
    icon: Settings2,
  },
  {
    step: '03',
    title: 'Add members and run operations',
    description: 'Add or invite people. Track occupancy, meals, dues, and issues as they happen.',
    icon: LayoutDashboard,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-background py-20 sm:py-24" aria-labelledby="how-heading">
      <Container>
        <SectionHeading
          id="how-heading"
          eyebrow="Get started"
          title="Three steps. One space."
          description="Create the space first. Layout or menus second. People and day-to-day operations third."
        />
        <div className="relative mt-16 grid gap-8 lg:grid-cols-3">
          <div className="pointer-events-none absolute top-12 right-0 left-0 hidden h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 lg:block" />
          {steps.map((s) => (
            <StepCard key={s.step} {...s} />
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href={APP.register} className="gap-2">
            Get started
            <ArrowRight className="h-4 w-4" aria-hidden />
          </ButtonLink>
          <Link to="/how-it-works" className="text-sm font-semibold text-primary-dark hover:text-primary-hover">
            See how it works
          </Link>
        </div>
      </Container>
    </section>
  );
}
