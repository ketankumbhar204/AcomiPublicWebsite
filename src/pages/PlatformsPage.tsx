import { useEffect } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { APP } from '../constants/links';
import { ButtonLink } from '../components/common/ButtonLink';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero, PageSectionHead } from '../components/common/PageHero';
import { IconBadge } from '../components/common/IconBadge';
import { BrowserChrome } from '../components/product/BrowserChrome';
import { OperationsDashboard } from '../components/product/OperationsDashboard';
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
        title="Use ACOMI on the web or Android."
        description="The same product. Sign in with an Indian mobile number and password."
      />
      <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="platforms-heading">
        <Container>
          <PageSectionHead id="platforms-heading" title="One product. Two places." />
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
            <div className="grid gap-4">
              <article className="rounded-[20px] border border-black/5 bg-mint p-6 shadow-[var(--shadow-sm)]">
                <IconBadge icon={Monitor} tone="teal" />
                <h2 className="mt-4 text-lg font-semibold text-navy">Web application</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  Operate from app.acomi.in — dashboard, members, occupancy, meals, headcount, payments, complaints, and
                  inventory.
                </p>
                <div className="mt-5">
                  <ButtonLink href={APP.web}>Open the web app</ButtonLink>
                </div>
              </article>
              <article className="rounded-[20px] border border-black/5 bg-[#F4F8FF] p-6 shadow-[var(--shadow-sm)]">
                <IconBadge icon={Smartphone} tone="blue" />
                <h2 className="mt-4 text-lg font-semibold text-navy">Android application</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  The ACOMI Android app (com.acomi) is the same product for on-site work.
                </p>
                <p className="mt-4 text-sm text-muted">
                  No store URL is published on this page. iOS is not offered as a public download.
                </p>
              </article>
            </div>
            <BrowserChrome url="app.acomi.in">
              <OperationsDashboard compact />
            </BrowserChrome>
          </div>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
