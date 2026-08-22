import { APP } from '../../constants/links';
import { ButtonLink } from '../common/ButtonLink';
import { PhoneScreenshot } from '../common/PhoneScreenshot';
import { SectionHeading } from '../common/SectionHeading';
import { Container } from '../layout/Container';

export function OwnerMemberSection() {
  return (
    <section id="owner-member" className="border-y border-border bg-white py-20 sm:py-24" aria-labelledby="owner-member-heading">
      <Container>
        <SectionHeading
          id="owner-member-heading"
          eyebrow="How access works"
          title="Owners run the space. Members join by invitation."
          description="ACOMI is not a listing or booking site. People do not browse PGs here."
        />

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-2">
          <article className="rounded-2xl border border-primary/25 bg-soft/60 p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-dark">Owner / operator</p>
            <h3 className="mt-2 text-2xl font-bold text-text">I am an owner</h3>
            <ul className="mt-5 space-y-2 text-sm leading-relaxed text-text-secondary">
              <li>Create a space — PG, Mess, Hostel, Co-living, or Rental</li>
              <li>Set up beds or menus, depending on type</li>
              <li>Add members as records, or invite a mobile number</li>
              <li>Manage occupancy, meals, dues, and complaints</li>
            </ul>
            <div className="mt-6">
              <ButtonLink href={APP.register}>Get started</ButtonLink>
            </div>
          </article>

          <article className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Member</p>
            <h3 className="mt-2 text-2xl font-bold text-text">Tenant, customer, or staff</h3>
            <ul className="mt-5 space-y-2 text-sm leading-relaxed text-text-secondary">
              <li>Join after an owner invites your Indian mobile number</li>
              <li>There is no public join code and no marketplace</li>
              <li>Complete a profile when asked</li>
              <li>Use stay, meals, payment proofs, and complaints that apply to you</li>
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-muted">
              Owners can add a member as an operational record without that person installing ACOMI.
            </p>
          </article>
        </div>

        <div className="mt-10 flex justify-center">
          <PhoneScreenshot
            src="/screenshots/spaces.png"
            alt="ACOMI onboarding screen asking whether you are an owner or joining as a member"
            caption="Manage your spaces"
          />
        </div>
      </Container>
    </section>
  );
}
