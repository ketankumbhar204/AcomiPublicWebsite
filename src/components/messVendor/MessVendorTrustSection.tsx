import { useTranslation } from 'react-i18next';
import { APP } from '../../constants/links';
import { Reveal } from '../common/Reveal';
import { Container } from '../layout/Container';

export function MessVendorTrustSection() {
  const { t } = useTranslation();
  const facts = [
    { title: t('messVendor.trust.facts.spaces.title'), body: t('messVendor.trust.facts.spaces.body') },
    { title: t('owner.trust.facts.invite.title'), body: t('owner.trust.facts.invite.body') },
    { title: t('messVendor.trust.facts.roles.title'), body: t('messVendor.trust.facts.roles.body') },
    { title: t('owner.trust.facts.platforms.title'), body: t('owner.trust.facts.platforms.body') },
    { title: t('owner.trust.facts.privacy.title'), body: t('owner.trust.facts.privacy.body') },
  ];

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="mess-trust-heading">
      <Container>
        <Reveal>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
            {t('owner.trust.eyebrow')}
          </p>
          <h2
            id="mess-trust-heading"
            className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
          >
            {t('owner.trust.title')}
          </h2>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
            {t('owner.trust.subtitle')}
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
            {t('common.privacy')}
          </a>
          <a
            href={APP.deleteAccount}
            className="font-semibold text-primary hover:text-primary-hover"
          >
            {t('common.deleteAccount')}
          </a>
        </p>
      </Container>
    </section>
  );
}
