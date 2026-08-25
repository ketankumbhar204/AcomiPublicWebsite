import { Reveal } from '../common/Reveal';
import { Container } from '../layout/Container';

const tenant = ['Resident records', 'Occupancy', 'Documents', 'Meal access', 'Dues', 'Complaints'];
const customer = ['Meal participation', 'Menu access', 'Meal plans', 'Meal payments', 'Complaints'];

export function PeopleSection() {
  return (
    <section className="bg-background py-16 sm:py-24" aria-labelledby="people-heading">
      <Container>
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">Members & customers</p>
          <h2 id="people-heading" className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-text sm:text-4xl">
            People, not spreadsheets.
          </h2>
          <p className="mt-4 max-w-2xl text-text-secondary">
            Add an operational record without the app, or invite a mobile number. The same person can be a customer in a
            mess and a tenant in a PG.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <article className="h-full rounded-3xl bg-[#0b5f7a] p-7 text-white">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-[#b8e6f3] uppercase">Mess</p>
              <h3 className="mt-2 text-2xl font-bold">Customers</h3>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {customer.map((item) => (
                  <li key={item} className="rounded-lg bg-white/10 px-3 py-2 text-sm">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
          <Reveal delayMs={70}>
            <article className="h-full rounded-3xl bg-white p-7 ring-1 ring-border">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">Lodging</p>
              <h3 className="mt-2 text-2xl font-bold text-text">Tenants</h3>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {tenant.map((item) => (
                  <li key={item} className="rounded-lg bg-brand-50 px-3 py-2 text-sm text-text">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
