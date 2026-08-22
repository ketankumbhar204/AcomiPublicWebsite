import { APP } from '../../constants/links';
import { SectionHeading } from '../common/SectionHeading';
import { Container } from '../layout/Container';

const facts = [
  {
    title: 'Password sign-in',
    body: 'You sign in with an Indian mobile number and a password. Passwords are stored as hashes, not in plain text.',
  },
  {
    title: 'Role-based access',
    body: 'People in a space see operations according to their role: Owner, Manager, Tenant, Customer, or Staff.',
  },
  {
    title: 'Account deletion',
    body: 'You can delete your account in the app or on the web, without installing anything extra.',
  },
  {
    title: 'Privacy policy',
    body: 'How ACOMI handles account and operational information is described on the product privacy page.',
  },
];

export function TrustSection() {
  return (
    <section id="trust" className="bg-background py-20 sm:py-24" aria-labelledby="trust-heading">
      <Container>
        <SectionHeading
          id="trust-heading"
          eyebrow="Your account"
          title="Access is yours to control"
          description="Straightforward access controls — not certification badges we do not hold."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {facts.map((f) => (
            <article key={f.title} className="rounded-2xl border border-border/90 bg-surface p-6 shadow-sm">
              <h3 className="font-semibold text-text">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{f.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm font-semibold">
          <a href={APP.privacy} className="text-primary-dark hover:text-primary-hover">
            Privacy policy
          </a>
          <a href={APP.deleteAccount} className="text-primary-dark hover:text-primary-hover">
            Delete account
          </a>
        </div>
      </Container>
    </section>
  );
}
