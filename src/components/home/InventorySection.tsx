import { Package } from 'lucide-react';
import { DEMO } from '../../data/demo';
import { Container } from '../layout/Container';

export function InventorySection() {
  return (
    <section className="bg-white py-10 sm:py-12" aria-labelledby="inventory-heading">
      <Container>
        <h2
          id="inventory-heading"
          className="text-[1.7rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2rem]"
        >
          Inventory
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Stock title="MESS food stock" rows={DEMO.inventory.mess} />
          <Stock title="PG / Hostel assets" rows={DEMO.inventory.lodging} />
        </div>
      </Container>
    </section>
  );
}

function Stock({ title, rows }: { title: string; rows: readonly { name: string; status: string }[] }) {
  return (
    <article className="rounded-[20px] border border-black/5 bg-[#F4F3FF] p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2">
        <Package className="h-5 w-5 text-[#4F46E5]" aria-hidden />
        <h3 className="text-sm font-semibold text-navy">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm">
            <span className="font-medium text-navy">{r.name}</span>
            <span className={r.status === 'Low' || r.status === 'Maintenance' ? 'text-orange' : 'text-muted'}>
              {r.status}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
