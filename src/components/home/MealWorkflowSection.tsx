import { Container } from '../layout/Container';

const steps = [
  'Build menu',
  'Plan breakfast, lunch & dinner',
  'Share menu',
  'Collect responses',
  'See headcount',
  'Prepare the right quantity',
];

export function MealWorkflowSection() {
  return (
    <section className="border-y border-border bg-[#F7FBF9] py-16 sm:py-20" aria-labelledby="workflow-heading">
      <Container>
        <h2 id="workflow-heading" className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
          From menu to kitchen.
        </h2>
        <ol className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          {steps.map((title, i) => (
            <li key={title} className="flex items-start gap-3 lg:max-w-[160px] lg:flex-col">
              <p className="text-xs font-semibold tracking-[0.12em] text-primary">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="text-sm font-semibold leading-snug text-text">{title}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
