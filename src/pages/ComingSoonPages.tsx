import { useEffect } from 'react';
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
  const { openUserTypeModal } = useUserType();

  useEffect(() => {
    applySeo({ title: seoTitle, description, path });
  }, [seoTitle, description, path]);

  return (
    <PageHero eyebrow={eyebrow} title={title} description={description}>
      <p className="mt-5 inline-flex rounded-full bg-soft px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
        Coming soon
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href="/" variant="ghost" external={false}>
          Back to home
        </ButtonLink>
        <ActionButton onClick={openUserTypeModal} variant="ghost">
          Change my choice
        </ActionButton>
      </div>
    </PageHero>
  );
}

export function RegisterMessPage() {
  return (
    <ComingSoon
      eyebrow="Mess & food service"
      title="Register your mess on ACOMI"
      description="List your mess, tiffin or meal service on ACOMI."
      seoTitle="Register your mess — ACOMI"
      path="/register-mess"
    />
  );
}

