import { BedDouble, Building2, Home, Hotel, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SpaceTypeCard } from '../cards/SpaceTypeCard';
import { SectionHeading } from '../common/SectionHeading';
import { Container } from '../layout/Container';

const types = [
  {
    icon: Home,
    label: 'PG',
    description: 'Paying Guest. Rooms, beds, members, meals, and dues.',
  },
  {
    icon: UtensilsCrossed,
    label: 'Mess',
    description: 'Mess / canteen. Menus, customers, meal billing, and headcount.',
    note: 'Meal-first — no bed or room map.',
  },
  {
    icon: Hotel,
    label: 'Hostel',
    description: 'Hostel-style accommodation, occupancy, and members.',
  },
  {
    icon: Building2,
    label: 'Co-living',
    description: 'Shared accommodation, occupancy, and member operations.',
  },
  {
    icon: BedDouble,
    label: 'Rental',
    description: 'Flats and rooms — occupancy without a marketplace listing.',
  },
];

export function SpaceTypesSection() {
  return (
    <section id="space-types" className="bg-background py-20 sm:py-24" aria-labelledby="space-types-heading">
      <Container>
        <SectionHeading
          id="space-types-heading"
          eyebrow="Who it's for"
          title="Built for how Indian shared living actually runs"
          description="Five space types. Mess is meal-first — no bed map. Accommodation structure applies to PG, hostel, co-living, and rental."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {types.map((t) => (
            <SpaceTypeCard key={t.label} {...t} />
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link to="/who-its-for" className="text-sm font-semibold text-primary-dark hover:text-primary-hover">
            See who it&apos;s for
          </Link>
        </p>
      </Container>
    </section>
  );
}
