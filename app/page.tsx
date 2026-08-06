import Entrance from "@/components/Entrance";
import Footer from "@/components/Footer";
import TickingWord from "@/components/TickingWord";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[720px] flex-col justify-between px-6 py-10 sm:px-8 sm:py-12">
      {/* Wordmark, top left. */}
      <p className="font-display text-[1.35rem] font-semibold tracking-tight text-ink">
        tally<span className="text-gain">.</span>
      </p>

      {/* The composition, vertically centred. */}
      <div className="py-14">
        <Entrance index={0}>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            Launching this fall
          </p>
        </Entrance>

        <Entrance index={1} className="mt-5">
          <h1 className="font-display text-[clamp(2.6rem,7.5vw,5.2rem)] font-medium leading-[1.04] tracking-[-0.02em] text-ink">
            Your trades have a
            <TickingWord />
          </h1>
        </Entrance>

        <Entrance index={2} className="mt-6">
          <p className="max-w-[50ch] text-[1.02rem] leading-relaxed text-muted">
            Tally is the trading journal that writes itself. Every fill logged,
            tagged, and turned into the lesson you would have skipped writing
            down.
          </p>
        </Entrance>

        <Entrance index={3} className="mt-9">
          <WaitlistForm />
          <p className="mt-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted">
            Auto import · Pattern tags · Weekly review
          </p>
        </Entrance>
      </div>

      <Footer />
    </main>
  );
}
