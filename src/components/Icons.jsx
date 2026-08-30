const base = (className) => className ?? "w-5 h-5";

export const CartIcon = ({ className, strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M4 8.5h16l-1.6 10.2a2 2 0 0 1-2 1.8H7.6a2 2 0 0 1-2-1.8L4 8.5Z" strokeLinejoin="round" />
    <path d="M8.4 8V7a3.6 3.6 0 0 1 7.2 0v1" strokeLinecap="round" />
    <path d="M9.4 12v4M14.6 12v4" strokeLinecap="round" />
  </svg>
);

export const SearchIcon = ({ className, strokeWidth = 1.7 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15.2 15.4 4.8 4.6" strokeLinecap="round" />
  </svg>
);

export const MenuIcon = ({ className, strokeWidth = 1.7 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M3.5 7h17M6.5 12h14M3.5 17h17" strokeLinecap="round" />
  </svg>
);

export const CloseIcon = ({ className, strokeWidth = 1.7 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
  </svg>
);

export const ArrowRight = ({ className, strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M3 12h17M14.5 5.5 21 12l-6.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDown = ({ className, strokeWidth = 1.7 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="m5 9 7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const OliveBranch = ({ className }) => (
  <svg viewBox="0 0 120 40" fill="none" className={base(className)} aria-hidden="true">
    <path d="M4 32 C 30 28, 52 18, 116 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <ellipse cx="30" cy="26" rx="9" ry="3.6" transform="rotate(-14 30 26)" fill="currentColor" opacity="0.85" />
    <ellipse cx="55" cy="19" rx="9" ry="3.6" transform="rotate(-16 55 19)" fill="currentColor" opacity="0.85" />
    <ellipse cx="80" cy="13" rx="9" ry="3.6" transform="rotate(-15 80 13)" fill="currentColor" opacity="0.85" />
    <ellipse cx="44" cy="30" rx="8" ry="3.2" transform="rotate(10 44 30)" fill="currentColor" opacity="0.55" />
    <circle cx="68" cy="24" r="4" fill="currentColor" opacity="0.7" />
    <circle cx="94" cy="17" r="3.4" fill="currentColor" opacity="0.7" />
  </svg>
);

export const FeatherIcon = ({ className, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M19.5 4.5c-4.5-.8-9.6 1.2-12.2 5C4.9 13 4.6 17.2 5 20c2.9.4 7 .1 10.4-2.3 3.8-2.6 5.8-7.7 4.1-13.2Z" strokeLinejoin="round" />
    <path d="M5 20c3-4.5 7-8.5 11-11.5" strokeLinecap="round" />
    <path d="M9.5 13.5 13 14M12 10l3 .5" strokeLinecap="round" />
  </svg>
);

export const MailIcon = ({ className, strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
    <path d="m4.5 7 7.5 6 7.5-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PhoneIcon = ({ className, strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M5.5 4.5h3l1.5 4-2 1.5a12.5 12.5 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 3.5 6.7a2 2 0 0 1 2-2.2Z" strokeLinejoin="round" />
  </svg>
);

export const PinIcon = ({ className, strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="2.4" />
  </svg>
);

export const InstagramIcon = ({ className, strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = ({ className, strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M14.5 8.5V6.8c0-.9.6-1.3 1.4-1.3h1.6V2.8h-2.6c-2.4 0-3.9 1.5-3.9 4v1.7H8.5v3h2.5v9.7h3.5V11.5h2.7l.4-3h-3.1Z" strokeLinejoin="round" />
  </svg>
);

export const BookIcon = ({ className, strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M12 6.5C10 5 7.3 4.5 4 4.6v13.8c3.3-.1 6 .4 8 1.9 2-1.5 4.7-2 8-1.9V4.6c-3.3-.1-6 .4-8 1.9Z" strokeLinejoin="round" />
    <path d="M12 6.5v13.8" strokeLinecap="round" />
  </svg>
);

export const TruckIcon = ({ className, strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M2.5 6h11v10h-11zM13.5 9.5h4l3 3.5v3h-7" strokeLinejoin="round" />
    <circle cx="6.5" cy="17.5" r="1.8" />
    <circle cx="16.5" cy="17.5" r="1.8" />
  </svg>
);

export const ShieldIcon = ({ className, strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M12 3.5 5 6v6c0 4.4 3 7.5 7 9 4-1.5 7-4.6 7-9V6l-7-2.5Z" strokeLinejoin="round" />
    <path d="m8.8 11.8 2.3 2.3 4.2-4.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckIcon = ({ className, strokeWidth = 1.8 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="m4.5 12.5 5 5 10-11" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlusIcon = ({ className, strokeWidth = 1.8 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

export const MinusIcon = ({ className, strokeWidth = 1.8 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M5 12h14" strokeLinecap="round" />
  </svg>
);

export const TrashIcon = ({ className, strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M4.5 6.5h15M9.5 6V4.5h5V6M6.5 6.5l1 13h9l1-13M10 10.5v5.5M14 10.5v5.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SpinnerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={`${base(className)} animate-spin`} aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.4" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export const QuoteMark = ({ className }) => (
  <svg viewBox="0 0 48 36" fill="currentColor" className={base(className)} aria-hidden="true">
    <path d="M20 2v14c0 10-5.5 16.4-14.6 19l-2.4-5C9.5 27.7 12.6 24 13 19H2V2h18Zm26 0v14c0 10-5.5 16.4-14.6 19L29 30c6.5-2.3 9.6-6 10-11H28V2h18Z" />
  </svg>
);

export const GoodreadsIcon = ({ className, strokeWidth = 1.6 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="M15.5 13.2c-1.2 1.6-3 2.3-4.7 1.9-2.6-.5-4.3-3-3.9-6 .4-2.8 2.5-4.8 5-4.6 2.7.2 4.4 2.7 4.4 6.2v8c0 2.6-1.7 4.3-4.5 4.3-2.2 0-3.7-1-4.3-2.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.3 10.8c0-2.4-1.2-4.1-3-4.1-1.9 0-3.2 1.7-3.2 4.1s1.3 4.1 3.2 4.1c1.8 0 3-1.7 3-4.1Z" strokeLinejoin="round" />
  </svg>
);

export const GlobeIcon = ({ className, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c-2.6 2.3-4 5.2-4 8.5s1.4 6.2 4 8.5c2.6-2.3 4-5.2 4-8.5s-1.4-6.2-4-8.5Z" />
  </svg>
);

export const PenNib = ({ className, strokeWidth = 1.5 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} className={base(className)} aria-hidden="true">
    <path d="m12 3 7 7-7.5 9.5L4 21l1.5-7.5L13 6" strokeLinejoin="round" />
    <circle cx="12.6" cy="12.4" r="1.4" />
    <path d="m12.6 12.4-4 8.6" strokeLinecap="round" />
  </svg>
);