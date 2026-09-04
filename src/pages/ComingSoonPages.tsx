import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../components/common/ActionButton';
import { ButtonLink } from '../components/common/ButtonLink';
import { PageHero } from '../components/common/PageHero';
import { useUserType } from '../context/UserTypeContext';
import { applySeo } from '../lib/seo';

type ComingSoonProps = {
  eyebrow: string;
  title: string;
  description: string;
  seoTitle: string;
  path: string;
};

function ComingSoon({ eyebrow, title, description, seoTitle, path }: ComingSoonProps) {
  const { t } = useTranslation();
  const { openUserTypeModal } = useUserType();

  useEffect(() => {
    applySeo({ title: seoTitle, description, path });
  }, [seoTitle, description, path]);

  return (
    <PageHero eyebrow={eyebrow} title={title} description={description}>
      <p className="mt-5 inline-flex rounded-full bg-soft px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
        {t('comingSoon.badge')}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/" variant="ghost" external={false}>
          {t('comingSoon.backHome')}
        </ButtonLink>
        <ActionButton onClick={openUserTypeModal} variant="ghost">
          {t('comingSoon.changeChoice')}
        </ActionButton>
      </div>
    </PageHero>
  );
}

export function RegisterMessPage() {
  const { t } = useTranslation();

  return (
    <ComingSoon
      eyebrow={t('comingSoon.registerMess.eyebrow')}
      title={t('comingSoon.registerMess.title')}
      description={t('comingSoon.registerMess.description')}
      seoTitle={t('comingSoon.registerMess.seoTitle')}
      path="/register-mess"
    />
  );
}

