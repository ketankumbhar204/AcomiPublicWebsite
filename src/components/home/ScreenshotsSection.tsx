import { PhoneScreenshot } from '../common/PhoneScreenshot';
import { SectionHeading } from '../common/SectionHeading';
import { Container } from '../layout/Container';

const shots = [
  {
    src: '/screenshots/dashboard.png',
    alt: 'ACOMI dashboard on a phone',
    caption: 'See your space at a glance',
  },
  {
    src: '/screenshots/accommodation.png',
    alt: 'ACOMI occupancy and accommodation screen',
    caption: 'Know your occupancy',
  },
  {
    src: '/screenshots/meals.png',
    alt: 'ACOMI meal planning screen',
    caption: 'Plan meals',
  },
];

export function ScreenshotsSection() {
  return (
    <section id="screenshots" className="border-y border-border bg-white py-20 sm:py-24" aria-labelledby="screenshots-heading">
      <Container>
        <SectionHeading
          id="screenshots-heading"
          eyebrow="The product"
          title="See ACOMI as it actually looks"
          description="These are real screens from the ACOMI Android app — occupancy, meals, and the owner dashboard."
        />
        <div className="screenshot-scroll mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 lg:justify-center lg:overflow-visible">
          {shots.map((s) => (
            <div key={s.src} className="snap-center">
              <PhoneScreenshot {...s} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
