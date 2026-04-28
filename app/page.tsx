export default function Home() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex flex-col items-center gap-8 max-w-2xl">
        <h1
          className="text-5xl sm:text-7xl tracking-[0.18em] font-bold uppercase"
          style={{ fontFamily: "var(--font-display)", color: "var(--blue)" }}
        >
          HELiiX
        </h1>
        <p
          className="text-xl sm:text-2xl tracking-wide"
          style={{ fontFamily: "var(--font-ui)", color: "var(--ink-soft)" }}
        >
          Studio for ambitious software.
        </p>
        <p
          className="text-sm tracking-[0.2em] uppercase mt-8"
          style={{ fontFamily: "var(--font-ui)", color: "var(--ink-mute)" }}
        >
          Currently in private build
        </p>
      </div>
    </main>
  );
}
