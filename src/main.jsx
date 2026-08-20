import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import "./styles.css";

const pieces = [
  { no: "01", title: "A place called home", type: "Architecture", tone: "white", size: "wide" },
  { no: "02", title: "The familiar face", type: "Portrait", tone: "black", size: "tall" },
  { no: "03", title: "Objects with a past", type: "Still life", tone: "white", size: "square" },
  { no: "04", title: "Whatever matters", type: "Open commission", tone: "black", size: "wide" },
];

function Loader() {
  const [visible, setVisible] = useState(true);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const started = performance.now();
    const tick = (now) => {
      const value = Math.min(100, Math.round(((now - started) / 1150) * 100));
      setCount(value);
      if (value < 100) requestAnimationFrame(tick);
      else setTimeout(() => setVisible(false), 180);
    };
    requestAnimationFrame(tick);
  }, []);
  return <AnimatePresence>{visible && <motion.div className="loader" exit={{ y: "-100%" }} transition={{ duration: .85, ease: [.76, 0, .24, 1] }}><span>H/STUDIO</span><strong>{String(count).padStart(3, "0")}</strong><div><i style={{ width: `${count}%` }} /></div></motion.div>}</AnimatePresence>;
}

function Cursor() {
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-50), y = useMotionValue(-50);
  const sx = useSpring(x, { stiffness: 600, damping: 45 }), sy = useSpring(y, { stiffness: 600, damping: 45 });
  useEffect(() => {
    const move = (e) => { x.set(e.clientX - 14); y.set(e.clientY - 14); setVisible(true); };
    const hide = () => setVisible(false);
    window.addEventListener("pointermove", move);
    document.documentElement.addEventListener("mouseleave", hide);
    window.addEventListener("blur", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("mouseleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [x, y]);
  return <motion.div className="cursor" animate={{ opacity: visible ? 1 : 0 }} style={{ x: sx, y: sy }} />;
}

function DrawLayer() {
  const canvas = useRef(null);
  useEffect(() => {
    const el = canvas.current, ctx = el.getContext("2d");
    const resize = () => { el.width = innerWidth * devicePixelRatio; el.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); };
    let prev = null;
    const move = (e) => {
      if (e.pointerType !== "mouse") return;
      const point = [e.clientX, e.clientY];
      if (prev) { ctx.strokeStyle = "rgba(164,71,45,.34)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(...prev); ctx.lineTo(...point); ctx.stroke(); }
      prev = point;
    };
    const leave = () => { prev = null; };
    resize(); window.addEventListener("resize", resize); window.addEventListener("pointermove", move); document.addEventListener("mouseleave", leave);
    return () => { window.removeEventListener("resize", resize); window.removeEventListener("pointermove", move); document.removeEventListener("mouseleave", leave); };
  }, []);
  return <canvas className="draw-layer" ref={canvas} aria-hidden="true" />;
}

function Placeholder({ tone, label }) {
  return <div className={`placeholder ${tone}`} role="img" aria-label={`${label} image placeholder`}><span>IMAGE<br />PENDING</span><i /></div>;
}

function ContactForm() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setMessage("Sending your idea…");
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Submission failed");
      form.reset();
      setStatus("success");
      setMessage("Your idea is on its way. I’ll be in touch soon.");
    } catch {
      setStatus("error");
      setMessage("That didn’t go through. Please try again in a moment.");
    }
  };

  return <form className="contact-form" onSubmit={onSubmit}>
    <input type="hidden" name="access_key" value="6bdb41ff-fdbf-4211-876e-3253ee4ed255" />
    <input type="hidden" name="subject" value="New H Studio commission enquiry" />
    <input type="hidden" name="from_name" value="H Studio website" />
    <input className="botcheck" type="checkbox" name="botcheck" tabIndex="-1" autoComplete="off" />
    <label><span>01 / Your name</span><input type="text" name="name" placeholder="HOW SHOULD I ADDRESS YOU?" required autoComplete="name" /></label>
    <label><span>02 / Your email</span><input type="email" name="email" placeholder="WHERE CAN I REACH YOU?" required autoComplete="email" /></label>
    <label><span>03 / What are we drawing?</span><select name="commission_type" defaultValue="" required><option value="" disabled>CHOOSE, IF YOU KNOW</option><option>Architecture or home</option><option>Person or portrait</option><option>Object or keepsake</option><option>Pet</option><option>Something else</option></select></label>
    <label className="message-field"><span>04 / The idea</span><textarea name="message" placeholder="TELL ME WHAT MATTERS ABOUT IT…" required rows="3" /></label>
    <div className="form-action"><button type="submit" disabled={status === "sending"}>{status === "sending" ? "SENDING…" : "SEND THE IDEA"} <span>↗</span></button><p className={`form-status ${status}`} role="status" aria-live="polite">{message}</p></div>
  </form>;
}

