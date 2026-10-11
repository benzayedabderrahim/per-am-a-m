// src/BirthdayPage.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./InteractivePresentation.css";

/* ---------- Config ---------- */
const SONG_SRC = "/assets/perfect.mp3"; // => public/assets/song.mp3
const BIRTHDAY_LABEL = "Oct · 20 · 2026"; // change if needed
const INTRO_MS = 4000; // intro text visible for 4 seconds

/* ---------- Floating decorations around the hero ---------- */
const DECOS = [
  { e: "🎈", x: 6, y: 7, s: 1, d: 0 },
  { e: "🎈", x: 88, y: 12, s: 1, d: 1.2 },
  { e: "🍰", x: 13, y: 33, s: 0.9, d: 0.6 },
  { e: "✨", x: 4, y: 46, s: 1, d: 1.8 },
  { e: "🎀", x: 66, y: 22, s: 0.95, d: 0.3 },
  { e: "🌸", x: 74, y: 53, s: 0.95, d: 2.1 },
  { e: "⭐", x: 91, y: 59, s: 1, d: 0.9 },
  { e: "🎁", x: 84, y: 74, s: 1, d: 1.5 },
  { e: "🎉", x: 8, y: 79, s: 1, d: 2.4 },
];

/* ---------- Messages (in order) ---------- */
const SECTIONS = [
  {
    title: "Happy Birthday, My Favorite Person ❤️🎂",
    sticker: "💌",
    lines: [
      "Today is all about you, the beautiful soul who made an ordinary part of my life feel extraordinary.",
      "Who would have thought that a simple message like “Khir men blech” would become the beginning of so many conversations, laughs, memories, and feelings?",
      "I never knew that such a small beginning could lead to someone becoming so important to me.",
      "And now, here we are... celebrating you, and I'm grateful that our story began exactly the way it did. ❤️🫰",
    ],
  },
  {
    title: "You Became Someone Special",
    sticker: "💜",
    lines: [
      "Some people enter our lives and leave us with memories. Others become part of the way we see life itself.",
      "You became someone I can talk to without pretending, someone I can share my thoughts with, and someone whose presence makes even an ordinary day feel a little brighter.",
      "With you, I've discovered the beauty of being understood, supported, and appreciated.",
      "And if there's one thing I want you to know today, it's that you mean much more to me than I could ever fully explain in words. ❤️🫰",
    ],
  },
  {
    title: "Thank You for Being Part of My Life",
    sticker: "🫶",
    lines: [
      "Thank you for listening to me, believing in me, encouraging me, and reminding me that I can keep going even when things feel difficult.",
      "Thank you for every little conversation, every laugh, every kind word, and every moment when you made me smile without even realizing it.",
      "You may not always notice the effect you have on me, but your kindness and support have made a real difference in my life.",
      "I hope I can give you the same comfort, encouragement, and happiness that you've given me.",
      "Because you deserve to feel just as loved and appreciated as you make me feel. ❤️🫰",
    ],
  },
  {
    title: "Little Moments, Precious Memories",
    sticker: "🌷",
    lines: [
      "It's funny how the smallest moments sometimes become the ones we treasure the most.",
      "Our conversations, our silly jokes, our few meetings , the stories we share, the moments we encourage each other, and the memories we've already collected together...",
      "They might seem ordinary to someone else, but to me, they have their own special meaning.",
      "And the best part is that our story is still being written.",
      "There are still so many places to discover, things to celebrate, dreams to achieve, and beautiful memories waiting for us.",
      "I can't wait to look back one day and smile at everything we've lived together. ❤️🫰",
    ],
  },
  {
    title: "What I Hope You Always Remember",
    sticker: "🤍",
    lines: [
      "I cannot promise that every day will be perfect, or that life will always go exactly as we imagine.",
      "But I hope to always treat your heart with kindness, listen when you need someone, celebrate your successes, and encourage you when things get difficult.",
      "I want us to keep growing, learning, and becoming better people while supporting each other's dreams.",
      "I want you to feel free to be yourself around me, to laugh without holding back, and to know that your happiness matters to me.",
      "And whenever life gives us difficult days, I hope we remember the same thing: we're two people who care deeply about each other and want to see each other happy. ❤️🫰",
    ],
  },
  {
    title: "Inchallah, There's More Ahead of Us",
    sticker: "✨",
    lines: [
      "When I think about the future, I think about the dreams we each carry, the goals we want to achieve, and the people we hope to become.",
      "I hope to see you succeed in everything you work hard for. I hope to celebrate your achievements, watch you accomplish your dreams, and remind you how proud you should be of yourself.",
      "And if God wills it, I hope that one day we will look back at these little beginnings from a beautiful place we built together.",
      "Perhaps we'll smile at these messages, laugh at our old conversations, and realize that the little moments we cherished became part of something even more beautiful.",
      "Until then, let's keep moving forward, one day and one memory at a time. ❤️🫰",
    ],
  },
  {
    title: "On Your Special Day",
    sticker: "🎁",
    lines: [
      "Today, I don't just wish you a happy birthday.",
      "I wish you peaceful mornings, nights filled with comfort, success that makes you proud, friends who genuinely care about you, and countless reasons to smile.",
      "I wish you strength for the difficult days, confidence when you doubt yourself, and happiness in the little things you sometimes overlook.",
      "May God protect you, bless your years, guide your steps, and grant you everything that is good for your heart and your future.",
      "And may this new chapter of your life bring you closer to every dream you've been working toward.",
      "You deserve beautiful things, and I sincerely hope this year brings you many of them. ❤️🫰",
    ],
  },
  {
    title: "One Last Thing, My Love ❤️",
    sticker: "💜",
    emphasisFrom: 5,
    lines: [
      "If I could choose one thing to remind you of today, it would be this:",
      "Out of all the unexpected things that happened in my life, meeting you and getting to know you has become one of my favorite stories.",
      "I love the person you are, the way you express yourself, the little details that make you unique, and the beautiful memories we've created together.",
      "I don't know every detail of what tomorrow holds, but I know that I want to keep working toward a beautiful future, supporting your dreams while pursuing mine, and making more memories with you along the way.",
      "And if God writes that future for us, I hope that one day we'll celebrate your birthday together, not just through messages on a screen, but side by side, grateful for the journey that brought us there.",
      "Happy Birthday, my favorite person.",
      "Thank you for being you. Thank you for choosing me, too.",
      "And if I had to go back to that very first message and live our story all over again, I'd still be happy to discover you, one conversation at a time.",
      "I love you. ❤️🫰",
    ],
  },
];

