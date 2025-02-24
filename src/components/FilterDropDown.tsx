import { FaCaretDown } from "react-icons/fa";

interface FilterDropdownProps {
  label: string;
  isActive: boolean;
  value: string;
  onSelect: () => void;
  onChange: (value: string) => void;
  type?: "text" | "date";
}

export default function FilterDropdown({
  label,
  isActive,
  value,
  onSelect,
  onChange,
  type = "text",
}: FilterDropdownProps) {
  return (
    <div className="relative">
      <button onClick={onSelect} className="flex gap-2">
        {label}
        <FaCaretDown />
      </button>
      {isActive && (
        <input
          type={type}
          className="w-[200%] absolute p-2 border rounded mt-1 bg-white"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Filter by ${label}`}
        />
      )}
    </div>
  );
}
