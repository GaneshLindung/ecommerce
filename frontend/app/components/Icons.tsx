import React from 'react';

export function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3.75 9 7.5-6 7.5 6v9.75a.75.75 0 0 1-.75.75h-3.75v-6h-6v6H4.5a.75.75 0 0 1-.75-.75z"
      />
    </svg>
  );
}

export function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386a.75.75 0 0 1 .733.568l.383 1.532m0 0 1.158 4.63a2.25 2.25 0 0 0 2.186 1.72h6.535a2.25 2.25 0 0 0 2.186-1.72l1.101-4.43a.75.75 0 0 0-.728-.93H4.852m-.75 0-.383-1.532M9 21.75A1.125 1.125 0 0 1 7.875 20.625 1.125 1.125 0 0 1 9 19.5a1.125 1.125 0 0 1 1.125 1.125A1.125 1.125 0 0 1 9 21.75Zm8.25 0A1.125 1.125 0 0 1 16.125 20.625 1.125 1.125 0 0 1 17.25 19.5a1.125 1.125 0 0 1 1.125 1.125A1.125 1.125 0 0 1 17.25 21.75Z"
      />
    </svg>
  );
}

export function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 6 7.5 3 6 6 3 7.5 6 9l1.5 3L9 9l3-1.5L9 6Zm9 3-1.5-3L15 9l-3 1.5 3 1.5 1.5 3L18 12l3-1.5L18 9Zm-3 6-1.5-3L12 15l-3 1.5 3 1.5 1.5 3L15 18l3-1.5L15 15Z"
      />
    </svg>
  );
}