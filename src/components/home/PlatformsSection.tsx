import { Monitor, Smartphone } from 'lucide-react';
import { APP } from '../../constants/links';
import { PlatformCard } from '../cards/PlatformCard';
import { ButtonLink } from '../common/ButtonLink';
import { SectionHeading } from '../common/SectionHeading';
import { Container } from '../layout/Container';

export function PlatformsSection() {
  return (
    <section id="platforms" className="border-y border-border bg-white py-20 sm:py-24" aria-labelledby="platforms-heading">
      <Container>
        <SectionHeading
          id="platforms-heading"
          eyebrow="Where you work"
          title="ACOMI where you run your space"
          description="The same product on the web and on Android. Sign in with an Indian mobile number and password on both."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <PlatformCard
            icon={Monitor}
            title="Web"
            description="Day-to-day desktop operations at app.acomi.in — members, occupancy, meals, dues, and complaints."
            action={
              <ButtonLink href={APP.web} variant="outline">
                Open the web app
              </ButtonLink>
            }
          />
          <PlatformCard
            icon={Smartphone}
            title="Android"
            description="ACOMI on Android for managing your space on the go. Use the same account as the web app. Store listing badges are omitted until a public Play URL is verified."
            action={
              <ButtonLink href={APP.register} variant="ghost">
                Get started on the web
              </ButtonLink>
            }
          />
        </div>
      </Container>
    </section>
  );
}
