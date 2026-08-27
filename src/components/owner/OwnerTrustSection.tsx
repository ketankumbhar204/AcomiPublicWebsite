import { APP } from '../../constants/links';
import { Reveal } from '../common/Reveal';
import { Container } from '../layout/Container';

const facts = [
  {
    title: 'Owner-controlled spaces',
    body: 'You create the space. Type is set once. Members do not list or book a bed here.',
  },
  {
    title: 'Invitation-based membership',
    body: 'Invite a 10-digit Indian mobile, or add a record without the app.',
  },
  {
    title: 'Role-based access',
    body: 'Owner, Manager, Tenant and Staff see what their role allows.',
  },
  {
    title: 'Same product on web and Android',
    body: 'One API. Desk work on app.acomi.in; on-site on Android.',
  },
  {
    title: 'Account deletion and privacy',
    body: 'Delete from the app or on the web. Privacy lives on the product site.',
  },
];

export function OwnerTrustSection() {
  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="owner-trust-heading">
      <Container>
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
            Product facts
          </p>
          <h2
            id="owner-trust-heading"
            className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
          >
            Access is yours to control.
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
            Trust from how the product works — not invented customer counts.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((f, i) => (
            <Reveal key={f.title} delayMs={i * 30}>
              <article className="h-full rounded-2xl bg-brand-50 p-5">
                <h3 className="font-semibold text-navy">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{f.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <a href={APP.privacy} className="font-semibold text-primary hover:text-primary-hover">
            Privacy
          </a>
          <a
            href={APP.deleteAccount}
            className="font-semibold text-primary hover:text-primary-hover"
          >
            Delete account
          </a>
        </p>
      </Container>
    </section>
  );
}
