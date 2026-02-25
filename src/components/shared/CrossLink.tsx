'use client';

import Link from 'next/link';

interface Props {
  type: 'person' | 'event' | 'theme';
  id: string;
  children: React.ReactNode;
}

const HREF_MAP = {
  person: (id: string) => `/people/${id}/`,
  event: (id: string) => `/timeline/#${id}`,
  theme: (id: string) => `/themes/#${id}`,
};

export default function CrossLink({ type, id, children }: Props) {
  const href = HREF_MAP[type](id);
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-0.5 text-accent-blue hover:text-accent-blueHover
                 underline underline-offset-2 transition-colors"
    >
      {children}
    </Link>
  );
}
