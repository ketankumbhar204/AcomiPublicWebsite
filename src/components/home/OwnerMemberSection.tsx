import {
  BedDouble,
  CircleAlert,
  ClipboardList,
  Eye,
  Mail,
  Receipt,
  Settings2,
  UserPlus,
  UtensilsCrossed,
  WalletCards,
  Warehouse,
} from 'lucide-react';
import { Container } from '../layout/Container';

const owner = [
  { label: 'Create spaces', Icon: Warehouse },
  { label: 'Configure operations', Icon: Settings2 },
  { label: 'Add people', Icon: UserPlus },
  { label: 'Manage occupancy', Icon: BedDouble },
  { label: 'Manage meals', Icon: UtensilsCrossed },
  { label: 'Review payments', Icon: WalletCards },
];

const member = [
  { label: 'Join by invitation', Icon: Mail },
  { label: 'View relevant information', Icon: Eye },
  { label: 'Respond to meal polls', Icon: ClipboardList },
  { label: 'Submit payment proof', Icon: Receipt },
  { label: 'Raise complaints', Icon: CircleAlert },
];

export function OwnerMemberSection() {
  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="access-heading">
      <Container>
        <h2
          id="access-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          Access
        </h2>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <RoleCard title="Owner / operator" items={owner} tone="bg-mint" icon="text-primary" />
          <RoleCard title="Member" items={member} tone="bg-[#F4F8FF]" icon="text-blue" />
        </div>
      </Container>
    </section>
  );
}

function RoleCard({
  title,
  items,
  tone,
  icon,
}: {
  title: string;
  items: readonly { label: string; Icon: typeof Warehouse }[];
  tone: string;
  icon: string;
}) {
  return (
    <article className={`rounded-[20px] border border-black/5 p-6 shadow-[var(--shadow-sm)] ${tone}`}>
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-navy">
            <item.Icon className={`h-4 w-4 ${icon}`} aria-hidden />
            {item.label}
          </li>
        ))}
      </ul>
    </article>
  );
}
