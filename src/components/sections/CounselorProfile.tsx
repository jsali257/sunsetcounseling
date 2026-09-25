import Image from "next/image";
import { ArrowRight, BadgeCheck, Languages, Monitor, HeartHandshake } from "lucide-react";
import { counselor } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const highlightIcons = [BadgeCheck, Languages, Monitor, HeartHandshake];

function Portrait() {
  if (counselor.portrait) {
    return (
      <Image
        src={counselor.portrait.src}
        alt={counselor.portrait.alt}
        fill
        sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 90vw"
        className="object-cover"
      />
    );
  }
  // Tasteful placeholder until a professional portrait is provided.
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(165deg,var(--color-peach-200)_0%,var(--color-sand-200)_55%,var(--color-sage-300)_100%)]"
    >
      <svg viewBox="0 0 200 250" className="absolute inset-x-0 bottom-0 w-full text-cream-50/70">
        <path d="M0 190c50-20 110-24 200-6v66H0Z" fill="currentColor" opacity="0.5" />
        <path d="M0 214c70-18 130-14 200 2v34H0Z" fill="currentColor" opacity="0.6" />
      </svg>
      <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-cream-50/80 bg-cream-50/50 backdrop-blur-sm">
        <span className="font-serif text-5xl text-terracotta-700/80 italic">DA</span>
      </div>
    </div>
  );
}

export function CounselorProfile({ variant = "summary" }: { variant?: "summary" | "full" }) {
  const full = variant === "full";
  const bio = full ? counselor.bio : counselor.bio.slice(0, 2);

  return (
    <section aria-labelledby="counselor-heading" className="bg-sand-100 py-20 sm:py-28">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal className="mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:max-w-none">
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-2 translate-x-2 translate-y-2 rounded-[2.25rem] sm:-inset-3 sm:translate-x-4 sm:translate-y-4 border border-terracotta-300/50"
              />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-lift)]">
                <Portrait />
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-ink-600 lg:text-left">
              {counselor.name}, {counselor.credentials}
              <span className="block text-ink-500">{counselor.title}</span>
            </p>
          </Reveal>

          <Reveal delay={120}>
            <p className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-700">
              <span aria-hidden="true" className="h-px w-8 bg-terracotta-400/70" />
              Meet Your Counselor
            </p>
            <h2
              id="counselor-heading"
              className="text-[1.875rem] leading-[1.15] text-ink-900 sm:text-4xl lg:text-[2.75rem]"
            >
              {counselor.name}, <span className="text-ink-600">{counselor.credentials}</span>
            </h2>

            <div className="mt-7 space-y-5 text-lg leading-relaxed text-ink-700">
              {bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <ul className="mt-9 grid gap-3 sm:grid-cols-2" aria-label="Professional highlights">
              {counselor.highlights.map((item, i) => {
                const Icon = highlightIcons[i % highlightIcons.length];
                return (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-xl border border-sand-200 bg-cream-50/80 px-4 py-3.5 text-[0.95rem] text-ink-800"
                  >
                    <Icon aria-hidden="true" className="h-[1.125rem] w-[1.125rem] shrink-0 text-sage-600" />
                    {item}
                  </li>
                );
              })}
            </ul>

            {full ? (
              <div className="mt-12 border-t border-sand-300/70 pt-10">
                <h3 className="text-2xl text-ink-900">Approaches that may be incorporated</h3>
                <p className="mt-3 text-ink-600">
                  Techniques are selected collaboratively based on each client’s individual needs.
                </p>
                <ul className="mt-6 flex flex-wrap gap-2.5">
                  {counselor.approaches.map((a) => (
                    <li
                      key={a}
                      className="rounded-full bg-sage-100 px-4 py-2 text-sm text-sage-700"
                    >
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-9">
                <ButtonLink
                  href="/about"
                  variant="text"
                  iconPosition="end"
                  icon={
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  }
                >
                  Read Diana’s full profile
                </ButtonLink>
              </div>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
