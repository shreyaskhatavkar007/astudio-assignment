interface PageSizeSelectorProps {
  value: number;
  onChange: (size: number) => void;
}

export default function PageSizeSelector({
  value,
  onChange,
}: PageSizeSelectorProps) {
  return (
    <div className="flex gap-2">
      <select
        className="bg-white text-black"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {[5, 10, 20, 50].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <p>Entries</p>
    </div>
  );
}