const TONES = ["pink", "yellow", "lilac", "mint"];

/* ---------- One message card, revealed when scrolled into view ---------- */
function MessageCard({ section, index }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tone = TONES[index % TONES.length];
  const tilt = index % 2 === 0 ? "tilt-a" : "tilt-b";
  const lastIdx = section.lines.length - 1;
  const isLastSection = index === SECTIONS.length - 1;

  return (
    <article
      ref={ref}
      className={`card tone-${tone} ${tilt} ${seen ? "is-seen" : ""}`}
    >
      <span className="card__sticker" aria-hidden="true">
        {section.sticker}
      </span>
      <h2 className="card__title reveal" style={{ "--i": 0 }}>
        {section.title}
      </h2>
      {section.lines.map((line, i) => {
        const emph = section.emphasisFrom !== undefined && i >= section.emphasisFrom;
        const final = isLastSection && i === lastIdx;
        return (
          <p
            key={i}
            className={`card__line reveal ${emph ? "is-emph" : ""} ${final ? "is-final" : ""}`}
            style={{ "--i": Math.min(i + 1, 9) }}
          >
            {line}
          </p>
        );
      })}
    </article>
  );
}

/* ---------- Page ---------- */
export default function BirthdayPage() {
  const [introFading, setIntroFading] = useState(false);
  const [introGone, setIntroGone] = useState(false);


  const audioRef = useRef(null);
  const userPaused = useRef(false);
  const wasPlayingBeforeHide = useRef(false);

  /* Intro: 4 seconds, then fade out */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    const t1 = setTimeout(() => setIntroFading(true), INTRO_MS);
    const t2 = setTimeout(() => setIntroGone(true), INTRO_MS + 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  /* Lock scrolling while the intro is on screen */
  useEffect(() => {
    if (introGone) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [introGone]);

  /* Background music: try autoplay, otherwise start on first interaction */
  const tryPlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return Promise.resolve(false);
    return a.play().then(
      () => true,
      () => false
    );
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.6;


    const events = ["pointerdown", "pointerup", "touchstart", "touchend", "click", "keydown", "wheel", "scroll"];
    const remove = () => events.forEach((ev) => window.removeEventListener(ev, unlock));
    function unlock() {
      if (userPaused.current) return;
      tryPlay().then((ok) => ok && remove());
    }

    tryPlay().then((ok) => {
      if (!ok) events.forEach((ev) => window.addEventListener(ev, unlock, { passive: true }));
    });

    return () => {
      remove();
    };
  }, [tryPlay]);

  /* Pause when the tab/app is hidden, resume when back */
  useEffect(() => {
    const onVisibility = () => {
      const a = audioRef.current;
      if (!a) return;
      if (document.hidden) {
        wasPlayingBeforeHide.current = !a.paused;
        a.pause();
      } else if (wasPlayingBeforeHide.current && !userPaused.current) {
        a.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <div className={`amal-page ${introFading ? "is-ready" : ""}`}>
      <div className="bg" aria-hidden="true" />

      {/* Intro message (4s) */}
      {!introGone && (
        <div className={`intro ${introFading ? "intro--out" : ""}`} role="status">
          <p className="intro__text" dir="rtl" lang="ar">
            قبل كل شيء ... راهو لازمك تسكرولي لوطة 🙂🤣
          </p>
        </div>
      )}

      {/* Hero */}
      <header className="hero">
        {DECOS.map((d, i) => (
          <span
            key={i}
            className="deco"
            aria-hidden="true"
            style={{ left: `${d.x}%`, top: `${d.y}%`, "--s": d.s, "--d": `${d.d}s` }}
          >
            {d.e}
          </span>
        ))}

        <div className="hero__cake" aria-hidden="true">🎂</div>

        <h1 className="hero__title">
          <span style={{ "--k": 0 }}>Happy</span>
          <span style={{ "--k": 1 }}>Birthday</span>
          <span style={{ "--k": 2 }}>my love</span>
        </h1>

        <p className="hero__sub">
          i didn't know what to get u this year ~<br />
          so i built u this whole website 💕
        </p>

        <ul className="tags">
          <li className="tag tag--white">★ for amal, only ★</li>
          <li className="tag tag--yellow">{BIRTHDAY_LABEL}</li>
          <li className="tag tag--lilac">priority: my purple 💜</li>
        </ul>

        <p className="hero__scroll">scroll for the good stuff ↓</p>
      </header>

      {/* Messages, one after the other */}
      <main className="messages">
        {SECTIONS.map((s, i) => (
          <MessageCard key={s.title} section={s} index={i} />
        ))}
      </main>

      <footer className="foot">made with 💜 for my purple</footer>

      {/* Bear sticker */}
      <div className="bear" aria-hidden="true">🧸</div>

    

      <audio ref={audioRef} src={SONG_SRC} loop preload="auto" />
    </div>
  );
}