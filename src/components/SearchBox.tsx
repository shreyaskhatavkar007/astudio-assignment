import { useState } from "react";
import { FaSearch } from "react-icons/fa";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBox({ value, onChange }: SearchBoxProps) {
  const [show, setShow] = useState<boolean>(false);
  return (
    <div className="flex gap-4 items-center">
      <FaSearch
        onClick={() => setShow(!show)}
        className="text-black cursor-pointer"
      />
      {show && (
        <input
          type="text"
          className="p-1 border rounded"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search..."
        />
      )}
    </div>
  );
}
