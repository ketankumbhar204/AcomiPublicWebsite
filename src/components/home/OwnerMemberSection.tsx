import {
  BedDouble,
  CircleAlert,
  ClipboardList,
  Eye,
  Mail,
  MessageSquare,
  Receipt,
  Search,
  Settings2,
  Soup,
  UserPlus,
  UtensilsCrossed,
  WalletCards,
  Warehouse,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../layout/Container';

export function OwnerMemberSection({ includeSeekers = false }: { includeSeekers?: boolean }) {
  const { t } = useTranslation();

  const owner = [
    { label: t('home.access.owner.createSpaces'), Icon: Warehouse },
    { label: t('home.access.owner.configureOperations'), Icon: Settings2 },
    { label: t('home.access.owner.addPeople'), Icon: UserPlus },
    { label: t('home.access.owner.manageOccupancy'), Icon: BedDouble },
    { label: t('home.access.owner.manageMeals'), Icon: UtensilsCrossed },
    { label: t('home.access.owner.reviewPayments'), Icon: WalletCards },
  ];

  const member = [
    { label: t('home.access.member.joinByInvitation'), Icon: Mail },
    { label: t('home.access.member.viewRelevant'), Icon: Eye },
    { label: t('home.access.member.respondToPolls'), Icon: ClipboardList },
    { label: t('home.access.member.submitProof'), Icon: Receipt },
    { label: t('home.access.member.raiseComplaints'), Icon: CircleAlert },
  ];

  const seekers = [
    { label: t('home.access.seeker.findPlace'), Icon: Search },
    { label: t('home.access.seeker.findMeals'), Icon: Soup },
    { label: t('home.access.seeker.review'), Icon: Eye },
    { label: t('home.access.seeker.enquire'), Icon: MessageSquare },
  ];

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="access-heading">
      <Container>
        <h2
          id="access-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          {t(includeSeekers ? 'home.access.whoTitle' : 'home.access.title')}
        </h2>
        <div className={`mt-8 grid gap-4 ${includeSeekers ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          <RoleCard title={t('home.access.ownerTitle')} items={owner} tone="bg-mint" icon="text-primary" />
          <RoleCard title={t('home.access.memberTitle')} items={member} tone="bg-[#F4F8FF]" icon="text-blue" />
          {includeSeekers ? (
            <RoleCard
              title={t('home.access.seekerTitle')}
              note={t('home.access.seekerNote')}
              items={seekers}
              tone="bg-[#F7F4FF]"
              icon="text-purple"
            />
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function RoleCard({
  title,
  note,
  items,
  tone,
  icon,
}: {
  title: string;
  note?: string;
  items: readonly { label: string; Icon: typeof Warehouse }[];
  tone: string;
  icon: string;
}) {
  return (
    <article className={`rounded-[20px] border border-black/5 p-6 shadow-[var(--shadow-sm)] ${tone}`}>
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      {note ? <p className="mt-2 text-sm leading-relaxed text-text-secondary">{note}</p> : null}
      <ul className={`mt-4 grid gap-2 ${note ? '' : 'sm:grid-cols-2'}`}>
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
