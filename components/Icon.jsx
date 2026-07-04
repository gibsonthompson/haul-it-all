const P = {
  truck: <><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" /><circle cx="7" cy="17" r="1.6" /><circle cx="17.5" cy="17" r="1.6" /></>,
  sofa: <><path d="M4 11V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" /><path d="M3 11a2 2 0 0 1 2 2v3h14v-3a2 2 0 0 1 2-2 2 2 0 0 0-2 2M5 16v2M19 16v2" /></>,
  fridge: <><rect x="6" y="3" width="12" height="18" rx="2" /><path d="M6 10h12M9 6v2M9 13v3" /></>,
  garage: <><path d="M3 21V9l9-5 9 5v12" /><path d="M7 21v-7h10v7M7 17h10" /></>,
  house: <><path d="M4 11l8-6 8 6" /><path d="M6 10v10h12V10M10 20v-5h4v5" /></>,
  hottub: <><path d="M4 11h16v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3z" /><path d="M8 11V6a2 2 0 0 1 4 0M8 15h.01M12 15h.01M16 15h.01" /></>,
  wrench: <><path d="M15 4a4 4 0 0 0-3.5 6L4 17.5 6.5 20l7.5-7.5A4 4 0 1 0 15 4z" /></>,
  shed: <><path d="M4 20V9l8-5 8 5v11" /><path d="M9 20v-6h6v6" /></>,
  box: <><path d="M3 8l9-4 9 4-9 4z" /><path d="M3 8v8l9 4 9-4V8M12 12v8" /></>,
  leaf: <><path d="M5 19c0-8 6-13 15-13 0 9-5 15-13 15-1 0-2 0-2-2z" /><path d="M6 18c4-5 7-7 11-8" /></>,
  recycle: <><path d="M9 6l3-3 3 3M12 3v7" /><path d="M6 12l-2 4 4 1M4.5 15.5 8 9" /><path d="M18 12l2 4-4 1M19.5 15.5 16 9" /></>,
  phone: <><path d="M6 3h3l1.5 5-2 1.5a11 11 0 0 0 5 5l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" /></>,
  camera: <><path d="M4 8h3l1.5-2h7L17 8h3v11H4z" /><circle cx="12" cy="13" r="3.2" /></>,
  arrow: <><path d="M4 12h15M13 6l6 6-6 6" /></>,
  check: <><path d="M4 12.5l5 5L20 6" /></>,
  shield: <><path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></>,
  tag: <><path d="M3 12l8-8h7v7l-8 8z" /><circle cx="15" cy="9" r="1.4" /></>,
  star: <><path d="M12 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9 6.7 19.2l1-5.8L3.5 9.2l5.9-.9z" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
};

export default function Icon({ name, className = "h-6 w-6", stroke = 2 }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {P[name] || P.box}
    </svg>
  );
}