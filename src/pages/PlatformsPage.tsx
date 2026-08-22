import { useEffect } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { APP } from '../constants/links';
import { ButtonLink } from '../components/common/ButtonLink';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero } from '../components/common/PageHero';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function PlatformsPage() {
  useEffect(() => {
    applySeo({
      title: 'Web and Android — ACOMI',
      description: 'Use ACOMI in the browser at app.acomi.in or on the Android app. No iOS download is offered here.',
      path: '/platforms',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Platforms"
        title="Use ACOMI on the web or Android"
        description="The same product. Sign in with an Indian mobile number and password. Store listing badges are omitted until a public Play URL is verified. iOS is not offered as a public download on this site."
      />
      <section className="bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-3xl bg-white p-8 ring-1 ring-border">
              <Monitor className="h-6 w-6 text-primary" aria-hidden />
              <h2 className="mt-4 text-xl font-bold text-text">Web application</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Operate from app.acomi.in — dashboard, members, occupancy, meals, headcount, payments, complaints, and
                inventory.
              </p>
              <div className="mt-6">
                <ButtonLink href={APP.web} variant="outline">
                  Open the web app
                </ButtonLink>
              </div>
            </article>
            <article className="rounded-3xl bg-white p-8 ring-1 ring-border">
              <Smartphone className="h-6 w-6 text-primary" aria-hidden />
              <h2 className="mt-4 text-xl font-bold text-text">Android application</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                The ACOMI Android app (com.acomi) is the same product for on-site work.
              </p>
              <p className="mt-6 text-sm text-muted">No store URL is published on this page.</p>
            </article>
          </div>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
