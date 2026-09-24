/* eslint-disable react-refresh/only-export-components -- small icon components live next to the nav config */
/** The four destinations, shared by the phone tab bar and the web header nav. */
function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" fill="currentColor" fillOpacity=".12" />
    </svg>
  );
}
function PathIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 18h7a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h7" strokeDasharray="3 3" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
function ProgressIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 20h16" />
      <path d="M6.5 20v-5M11 20V9M15.5 20v-7M20 20V5" />
    </svg>
  );
}

export const NAV_ITEMS = [
  { to: "/", label: "Home", Icon: HomeIcon, end: true },
  { to: "/path", label: "My path", Icon: PathIcon, end: false },
  { to: "/resources", label: "Near me", Icon: PinIcon, end: false },
  { to: "/progress", label: "Progress", Icon: ProgressIcon, end: false },
];
