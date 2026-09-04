import { useEffect, type ReactNode } from 'react';
import { BedDouble, Building2, Home, Monitor, Smartphone, UserRound, Users, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero, PageSectionHead } from '../components/common/PageHero';
import { IconBadge } from '../components/common/IconBadge';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function AboutPage() {
  const { t } = useTranslation();

  const types = [
    {
      name: t('home.spaceTypes.types.mess.name'),
      line: t('home.spaceTypes.types.mess.line'),
      Icon: UtensilsCrossed,
      tone: 'bg-[#FFF8F1] text-orange',
    },
    {
      name: t('home.spaceTypes.types.pg.name'),
      line: t('home.spaceTypes.types.pg.line'),
      Icon: BedDouble,
      tone: 'bg-mint text-primary',
    },
    {
      name: t('home.spaceTypes.types.hostel.name'),
      line: t('home.spaceTypes.types.hostel.line'),
      Icon: Building2,
      tone: 'bg-mint text-primary',
    },
    {
      name: t('home.spaceTypes.types.coliving.name'),
      line: t('home.spaceTypes.types.coliving.line'),
      Icon: Users,
      tone: 'bg-[#F7F4FF] text-purple',
    },
    {
      name: t('home.spaceTypes.types.rental.name'),
      line: t('home.spaceTypes.types.rental.line'),
      Icon: Home,
      tone: 'bg-[#F4F8FF] text-blue',
    },
  ];

  useEffect(() => {
    applySeo({
      title: t('aboutPage.seo.title'),
      description: t('aboutPage.seo.description'),
      path: '/about',
    });
  }, [t]);

  return (
    <>
      <PageHero
        eyebrow={t('aboutPage.eyebrow')}
        title={t('aboutPage.title')}
        description={t('aboutPage.description')}
      />

      <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="about-heading">
        <Container>
          <PageSectionHead
            id="about-heading"
            title={t('aboutPage.helpsTitle')}
            intro={t('aboutPage.helpsIntro')}
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[24px] border border-black/5 bg-[#FFF8F1] p-6 shadow-[var(--shadow-sm)]">
              <IconBadge icon={UtensilsCrossed} tone="amber" />
              <h2 className="mt-4 text-[1.35rem] font-semibold text-navy">{t('common.meals')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{t('aboutPage.mealsBody')}</p>
            </article>
            <article className="rounded-[24px] border border-black/5 bg-mint p-6 shadow-[var(--shadow-sm)]">
              <IconBadge icon={BedDouble} tone="teal" />
              <h2 className="mt-4 text-[1.35rem] font-semibold text-navy">{t('common.accommodation')}</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {t('aboutPage.accommodationBody')}
              </p>
            </article>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-14" aria-labelledby="types-heading">
        <Container>
          <PageSectionHead id="types-heading" title={t('aboutPage.typesTitle')} />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {types.map((item) => (
              <li
                key={item.name}
                className={`rounded-[20px] border border-black/5 p-5 shadow-[var(--shadow-sm)] ${item.tone}`}
              >
                <item.Icon className="h-8 w-8" strokeWidth={1.7} aria-hidden />
                <p className="mt-4 text-lg font-semibold text-navy">{item.name}</p>
                <p className="mt-1 text-sm text-text-secondary">{item.line}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-[#F7F8FA] py-12 sm:py-14">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            <Fact
              icon={<IconBadge icon={UserRound} tone="teal" />}
              title={t('aboutPage.facts.owners.title')}
              line={t('aboutPage.facts.owners.line')}
            />
            <Fact
              icon={<IconBadge icon={Monitor} tone="blue" />}
              title={t('aboutPage.facts.web.title')}
              line={t('aboutPage.facts.web.line')}
            />
            <Fact
              icon={<IconBadge icon={Smartphone} tone="violet" />}
              title={t('aboutPage.facts.android.title')}
              line={t('aboutPage.facts.android.line')}
            />
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-text-secondary">
            {t('aboutPage.footnote')}
          </p>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}

function Fact({ icon, title, line }: { icon: ReactNode; title: string; line: string }) {
  return (
    <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
      {icon}
      <h3 className="mt-4 text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{line}</p>
    </article>
  );
}
