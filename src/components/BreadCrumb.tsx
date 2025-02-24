"use client";

import Link from "next/link";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="mb-4 text-black">
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <Link
              href={item.href}
              className="hover:underline hover:text-[blue]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-yellow">{item.label}</span>
          )}
          {index < items.length - 1 && " / "}
        </span>
      ))}
    </nav>
  );
}
