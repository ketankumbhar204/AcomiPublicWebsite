import { useEffect } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { APP } from '../constants/links';
import { PlatformCard } from '../components/cards/PlatformCard';
import { ButtonLink } from '../components/common/ButtonLink';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero } from '../components/common/PageHero';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function PlatformsPage() {
  useEffect(() => {
    applySeo({
      title: 'Web and Android — ACOMI',
      description: 'Use ACOMI in the browser at app.acomi.in or on Android.',
      path: '/platforms',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Platforms"
        title="Use ACOMI where the work happens"
        description="The same product on web and Android. Sign in with an Indian mobile number and password. iOS is not offered as a public download on this site."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <PlatformCard
              icon={Monitor}
              title="Web application"
              description="Operate from app.acomi.in in the browser — dashboard, members, occupancy, meals, payments, complaints, and inventory."
              action={
                <ButtonLink href={APP.web} variant="outline">
                  Open the web app
                </ButtonLink>
              }
            />
            <PlatformCard
              icon={Smartphone}
              title="Android application"
              description="The ACOMI Android app (com.acomi) is the same product. Store listing badges are omitted until a public Play URL is verified."
              action={
                <ButtonLink href={APP.register} variant="ghost">
                  Get started on the web
                </ButtonLink>
              }
            />
          </div>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
