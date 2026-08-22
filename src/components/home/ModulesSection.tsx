import { Building2, IndianRupee, Package, Users, UtensilsCrossed, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeatureCard } from '../cards/FeatureCard';
import { SectionHeading } from '../common/SectionHeading';
import { Container } from '../layout/Container';

const primary = [
  {
    icon: Building2,
    title: 'Occupancy',
    description: 'Buildings, floors, rooms, and beds. Allocate, reserve, move in, transfer, and vacate. Hidden for Mess spaces.',
    href: '/features#occupancy',
  },
  {
    icon: Users,
    title: 'Members',
    description: 'Residents, customers, and operational member records. Add a record without the app, or invite someone to join.',
    href: '/features#members',
  },
  {
    icon: UtensilsCrossed,
    title: 'Meals',
    description: 'Menu library, daily planning, participation, and headcount for breakfast, lunch, and dinner.',
    href: '/features#meals',
  },
  {
    icon: IndianRupee,
    title: 'Payments',
    description: 'Expected, collected, and pending. Record payment proofs — not a card or UPI gateway.',
    href: '/features#payments',
  },
];

const secondary = [
  {
    icon: Wrench,
    title: 'Complaints',
    description: 'Track maintenance, food, and service issues with status and comments.',
    href: '/features#complaints',
  },
  {
    icon: Package,
    title: 'Inventory',
    description: 'Manage stock, items, categories, and suppliers seeded by space type.',
    href: '/features#inventory',
  },
];

export function ModulesSection() {
  return (
    <section id="modules" className="bg-background py-20 sm:py-24" aria-labelledby="modules-heading">
      <Container>
        <SectionHeading
          id="modules-heading"
          eyebrow="Product"
          title="One space. The operations that matter."
          description="Occupancy, members, meals, and dues are the core. Complaints and inventory are there when you need them."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {primary.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:mx-auto lg:max-w-3xl">
          {secondary.map((f) => (
            <FeatureCard key={f.title} {...f} emphasized={false} />
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link to="/features" className="text-sm font-semibold text-primary-dark hover:text-primary-hover">
            See features
          </Link>
        </p>
      </Container>
    </section>
  );
}
