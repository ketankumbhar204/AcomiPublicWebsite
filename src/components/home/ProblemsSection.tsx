import { BedDouble, Building2, MessageSquareWarning, Users, UtensilsCrossed, Wallet } from 'lucide-react';
import { ProblemCard } from '../cards/ProblemCard';
import { SectionHeading } from '../common/SectionHeading';
import { Container } from '../layout/Container';

const problems = [
  {
    icon: BedDouble,
    title: 'Occupancy is unclear',
    description:
      'Know who is in which room or bed without maintaining scattered registers. See buildings, rooms, and beds in one place.',
  },
  {
    icon: Users,
    title: 'Members are hard to keep organised',
    description:
      'Keep member profiles, occupancy, documents, and invitations together instead of across chats and sheets.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Meals are manual',
    description: 'Plan breakfast, lunch, and dinner, track participation, and keep headcount organised.',
  },
  {
    icon: Wallet,
    title: 'Dues are difficult to follow',
    description:
      'Track expected, collected, and pending amounts, and keep payment proofs with the operational ledger.',
  },
  {
    icon: MessageSquareWarning,
    title: 'Issues get lost',
    description: 'Track maintenance, food, and service complaints through a status workflow instead of scattered chats.',
  },
  {
    icon: Building2,
    title: 'Multiple spaces become difficult to manage',
    description: 'Switch between spaces from one account when you run more than one PG, hostel, or mess.',
  },
];

export function ProblemsSection() {
  return (
    <section id="problems" className="border-t border-border bg-white py-20 sm:py-24" aria-labelledby="problems-heading">
      <Container>
        <SectionHeading
          id="problems-heading"
          eyebrow="The daily grind"
          title="Operations that still live in notebooks and chats"
          description="ACOMI is built for the work owners already do — occupancy, members, meals, dues, and issues — in one space."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <ProblemCard key={p.title} {...p} />
          ))}
        </div>
      </Container>
    </section>
  );
}
