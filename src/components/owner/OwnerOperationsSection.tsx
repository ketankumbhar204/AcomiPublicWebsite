import { CircleAlert, Package, UserRound, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { IconBadge } from '../common/IconBadge';
import { Container } from '../layout/Container';

export function OwnerOperationsSection() {
  const { t } = useTranslation();
  const issue = DEMO.complaints.lodging;
  const roles = [
    t('owner.operations.roles.owner'),
    t('owner.operations.roles.manager'),
    t('owner.operations.roles.tenant'),
    t('owner.operations.roles.staff'),
  ];
  const pipeline = [
    { label: t('status.open'), cls: 'bg-[#FFF1F2] text-[#BE123C]' },
    { label: t('status.inProgress'), cls: 'bg-[#FFF8F1] text-[#B45309]' },
    { label: t('status.resolved'), cls: 'bg-mint text-primary' },
  ];

  return (
    <section
      className="border-t border-border bg-[#F7F8FA] py-12 sm:py-14"
      aria-labelledby="owner-operations-heading"
    >
      <Container>
        <h2
          id="owner-operations-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          {t('owner.operations.title')}
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          {t('owner.operations.subtitle')}
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-2.5">
              <IconBadge icon={Users} tone="teal" size="sm" />
              <h3 className="text-sm font-semibold text-navy">{t('common.members')}</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {DEMO.lodging.members.map((m) => (
                <li key={m.name} className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D8F3E3] text-primary">
                    <UserRound className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-navy">{m.name}</span>
                    <span className="text-xs text-muted">
                      {m.room} · {m.bed}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {roles.map((r) => (
                <li
                  key={r}
                  className="rounded-full bg-mint px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                >
                  {r}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-2.5">
              <IconBadge icon={CircleAlert} tone="coral" size="sm" />
              <h3 className="text-sm font-semibold text-navy">{t('common.complaints')}</h3>
            </div>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {pipeline.map((s) => (
                <li
                  key={s.label}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}
                >
                  {s.label}
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-2xl bg-[#F8FBFA] px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">{issue.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{issue.detail}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#FFF8F1] px-2.5 py-0.5 text-[11px] font-semibold text-[#B45309]">
                  {issue.status}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-text-secondary">{t('owner.operations.complaintsNote')}</p>
          </article>

          <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-2.5">
              <IconBadge icon={Package} tone="violet" size="sm" />
              <h3 className="text-sm font-semibold text-navy">{t('common.inventory')}</h3>
            </div>
            <ul className="mt-4 space-y-2">
              {DEMO.inventory.lodging.map((r) => (
                <li
                  key={r.name}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FBFA] px-3 py-2 text-sm"
                >
                  <span className="font-medium text-navy">{r.name}</span>
                  <span className={r.status === 'Maintenance' ? 'text-orange' : 'text-muted'}>
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-text-secondary">{t('owner.operations.inventoryNote')}</p>
          </article>
        </div>
        <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
      </Container>
    </section>
  );
}
