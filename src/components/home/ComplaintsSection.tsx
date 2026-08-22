import { CircleAlert } from 'lucide-react';
import { DEMO } from '../../data/demo';
import { Container } from '../layout/Container';

const pipeline = [
  { label: 'Open', cls: 'bg-[#FFF1F2] text-[#BE123C]' },
  { label: 'In progress', cls: 'bg-[#FFF8F1] text-[#B45309]' },
  { label: 'Resolved', cls: 'bg-mint text-primary' },
];

export function ComplaintsSection() {
  return (
    <section className="bg-[#F7F8FA] py-10 sm:py-12" aria-labelledby="complaints-heading">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2
            id="complaints-heading"
            className="text-[1.7rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2rem]"
          >
            Complaints
          </h2>
          <div className="flex flex-wrap gap-2">
            {pipeline.map((s) => (
              <span key={s.label} className={`rounded-full px-3 py-1 text-[11px] font-semibold ${s.cls}`}>
                {s.label}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Issue badge="PG" item={DEMO.complaints.lodging} />
          <Issue badge="MESS" item={DEMO.complaints.mess} />
        </div>
      </Container>
    </section>
  );
}

function Issue({
  badge,
  item,
}: {
  badge: string;
  item: { title: string; detail: string; status: string };
}) {
  const statusCls =
    item.status === 'Open' ? 'bg-[#FFF1F2] text-[#BE123C]' : 'bg-[#FFF8F1] text-[#B45309]';

  return (
    <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-coral uppercase">{badge}</p>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusCls}`}>
          {item.status}
        </span>
      </div>
      <div className="mt-3 flex items-start gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF1F2] text-coral">
          <CircleAlert className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-base font-semibold text-navy">{item.title}</h3>
          <p className="mt-0.5 text-sm text-muted">{item.detail}</p>
        </div>
      </div>
    </article>
  );
}
