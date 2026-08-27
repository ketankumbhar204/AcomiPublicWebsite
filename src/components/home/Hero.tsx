import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { USER_TYPE_OPTIONS, getUserTypeOption } from '../../constants/userTypes';
import type { UserType } from '../../constants/userTypes';
import { useUserType } from '../../context/UserTypeContext';
import { ActionButton } from '../common/ActionButton';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from '../layout/Container';
import { UserTypeCard } from '../onboarding/UserTypeCard';
import { HeroPhones } from './HeroPhones';
// import { BedDouble, IndianRupee, UtensilsCrossed } from 'lucide-react';
// import { HeroValueRow } from './HeroValueRow';

/*
 * Previous hero statements, kept for reference:
 *
 *   Accommodation + Meals
 *   Know who's staying.
 *   Know who's eating.
 *   Know what's due.
 *
 * const lines = [
 *   { Icon: BedDouble, text: "Know who's staying.", iconBg: 'bg-[#E7F4EE]', iconFg: 'text-primary' },
 *   { Icon: UtensilsCrossed, text: "Know who's eating.", iconBg: 'bg-[#FFF1E0]', iconFg: 'text-orange' },
 *   { Icon: IndianRupee, text: "Know what's due.", iconBg: 'bg-[#E8F0FF]', iconFg: 'text-blue' },
 * ];
 */

export function Hero() {
  const navigate = useNavigate();
  const { openUserTypeModal, selectUserType } = useUserType();

  function handleSelect(id: UserType) {
    selectUserType(id);
    navigate(getUserTypeOption(id).to);
  }

  return (
    <section
      className="overflow-x-hidden bg-[radial-gradient(ellipse_at_top_left,rgba(184,240,200,0.28),transparent_46%)] bg-white pt-10 pb-10 sm:pt-14 sm:pb-12"
      aria-labelledby="hero-heading"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
          <div>
            {/*
            <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
              Accommodation + Meals
            </p>
            <h1 id="hero-heading" className="mt-3 space-y-2 sm:mt-5 sm:space-y-5">
              {lines.map((line) => (
                <HeroValueRow key={line.text} {...line} />
              ))}
            </h1>
            */}
            <h1
              id="hero-heading"
              className="text-[1.7rem] leading-[1.15] font-semibold tracking-tight text-navy sm:text-[2rem]"
            >
              How can ACOMI help you?
            </h1>
            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {USER_TYPE_OPTIONS.map((option) => (
                <UserTypeCard
                  key={option.id}
                  option={option}
                  selected={false}
                  onSelect={handleSelect}
                />
              ))}
            </div>
            {/*
            <p className="mt-5 max-w-[26rem] text-[15px] leading-relaxed text-text-secondary sm:text-[16px]">
              Occupancy, meals, headcount and payments — one place.
            </p>
            */}
            <div className="mt-6 flex flex-wrap gap-3">
              <ActionButton onClick={openUserTypeModal}>Get started free</ActionButton>
              <ButtonLink href="/how-it-works" variant="ghost" external={false}>
                See how it works
              </ButtonLink>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#E7F4EE] text-primary">
                <Check className="h-3 w-3" strokeWidth={2.4} aria-hidden />
              </span>
              Built for Indian mess, PG, hostel and co-living operators.
            </p>
          </div>
          <HeroPhones />
        </div>
      </Container>
    </section>
  );
}
