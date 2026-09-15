export default function AreaIcon({ area }: { area: string }) {
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {area === "love" && <path d="M24 38 9 23C-1 12 14 3 24 15 34 3 49 12 39 23Z" />}
    {area === "escapes" && <><path d="M7 29h34M12 36h24M16 29a8 8 0 0 1 16 0M24 8v5M9 16l4 4M39 16l-4 4" /></>}
    {area === "wardrobe" && <><path d="M19 13a5 5 0 0 1 10 0c0 4-5 4-5 8v2L7 33c-2 1-1 4 1 4h32c2 0 3-3 1-4L24 23" /></>}
    {area === "society" && <><circle cx="24" cy="15" r="5" /><path d="M14 38v-4a10 10 0 0 1 20 0v4M11 13a4 4 0 0 0 0 8M37 13a4 4 0 0 1 0 8M5 34v-3a8 8 0 0 1 6-8M43 34v-3a8 8 0 0 0-6-8" /></>}
  </svg>;
}
