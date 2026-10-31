import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Orbit,
  MoveUpRight,
} from "lucide-react";

import { BG_IMG } from "../utils/constant";
import Footer from "./Footer";

// Layout classes per card create a bento grid (5 columns on md+)
const features = [
  {
    icon: Sparkles,
    title: "Intelligence, amplified.",
    description:
      "Transform ambitious ideas into meaningful outcomes with AI-powered experiences.",
    tag: "Think smarter",
    span: "md:col-span-3",
  },
  {
    icon: Zap,
    title: "Momentum, unlocked.",
    description:
      "Reduce repetitive work, accelerate your workflow, and focus on what matters.",
    tag: "Move faster",
    span: "md:col-span-2",
  },
  {
    icon: ShieldCheck,
    title: "Built with intention.",
    description:
      "A thoughtful, intuitive experience designed around your next big idea.",
    tag: "Build confidently",
    span: "md:col-span-5",
  },
];

const Hero = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    setTilt({
      x: (0.5 - y) * 5,
      y: (x - 0.5) * 7,
    });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <main className="overflow-hidden bg-black text-white">
      <style>{`
        @keyframes orvex-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -12px, 0); }
        }

        @keyframes orvex-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orvex-pulse {
          0%, 100% { opacity: .35; }
          50% { opacity: .9; }
        }

        @keyframes orvex-enter {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .orvex-float { animation: orvex-float 6s ease-in-out infinite; }
        .orvex-orbit { animation: orvex-orbit 36s linear infinite; }
        .orvex-pulse { animation: orvex-pulse 3s ease-in-out infinite; }
        .orvex-enter { animation: orvex-enter .8s ease-out both; }

        .orvex-delay-1 { animation-delay: .12s; }
        .orvex-delay-2 { animation-delay: .24s; }

        @media (prefers-reduced-motion: reduce) {
          .orvex-float,
          .orvex-orbit,
          .orvex-pulse,
          .orvex-enter {
            animation: none !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section
        id="home"
        className="relative isolate border-b border-white/[0.08]"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* soft neutral spotlight instead of blue glow */}
          <div className="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-white/[0.07] blur-[140px]" />
          <div className="absolute -left-40 top-64 h-72 w-72 rounded-full bg-amber-200/[0.05] blur-[110px]" />
          <div className="absolute -right-40 top-96 h-80 w-80 rounded-full bg-white/[0.04] blur-[120px]" />

          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.10) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage:
                "radial-gradient(ellipse at 50% 0%, black, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at 50% 0%, black, transparent 75%)",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24 lg:px-12 lg:pb-28 lg:pt-28">
          <div className="orvex-enter flex justify-center">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-neutral-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-300" />
              </span>
              A new perspective on AI
              <span className="ml-1 border-l border-white/15 pl-3 text-neutral-500">
                v0.1
              </span>
            </div>
          </div>

          <div className="orvex-enter orvex-delay-1 mx-auto mt-8 max-w-5xl text-center">
            <h1 className="text-[clamp(2.8rem,8vw,6.6rem)] font-semibold leading-[0.98] tracking-[-0.065em]">
              Make room for
              <span className="mt-2 block bg-gradient-to-b from-white to-neutral-500 bg-clip-text pb-2 text-transparent">
                the extraordinary.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-neutral-400 sm:mt-8 sm:text-base sm:leading-8">
              Meet Orvex-AI — your intelligent companion for exploring
              ideas, elevating your workflow, and building what comes next.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row">
              <Link
                to="/login"
                className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-amber-300 px-6 py-3 text-sm font-bold text-black shadow-[0_0_40px_rgba(252,211,77,.14)] transition duration-300 hover:-translate-y-0.5 hover:bg-amber-200 hover:shadow-[0_0_50px_rgba(252,211,77,.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
              >
                Get started
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#features"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-medium text-neutral-200 transition hover:border-white/30 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              >
                Discover Orvex
                <ArrowDownRight size={17} className="text-amber-300" />
              </a>
            </div>
          </div>

          {/* 3D ARTWORK */}
          <div className="orvex-enter orvex-delay-2 relative mx-auto mt-16 max-w-6xl sm:mt-20 lg:mt-24">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[65%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.08] blur-[90px]" />

            <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[78%] -translate-x-1/2 -translate-y-1/2">
              <div className="orvex-orbit absolute inset-0 rounded-full border border-white/15" />
              <div className="absolute inset-[8%] rounded-full border border-white/10 [transform:rotateX(65deg)]" />
              <div className="absolute inset-[16%] rounded-full border border-dashed border-amber-200/15 [transform:rotateX(65deg)]" />

              <span className="orvex-pulse absolute left-[8%] top-[26%] h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_18px_#fcd34d]" />
              <span className="orvex-pulse absolute right-[11%] top-[62%] h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_15px_#ffffff]" />
            </div>

            <div className="orvex-float pointer-events-none absolute -left-1 top-[12%] z-20 hidden rounded-xl border border-white/10 bg-black/80 p-4 shadow-2xl backdrop-blur-xl sm:block lg:-left-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-300/10 text-amber-300">
                  <Orbit size={19} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    Intelligence, connected
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Think, create, evolve
                  </p>
                </div>
              </div>
            </div>

            <div
              className="orvex-float pointer-events-none absolute -right-1 bottom-[15%] z-20 hidden rounded-xl border border-white/10 bg-black/80 p-4 shadow-2xl backdrop-blur-xl sm:block lg:-right-5"
              style={{ animationDelay: "-3s" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
                  <Zap size={19} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    Ideas into action
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Your next chapter
                  </p>
                </div>
              </div>
            </div>

            <div
              className="relative z-10 mx-auto w-full max-w-5xl"
              style={{ perspective: "1400px" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={resetTilt}
            >
              <div
                className="relative transition-transform duration-300 ease-out will-change-transform"
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black shadow-[0_30px_100px_rgba(0,0,0,.9),0_0_60px_rgba(255,255,255,.05)] sm:rounded-3xl">
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

                  {BG_IMG ? (
                    <img
                      src={BG_IMG}
                      alt="Orvex-AI futuristic robot companion"
                      className="block min-h-[210px] w-full object-cover object-center sm:min-h-0"
                      onError={(event) => {
                        console.error("Hero image failed to load:", BG_IMG);
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex min-h-[210px] items-center justify-center text-amber-300 sm:min-h-[320px]">
                      Orvex-AI
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent" />
                </div>

                <div
                  className="pointer-events-none absolute -bottom-4 left-1/2 z-20 -translate-x-1/2 sm:-bottom-5"
                  style={{ transform: "translateZ(45px) translateX(-50%)" }}
                >
                  <div className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-black/90 px-4 py-2 text-[11px] font-medium text-neutral-300 shadow-xl backdrop-blur-xl sm:px-5 sm:py-2.5 sm:text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_10px_#fcd34d]" />
                    Smarter ideas. Brighter tomorrow.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] pt-5 text-xs text-neutral-500 sm:mt-14 sm:flex-row">
              <span>Designed for what's next</span>
              <span className="flex items-center gap-2">
                <span>Human creativity</span>
                <span className="text-amber-300">×</span>
                <span>Artificial intelligence</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="relative border-b border-white/[0.08] px-4 py-20 sm:px-8 sm:py-28 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 sm:mb-16 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Less friction.
                <span className="block text-neutral-600">
                  More possibility.
                </span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-neutral-400">
              Thoughtfully designed tools and experiences that help
              you turn your next idea into your next achievement.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isWide = index === 2;

              return (
                <article
                  key={feature.title}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 p-6 transition duration-300 hover:border-amber-200/30 sm:p-8 ${feature.span}`}
                >
                  <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-amber-200/[0.05] blur-2xl transition group-hover:bg-amber-200/[0.14]" />

                  <div
                    className={`relative flex ${
                      isWide
                        ? "flex-col gap-6 md:flex-row md:items-center md:gap-10"
                        : "flex-col"
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-amber-200 transition duration-300 group-hover:border-amber-200/30">
                      <Icon size={21} strokeWidth={1.7} />
                    </div>

                    <div className={isWide ? "md:flex-1" : "mt-8"}>
                      <p className="text-xs font-medium text-amber-300/80">
                        {feature.tag}
                      </p>

                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                        {feature.title}
                      </h3>

                      <p className="mt-3 max-w-md text-sm leading-7 text-neutral-400">
                        {feature.description}
                      </p>
                    </div>

                    <ArrowRight
                      size={18}
                      className={`text-neutral-600 transition duration-300 group-hover:translate-x-1 group-hover:text-amber-300 ${
                        isWide ? "hidden md:block" : "mt-7"
                      }`}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="px-4 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-white/[0.06] blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-amber-200/[0.06] blur-[100px]" />

          <div className="relative grid gap-10 p-7 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16 lg:p-16">
            <div>
              <p className="mb-5 text-xs font-medium text-amber-300">
                The idea behind Orvex
              </p>

              <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Tomorrow isn't something we wait for.
                <span className="mt-1 block text-neutral-600">
                  It's something we build.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-400 sm:text-base sm:leading-8">
                Orvex-AI brings intelligent technology closer to
                everyday creativity. Our vision is to make exploring,
                learning, and creating feel more natural — so you can
                spend less time stuck and more time moving forward.
              </p>
            </div>

            <div className="relative flex h-36 w-36 items-center justify-center justify-self-center sm:h-44 sm:w-44 lg:h-48 lg:w-48">
              <div className="orvex-orbit absolute inset-0 rounded-full border border-dashed border-amber-200/25" />
              <div className="absolute inset-4 rounded-full border border-white/10" />
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.05] text-amber-200 shadow-[0_0_45px_rgba(252,211,77,.1)] sm:h-24 sm:w-24">
                <Orbit size={38} strokeWidth={1.2} />
              </div>
              <span className="absolute right-3 top-7 h-2 w-2 rounded-full bg-amber-200 shadow-[0_0_12px_#fcd34d]" />
              <span className="absolute bottom-6 left-2 h-1.5 w-1.5 rounded-full bg-white/70" />
            </div>

            <div className="flex flex-col gap-4 border-t border-white/[0.08] pt-7 sm:flex-row sm:items-center sm:justify-between lg:col-span-2">
              <p className="text-sm text-neutral-500">
                Your ideas. Your direction. A smarter tomorrow.
              </p>

              <Link
                to="/login"
                className="group inline-flex items-center gap-3 self-start rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white transition hover:border-amber-200/40 hover:bg-white/[0.09] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 sm:self-auto"
              >
                Begin your journey
                <MoveUpRight
                  size={17}
                  className="text-amber-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Hero;