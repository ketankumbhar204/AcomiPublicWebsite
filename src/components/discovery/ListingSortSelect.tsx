import { useTranslation } from 'react-i18next';
import { SORT_OPTIONS } from '../../data/listings/defaults';
import type { PropertySort } from '../../data/listings/types';
import { FIELD_INPUT_BASE } from '../form/Field';

type ListingSortSelectProps = {
  id: string;
  value: PropertySort;
  onChange: (value: PropertySort) => void;
};

export function ListingSortSelect({ id, value, onChange }: ListingSortSelectProps) {
  const { t } = useTranslation();

  return (
    <div className="min-w-[11rem]">
      <label htmlFor={id} className="sr-only">
        {t('discovery.sortLabel')}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as PropertySort)}
        className={`${FIELD_INPUT_BASE} border-border py-2.5 text-[13px] focus:border-register`}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.id} value={option.id}>
            {t(`discovery.sort.${option.id}`)}
          </option>
        ))}
      </select>
    </div>
  );
}
