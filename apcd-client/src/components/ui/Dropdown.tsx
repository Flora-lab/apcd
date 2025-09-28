// src/components/ui/Dropdown.tsx
import React, { useState, useRef, useEffect } from "react";

interface DropdownProps {
  label: React.ReactNode;
  items: { label: string; onClick: () => void }[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, items }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button onClick={() => setOpen(!open)}>{label}</button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
              className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
