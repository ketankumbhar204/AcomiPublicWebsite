import { useEffect } from 'react';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero } from '../components/common/PageHero';
import { PhoneScreenshot } from '../components/common/PhoneScreenshot';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

const modules = [
  {
    id: 'occupancy',
    title: 'Occupancy',
    who: 'PG, hostel, co-living, and rental owners and managers.',
    problem: 'It is hard to know which beds are free, reserved, or occupied.',
    does: 'Buildings, floors, rooms, and beds. Allocate, reserve, move in, transfer, and vacate. Mess spaces do not use this structure.',
    src: '/screenshots/accommodation.png',
    alt: 'ACOMI occupancy screen with buildings, rooms, and beds',
    caption: 'Know your occupancy',
  },
  {
    id: 'members',
    title: 'Members',
    who: 'Owners and managers who keep resident and customer records.',
    problem: 'Names, mobiles, documents, and stays live in chats and sheets.',
    does: 'One member list for residents and customers. Add a business record without the app, or send an invitation to a mobile number.',
    src: '/screenshots/members.png',
    alt: 'ACOMI members list',
    caption: 'Manage members',
  },
  {
    id: 'meals',
    title: 'Meals',
    who: 'Mess operators and PGs that include food.',
    problem: 'Daily menus and headcount are planned ad hoc.',
    does: 'Menu library, plan breakfast, lunch, and dinner, share as text, collect responses, and see headcount.',
    src: '/screenshots/meals.png',
    alt: 'ACOMI meal planning screen',
    caption: 'Plan meals',
  },
  {
    id: 'payments',
    title: 'Payments',
    who: 'Owners tracking dues and members submitting proofs.',
    problem: 'Expected, collected, and pending amounts are hard to see.',
    does: 'Operational ledger with payment proofs. Approve, reject, or request an update. ACOMI is not a payment gateway.',
    src: '/screenshots/payments.png',
    alt: 'ACOMI payments screen showing expected, collected, and pending',
    caption: 'Track payments',
  },
  {
    id: 'complaints',
    title: 'Complaints',
    who: 'Owners, staff, and members raising issues.',
    problem: 'Maintenance, food, and service issues disappear in chats.',
    does: 'Raise and track complaints with status, comments, and photos.',
    src: '/screenshots/operations.png',
    alt: 'ACOMI complaints and issue tracking screen',
    caption: 'Track issues',
  },
  {
    id: 'inventory',
    title: 'Inventory',
    who: 'Operators tracking food stock or property assets.',
    problem: 'Stock and assets are tracked separately from the rest of the space.',
    does: 'Categories, items, stock movements, and suppliers. Defaults differ for mess (food) and lodging (assets).',
    src: null,
    alt: '',
    caption: '',
  },
];

export function FeaturesPage() {
  useEffect(() => {
    applySeo({
      title: 'Features — ACOMI',
      description: 'Occupancy, members, meals, payments, complaints, and inventory in one space.',
      path: '/features',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Operations in one space"
        description="What ACOMI does today for occupancy, members, meals, dues, complaints, and inventory — without marketplace or gateway claims."
      />
      <div className="py-16 sm:py-20">
        <Container className="space-y-20">
          {modules.map((m, i) => (
            <section key={m.id} id={m.id} className="scroll-mt-24" aria-labelledby={`${m.id}-title`}>
              <div className={`grid items-center gap-10 lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''}`}>
                <div>
                  <h2 id={`${m.id}-title`} className="text-2xl font-bold text-text sm:text-3xl">
                    {m.title}
                  </h2>
                  <dl className="mt-6 space-y-4 text-sm leading-relaxed text-text-secondary">
                    <div>
                      <dt className="font-semibold text-text">What it does</dt>
                      <dd className="mt-1">{m.does}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-text">Who benefits</dt>
                      <dd className="mt-1">{m.who}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-text">Problem it solves</dt>
                      <dd className="mt-1">{m.problem}</dd>
                    </div>
                  </dl>
                </div>
                {m.src ? (
                  <div className="flex justify-center">
                    <PhoneScreenshot src={m.src} alt={m.alt} caption={m.caption} />
                  </div>
                ) : (
                  <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8 text-center text-sm text-text-secondary">
                    Inventory lives in the product. There is no Play Store screenshot for this module yet.
                  </div>
                )}
              </div>
            </section>
          ))}
        </Container>
      </div>
      <FinalCta />
    </>
  );
}
