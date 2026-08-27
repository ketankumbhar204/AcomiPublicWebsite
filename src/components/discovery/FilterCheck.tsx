type FilterCheckProps = {
  checked: boolean;
  onChange: () => void;
  children: string;
};

export function FilterCheck({ checked, onChange, children }: FilterCheckProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-text">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-border text-register accent-register"
      />
      {children}
    </label>
  );
}
