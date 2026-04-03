import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Sparkles } from "lucide-react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { expertiseAreas, featuredProjects, portfolioMetrics, toolsByGroup, workTimeline } from "@/lib/content/portfolio";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl space-y-16 px-4 py-10 sm:px-6 md:py-12">
      <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-pink-600">
            <Sparkles size={14} /> Saffu AI Portfolio
          </p>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Product Designer who codes.
            <span className="block text-pink-600">Now with a wife-style AI chat hero.</span>
          </h1>
          <p className="max-w-2xl text-base text-slate-600 sm:text-lg">
            Ask Saffu anything about Hamza Shaikh and get fast, factual answers with playful personality. Then
            explore the portfolio, projects, and case studies below.
          </p>
          <div className="flex flex-wrap gap-3">
            {portfolioMetrics.map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-lg font-semibold text-slate-900">{metric.value}</p>
                <p className="text-xs text-slate-500">{metric.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Read blog and case studies <ArrowRight size={16} />
            </Link>
            <a
              href="mailto:hamfulldesigns@gmail.com"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
            >
              Contact Hamza
            </a>
          </div>
        </div>

        <ChatPanel />
      </section>

      <section id="projects" className="space-y-4">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">Featured Work</p>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Selected projects</h2>
        </header>
        <div className="grid gap-4 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <article key={project.id} className="rounded-3xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{project.subtitle}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{project.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span key={item} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">Core Expertise</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {expertiseAreas.map((item) => (
              <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">Skills & Tools</p>
          <div className="mt-4 space-y-4">
            {toolsByGroup.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-slate-800">{group.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{group.tools.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">Work Experience</p>
          <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Timeline</h2>
        </header>
        <div className="mt-4 space-y-3">
          {workTimeline.map((item) => (
            <article key={`${item.role}-${item.company}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                <BriefcaseBusiness size={15} /> {item.role}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {item.company} · {item.period}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-pink-200 bg-gradient-to-r from-pink-50 to-white p-5 sm:p-6">
        <h2 className="text-2xl font-semibold text-slate-900">Interesting right? Let&apos;s talk.</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Looking for a Design Engineer or Product Designer who ships production interfaces? Saffu can introduce
          Hamza, and Hamza can ship your next product.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="mailto:hamfulldesigns@gmail.com"
            className="rounded-2xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700"
          >
            Send an email
          </a>
          <Link
            href="/blog"
            className="rounded-2xl border border-pink-300 bg-white px-4 py-2 text-sm font-semibold text-pink-700 transition hover:border-pink-400"
          >
            Explore blog posts
          </Link>
        </div>
      </section>
    </main>
  );
}
