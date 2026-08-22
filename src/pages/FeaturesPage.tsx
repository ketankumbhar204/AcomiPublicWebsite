import { useEffect, type ReactNode } from 'react';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero } from '../components/common/PageHero';
import { Container } from '../components/layout/Container';
import {
  ComplaintsMock,
  DuesMock,
  HeadcountMock,
  MealsMock,
  MembersMock,
  OccupancyMock,
} from '../components/product/FeatureMocks';
import { applySeo } from '../lib/seo';

const groups: Array<{
  title: string;
  intro: string;
  items: Array<{ id: string; title: string; does: string; visual: ReactNode }>;
}> = [
  {
    title: 'Lodging',
    intro: 'For PG, hostel, co-living, and rental. Not used on Mess.',
    items: [
      {
        id: 'occupancy',
        title: 'Occupancy',
        does: 'Buildings, floors, rooms, and beds. Allocate, reserve, move in, transfer, and vacate.',
        visual: <OccupancyMock />,
      },
      {
        id: 'members',
        title: 'Members',
        does: 'Resident records, documents, occupancy, optional meal access. Add without the app or invite a mobile.',
        visual: <MembersMock />,
      },
      {
        id: 'dues',
        title: 'Dues',
        does: 'Expected, collected, under review, pending. Proof upload and approve / reject / request update. Not a gateway.',
        visual: <DuesMock />,
      },
      {
        id: 'complaints',
        title: 'Complaints',
        does: 'Maintenance, housekeeping, service. Status, comments, photos. Web can assign.',
        visual: <ComplaintsMock />,
      },
    ],
  },
  {
    title: 'Meals',
    intro: 'Primary for Mess. Optional for food-enabled lodging.',
    items: [
      {
        id: 'meals',
        title: 'Menus and participation',
        does: 'Menu library, plan breakfast / lunch / dinner, share as text, collect poll responses.',
        visual: <MealsMock />,
      },
      {
        id: 'headcount',
        title: 'Headcount',
        does: 'Meals to prepare vs expected, option counts, no response, serving locations. Kitchen number for the day.',
        visual: <HeadcountMock />,
      },
    ],
  },
];

export function FeaturesPage() {
  useEffect(() => {
    applySeo({
      title: 'Features — ACOMI',
      description:
        'Lodging occupancy and members. Mess menus, participation, and headcount. Dues proofs, complaints, inventory, multi-space.',
      path: '/features',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Jobs operators actually run"
        description="Lodging answers who is staying where. Meals answer how many plates to prepare. Dues and issues stay in the same space."
      />
      <div className="bg-background py-16 sm:py-20">
        <Container className="space-y-20">
          {groups.map((group) => (
            <section key={group.title}>
              <h2 className="text-2xl font-bold text-text sm:text-3xl">{group.title}</h2>
              <p className="mt-2 max-w-2xl text-text-secondary">{group.intro}</p>
              <div className="mt-10 space-y-16">
                {group.items.map((m, i) => (
                  <article key={m.id} id={m.id} className="scroll-mt-24 grid items-center gap-10 lg:grid-cols-2">
                    <div className={i % 2 === 1 ? 'lg:order-2' : undefined}>
                      <h3 className="text-xl font-bold text-text sm:text-2xl">{m.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{m.does}</p>
                    </div>
                    <div className={i % 2 === 1 ? 'lg:order-1' : undefined}>{m.visual}</div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section id="inventory" className="scroll-mt-24 rounded-3xl bg-white p-8 ring-1 ring-border">
            <h2 className="text-2xl font-bold text-text">Supporting</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-text">Inventory</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  Categories, items, stock, suppliers. Food profile for Mess; assets for lodging; furniture for rental.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-text">Multi-space</h3>
                <p className="mt-2 text-sm text-text-secondary">
                  One login, many spaces. Mess can import customers from other spaces the owner manages.
                </p>
              </div>
            </div>
          </section>
        </Container>
      </div>
      <FinalCta />
    </>
  );
}
