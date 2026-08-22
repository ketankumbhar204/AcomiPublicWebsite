import accommodationPng from '../assets/screenshots/accommodation.png';
import dashboardPng from '../assets/screenshots/dashboard.png';
import mealsPng from '../assets/screenshots/meals.png';
import membersPng from '../assets/screenshots/members.png';
import messPng from '../assets/screenshots/mess.png';
import paymentsPng from '../assets/screenshots/payments.png';

export const SHOTS = {
  dashboard: {
    src: dashboardPng,
    alt: 'Sunrise PG dashboard with occupancy, payments and meal headcount',
    caption: 'Dashboard',
  },
  occupancy: {
    src: accommodationPng,
    alt: 'Sunrise PG occupancy with occupied, vacant and reserved beds',
    caption: 'PG · Know who is staying',
  },
  mess: {
    src: messPng,
    alt: 'Sunrise Mess dashboard with 86 customers and breakfast, lunch and dinner headcount',
    caption: 'MESS · Know who is eating',
  },
  meals: {
    src: mealsPng,
    alt: 'ACOMI meals screen with breakfast headcount',
    caption: 'Meals',
  },
  members: {
    src: membersPng,
    alt: 'ACOMI members screen with tenants and customers',
    caption: 'Members',
  },
  payments: {
    src: paymentsPng,
    alt: 'ACOMI payments screen with expected and collected dues',
    caption: 'Payments',
  },
} as const;