function Gallery() {
  const section = useRef(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-390vw"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -4]);
  return <section className="gallery" id="work" ref={section}>
    <div className="gallery-sticky">
      <div className="gallery-head"><span>Selected matter</span><span>Scroll to move →</span><span>01—04</span></div>
      <motion.div className="gallery-track" style={{ x }}>
        {pieces.map((piece, i) => <article className="piece" key={piece.no}>
          <div className="piece-copy"><span>({piece.no})</span><h2>{piece.title}</h2><p>{piece.type}</p></div>
          <motion.div className={`piece-image ${piece.size}`} style={{ rotate: i % 2 ? rotate : 0 }}><Placeholder tone={piece.tone} label={piece.title} /></motion.div>
        </article>)}
        <article className="piece gallery-end"><p>Have something else<br />in mind?</p><a href="#contact">Let’s draw it <span>↗</span></a></article>
      </motion.div>
      <motion.div className="gallery-progress" style={{ scaleX: scrollYProgress }} />
    </div>
  </section>;
}

function App() {
  const [menu, setMenu] = useState(false);
  const hero = useRef(null);
  const { scrollYProgress } = useScroll({ target: hero, offset: ["start start", "end start"] });
  const wordX = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const wordX2 = useTransform(scrollYProgress, [0, 1], ["-8%", "12%"]);
  const blockScale = useTransform(scrollYProgress, [0, .8], [1, .58]);
  const blockRotate = useTransform(scrollYProgress, [0, .8], [0, 7]);

  return <>
    <Loader /><Cursor /><DrawLayer />
    <header className="site-head">
      <a href="#top" className="brand">H<span>/</span>STUDIO</a>
      <p>Drawings of people,<br />places & everything between</p>
      <a href="#contact" className="head-link">Start a commission ↗</a>
      <button onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Open menu">{menu ? "CLOSE" : "MENU"}</button>
    </header>
    <AnimatePresence>{menu && <motion.nav className="menu" initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: .7, ease: [.76,0,.24,1] }}>
      {[['WORK','work'],['APPROACH','approach'],['STUDIO','studio'],['CONTACT','contact']].map(([label,id], i) => <a href={`#${id}`} onClick={() => setMenu(false)} key={id}><span>0{i+1}</span>{label}</a>)}
    </motion.nav>}</AnimatePresence>

    <main>
      <section className="new-hero" id="top" ref={hero}>
        <div className="hero-index"><span>( EST. NOW )</span><span>DRAWN BY HAND</span></div>
        <motion.div className="hero-line one" style={{ x: wordX }}>DRAW WHAT</motion.div>
        <motion.div className="hero-line two" style={{ x: wordX2 }}>MATTERS.</motion.div>
        <motion.div className="hero-block" style={{ scale: blockScale, rotate: blockRotate }}><Placeholder tone="black" label="Featured commissioned drawing" /></motion.div>
        <p className="hero-note">A person. A home. An object with a story.<br />If it matters to you, it is worth drawing.</p>
        <div className="scroll-note">KEEP<br />SCROLLING <span>↓</span></div>
      </section>

      <section className="statement" id="approach">
        <p className="vertical-note">THE H/STUDIO APPROACH — 2026</p>
        <motion.p initial={{ opacity:.18 }} whileInView={{ opacity:1 }} viewport={{ amount:.7 }} transition={{ duration:1.2 }}>Not decoration.<br />Not content.<br /><em>A mark of attention.</em></motion.p>
        <div className="statement-foot"><span>Made slowly</span><span>Kept for years</span><span>One of one</span></div>
      </section>

      <Gallery />

      <section className="types">
        <div className="ticker"><div>HOMES · PORTRAITS · PLACES · PETS · OBJECTS · IDEAS · </div><div>HOMES · PORTRAITS · PLACES · PETS · OBJECTS · IDEAS · </div></div>
        <div className="types-intro"><span>( NO WRONG SUBJECT )</span><h2>Commission<br /><i>anything.</i></h2><p>Some ideas fit a category. The best ones often don’t. Bring a photograph, a memory, a building, a beloved thing—or just the beginning of an idea.</p></div>
        <div className="type-list">
          {['Architecture & homes','People & portraits','Objects & keepsakes','Something entirely yours'].map((item,i) => <a href="#contact" key={item}><span>0{i+1}</span><strong>{item}</strong><i>↗</i></a>)}
        </div>
      </section>

      <section className="studio" id="studio">
        <div className="studio-image"><Placeholder tone="white" label="Studio process" /><span>THE WORK IN PROGRESS</span></div>
        <div className="studio-copy"><span>( WHY DRAW? )</span><h2>Because the hand sees differently.</h2><p>A drawing edits out the noise. It keeps the crooked window, the particular expression, the thing you noticed without knowing you noticed it.</p><p>Every commission is built through looking, reducing, and making marks until what matters is all that remains.</p></div>
        <div className="process-ring"><span>01 TALK</span><span>02 CHOOSE</span><span>03 DRAW</span><span>04 DELIVER</span></div>
      </section>

      <section className="contact-new" id="contact">
        <div className="contact-top"><span>( OPEN FOR COMMISSIONS )</span><span>REPLY WITHIN 2 DAYS</span></div>
        <h2>Let’s make<br />something <i>real.</i></h2>
        <ContactForm />
        <div className="contact-bottom"><span>H/STUDIO © {new Date().getFullYear()}</span><span>INSTAGRAM</span><span>MADE BY HAND / BUILT FOR THE WEB</span></div>
      </section>
    </main>
  </>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
