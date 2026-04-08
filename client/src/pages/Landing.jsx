import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Network, FileText, Zap, ArrowRight, Star, ChevronDown } from 'lucide-react';

/* ─── tiny animated counter ─── */
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = Math.ceil(target / 40);
          const id = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(id); }
            else setCount(start);
          }, 30);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─── floating shapes (decorative) ─── */
const FloatingShape = ({ className, style }) => (
  <div className={`absolute pointer-events-none ${className}`} style={style} />
);

/* ─── feature card ─── */
const FeatureCard = ({ icon: Icon, title, description, color, delay }) => (
  <div
    className="bg-white border-brutal-lg shadow-brutal p-8 relative group hover:-translate-y-2 transition-all duration-300 cursor-default"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`w-14 h-14 ${color} border-brutal flex items-center justify-center mb-5 group-hover:rotate-12 transition-transform duration-300`}>
      <Icon className="w-7 h-7 text-neo-black" strokeWidth={2.5} />
    </div>
    <h3 className="text-xl font-black uppercase mb-3">{title}</h3>
    <p className="font-medium text-gray-700 leading-relaxed">{description}</p>
  </div>
);

/* ─── testimonial card ─── */
const TestimonialCard = ({ name, role, quote }) => (
  <div className="bg-white border-brutal-lg shadow-brutal p-6 relative">
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-neo-yellow text-neo-black" />
      ))}
    </div>
    <p className="font-medium text-gray-700 mb-4 italic">"{quote}"</p>
    <div className="border-t-2 border-neo-black pt-3">
      <p className="font-black">{name}</p>
      <p className="text-sm font-medium text-gray-500">{role}</p>
    </div>
  </div>
);

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: FileText, title: 'Smart Notes', description: 'Write freely with auto-save, rich text, and intelligent tagging that organizes your thoughts as you think.', color: 'bg-neo-yellow', delay: 0 },
    { icon: Network, title: 'Knowledge Graph', description: 'Visualize connections between your ideas. Watch your knowledge network grow with every note you link.', color: 'bg-neo-blue', delay: 100 },
    { icon: Sparkles, title: 'AI Insights', description: 'Let AI surface hidden patterns, suggest connections, and generate summaries from your personal knowledge base.', color: 'bg-green-300', delay: 200 },
    { icon: Zap, title: 'Real-time Sync', description: 'Your second brain stays in sync across all your devices. Never lose a thought again, even offline.', color: 'bg-pink-300', delay: 300 },
    { icon: Brain, title: 'Backlinks', description: 'Every note knows what links to it. Build a personal wiki where context flows naturally both ways.', color: 'bg-orange-300', delay: 400 },
    { icon: Star, title: 'Pin & Prioritize', description: 'Star your most important ideas. Keep your best thinking front and center, always accessible.', color: 'bg-purple-300', delay: 500 },
  ];

  return (
    <div className="min-h-screen bg-neo-white overflow-hidden">

      {/* ━━━ NAVBAR ━━━ */}
      <nav className="fixed top-0 w-full z-50 bg-neo-white/90 backdrop-blur-sm border-b-4 border-neo-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-neo-yellow border-brutal flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Brain className="w-6 h-6 text-neo-black" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black uppercase tracking-tight">Dumb.ai</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:block px-5 py-2.5 font-bold text-neo-black hover:text-neo-blue transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="bg-neo-blue text-white border-brutal shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 transition-all px-6 py-2.5 font-bold uppercase"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ━━━ HERO ━━━ */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6">
        {/* Decorative shapes */}
        <FloatingShape
          className="w-32 h-32 bg-neo-yellow border-brutal hidden md:block"
          style={{ top: '15%', right: '8%', transform: `rotate(${12 + scrollY * 0.02}deg) translateY(${scrollY * -0.1}px)` }}
        />
        <FloatingShape
          className="w-20 h-20 bg-neo-blue border-brutal hidden md:block"
          style={{ top: '60%', left: '5%', transform: `rotate(${-8 + scrollY * 0.03}deg) translateY(${scrollY * -0.15}px)` }}
        />
        <FloatingShape
          className="w-16 h-16 bg-pink-300 border-brutal rounded-full hidden lg:block"
          style={{ top: '25%', left: '15%', transform: `translateY(${scrollY * -0.08}px)` }}
        />
        <FloatingShape
          className="w-24 h-24 bg-green-300 border-brutal hidden lg:block"
          style={{ bottom: '10%', right: '15%', transform: `rotate(${45 + scrollY * 0.01}deg) translateY(${scrollY * -0.12}px)` }}
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-block bg-neo-yellow border-brutal shadow-brutal-sm px-4 py-1.5 font-bold text-sm uppercase mb-8 animate-bounce">
            🧠 Your Second Brain, Supercharged
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter mb-8">
            Think Less.
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Remember</span>
              <span className="absolute bottom-1 left-0 w-full h-4 md:h-6 bg-neo-yellow -z-0 -rotate-1" />
            </span>
            <br />
            Everything.
          </h1>

          <p className="text-lg md:text-xl font-medium text-gray-700 max-w-2xl mx-auto mb-12 leading-relaxed">
            Dumb.ai is the neobrutalist note-taking app that connects your ideas with AI-powered insights, knowledge graphs, and real-time sync.
            <span className="font-bold text-neo-black"> Stop forgetting. Start building your brain.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group bg-neo-blue text-white border-brutal-lg shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 transition-all px-10 py-4 font-black text-xl uppercase flex items-center gap-3"
            >
              Get Started Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="bg-white text-neo-black border-brutal-lg shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 transition-all px-10 py-4 font-black text-xl uppercase"
            >
              I Have an Account
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 flex justify-center animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </section>

      {/* ━━━ MARQUEE BANNER ━━━ */}
      <div className="bg-neo-black text-white py-4 border-y-4 border-neo-black overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="flex items-center gap-8 mx-8 text-lg font-bold uppercase tracking-wider">
              <span>✦ Smart Notes</span>
              <span>✦ Knowledge Graph</span>
              <span>✦ AI Insights</span>
              <span>✦ Real-time Sync</span>
              <span>✦ Backlinks</span>
              <span>✦ Auto-save</span>
              <span>✦ Pin &amp; Prioritize</span>
            </span>
          ))}
        </div>
      </div>

      {/* ━━━ FEATURES ━━━ */}
      <section className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-green-300 border-brutal shadow-brutal-sm px-4 py-1.5 font-bold text-sm uppercase mb-6">
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Everything Your Brain Needs
            </h2>
            <p className="text-lg font-medium text-gray-600 max-w-xl mx-auto">
              Not another boring note app. This is your cognitive upgrade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="py-20 md:py-28 px-6 bg-neo-yellow border-y-4 border-neo-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Stupidly Simple
            </h2>
            <p className="text-lg font-medium text-gray-700">Three steps to a better brain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Dump It', desc: 'Write anything. Random thought? Lecture note? Research link? Just dump it in.' },
              { step: '02', title: 'Link It', desc: 'Connect related ideas with backlinks. Watch your knowledge graph come alive.' },
              { step: '03', title: 'Ask AI', desc: 'Let AI find the patterns you missed. Get summaries, suggestions, and insights.' },
            ].map((item) => (
              <div key={item.step} className="bg-white border-brutal-lg shadow-brutal p-8 relative">
                <div className="absolute -top-5 -left-3 bg-neo-black text-white border-brutal px-4 py-2 font-black text-2xl rotate-[-6deg]">
                  {item.step}
                </div>
                <h3 className="text-2xl font-black uppercase mt-4 mb-3">{item.title}</h3>
                <p className="font-medium text-gray-700 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ STATS ━━━ */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 10000, suffix: '+', label: 'Active Users' },
              { value: 500000, suffix: '+', label: 'Notes Created' },
              { value: 1200000, suffix: '+', label: 'Connections Made' },
              { value: 99, suffix: '%', label: 'Uptime' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white border-brutal-lg shadow-brutal p-6 text-center hover:-translate-y-1 transition-transform">
                <div className="text-3xl md:text-4xl font-black text-neo-blue mb-2">
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="font-bold text-sm uppercase text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ TESTIMONIALS ━━━ */}
      <section className="py-20 md:py-28 px-6 bg-neo-black text-white border-y-4 border-neo-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-neo-yellow text-neo-black border-brutal shadow-brutal-sm px-4 py-1.5 font-bold text-sm uppercase mb-6">
              Loved By Thinkers
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              Don't Take Our Word
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              name="Alex Rivera"
              role="PhD Researcher"
              quote="I went from drowning in 200+ research papers to actually seeing connections between ideas. Dumb.ai's knowledge graph is insane."
            />
            <TestimonialCard
              name="Priya Sharma"
              role="Product Manager"
              quote="The AI insights are like having a research assistant that never sleeps. It surfaces patterns I would've missed completely."
            />
            <TestimonialCard
              name="Marcus Chen"
              role="Indie Hacker"
              quote="I've tried every note app. Notion, Obsidian, Roam — Dumb.ai is the only one that actually makes me think differently."
            />
          </div>
        </div>
      </section>

      {/* ━━━ CTA ━━━ */}
      <section className="py-20 md:py-32 px-6 relative">
        <FloatingShape
          className="w-24 h-24 bg-neo-yellow border-brutal hidden md:block"
          style={{ top: '20%', left: '8%', transform: 'rotate(15deg)' }}
        />
        <FloatingShape
          className="w-16 h-16 bg-pink-300 border-brutal hidden md:block"
          style={{ bottom: '20%', right: '10%', transform: 'rotate(-10deg)' }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-6">
            Ready To Build
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">Your Brain?</span>
              <span className="absolute bottom-1 left-0 w-full h-4 md:h-5 bg-neo-blue/30 -z-0 -rotate-1" />
            </span>
          </h2>
          <p className="text-lg font-medium text-gray-700 mb-10 max-w-lg mx-auto">
            Join thousands of thinkers who stopped forgetting and started connecting their ideas.
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-3 bg-neo-blue text-white border-brutal-lg shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 transition-all px-12 py-5 font-black text-2xl uppercase"
          >
            Start For Free
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
          </Link>
          <p className="mt-4 text-sm font-medium text-gray-500">No credit card required. Free forever plan available.</p>
        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="bg-neo-black text-white border-t-4 border-neo-black py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neo-yellow border-2 border-white flex items-center justify-center">
              <Brain className="w-5 h-5 text-neo-black" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black uppercase">Dumb.ai</span>
          </div>
          <p className="text-sm font-medium text-gray-400">
            © {new Date().getFullYear()} Dumb.ai — Built for thinkers who forget.
          </p>
          <div className="flex gap-6">
            <Link to="/login" className="text-sm font-bold hover:text-neo-yellow transition-colors">Log In</Link>
            <Link to="/register" className="text-sm font-bold hover:text-neo-yellow transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>

      {/* ━━━ INLINE KEYFRAME STYLES ━━━ */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;
