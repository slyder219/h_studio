import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "motion/react";
import "./styles.css";

const works = [
  { title: "Quiet Fire", medium: "Charcoal + sanguine", year: "2026", className: "crop-a", tone: "white" },
  { title: "In Between", medium: "Graphite study", year: "2026", className: "crop-b", tone: "black" },
  { title: "After the Rain", medium: "Charcoal on cotton", year: "2025", className: "crop-c", tone: "white" },
];
const faqs = [
  ["What makes a good reference photo?", "Natural light, visible eyes, and a photo that feels like the person. It does not need to be professionally taken—we will help you choose from a few favorites."],
  ["Can you combine several photos?", "Yes. Expressions, clothing, and meaningful details can be thoughtfully combined into one coherent portrait."],
  ["How long does a commission take?", "Most portraits take three to five weeks after your reference is approved. Rush commissions may be possible."],
  ["Do you ship internationally?", "Yes. Finished work is sealed, carefully wrapped, and shipped flat with tracking and care instructions."],
];

function Reveal({ children, className = "", delay = 0 }) {
  return <motion.div className={className} initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: .75, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}

function PhotoPlaceholder({ tone = "white", label = "Artwork image placeholder" }) {
  return <div className={`photo-placeholder ${tone}`} role="img" aria-label={label} />;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);
  const [stage, setStage] = useState(68);
  const [quote, setQuote] = useState(0);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 24 });
  const heroY = useTransform(scrollYProgress, [0, .25], [0, 110]);
  const imageY = useTransform(scrollYProgress, [0, .3], [0, -60]);

  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return <>
    <motion.div className="progress" style={{ scaleX: progress }} />
    <header>
      <a className="wordmark" href="#top">H<span>/</span>STUDIO</a>
      <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#process">Process</a><a href="#about">About</a></nav>
      <a className="nav-cta" href="#contact">Commission a portrait</a>
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle menu"><span /><span /></button>
    </header>
    <AnimatePresence>{menuOpen && <motion.div className="mobile-menu" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }} transition={{ duration: .5 }}>
      {[["Work","work"],["Process","process"],["About","about"],["Commission","contact"]].map(([label,id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
    </motion.div>}</AnimatePresence>

    <main>
      <section className="hero" id="top">
        <motion.div className="hero-copy" style={{ y: heroY }}>
          <motion.p className="kicker" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2 }}>Portraits, drawn slowly</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [.22, 1, .36, 1] }}>More than<br />a likeness.<br /><em>A presence.</em></motion.h1>
          <motion.div className="hero-bottom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65 }}><p>Expressive, hand-drawn portraits that hold onto what a photograph can only glimpse.</p><a className="text-link" href="#work">Explore the work <span>↘</span></a></motion.div>
        </motion.div>
        <motion.figure className="hero-art" style={{ y: imageY }} initial={{ opacity: 0, rotate: 3, scale: .94 }} animate={{ opacity: 1, rotate: -1.5, scale: 1 }} transition={{ duration: 1.15, delay: .15 }}><PhotoPlaceholder tone="black" label="Featured artwork image placeholder" /><figcaption><span>Study no. 14</span><span>Charcoal / Sanguine</span></figcaption></motion.figure>
        <div className="hero-mark" aria-hidden="true">H</div>
      </section>

      <section className="manifesto"><Reveal><p className="section-label">The idea</p></Reveal><Reveal><h2>A portrait should feel like <em>meeting someone</em>—not merely seeing them.</h2></Reveal><Reveal className="manifesto-note"><span>01</span><p>Every piece begins with conversation, grows through observation, and ends when the paper starts to breathe.</p></Reveal></section>

      <section className="work" id="work">
        <div className="section-heading"><Reveal><p className="section-label">Selected portraits</p></Reveal><Reveal><h2>Recent work</h2></Reveal><Reveal><p>Original portraits made one mark at a time. Hover to look a little closer.</p></Reveal></div>
        <div className="work-grid">{works.map((item, index) => <motion.article className={`work-card ${item.className}`} key={item.title} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .1, duration: .8 }}><div className="work-image"><PhotoPlaceholder tone={item.tone} label={`${item.title} artwork image placeholder`} /></div><div className="work-meta"><div><h3>{item.title}</h3><p>{item.medium}</p></div><span>{item.year}</span></div></motion.article>)}</div>
      </section>

      <section className="process" id="process">
        <div className="process-copy"><Reveal><p className="section-label light">From first line to last</p><h2>Watch the portrait <em>find its voice.</em></h2><p>A finished drawing is built in layers: structure, gesture, shadow, then the tiny marks that make a face feel alive.</p></Reveal><div className="steps">{[['01','Share your story'],['02','Choose the photograph'],['03','Follow the drawing'],['04','Receive the original']].map(([n, label]) => <div className="step" key={n}><span>{n}</span><p>{label}</p></div>)}</div></div>
        <Reveal className="stage-wrap"><div className="stage" style={{ "--stage": `${stage}%` }}><PhotoPlaceholder tone="black" label="Finished artwork image placeholder" /><div className="under-drawing"><PhotoPlaceholder tone="white" label="Early drawing image placeholder" /></div><div className="stage-line"><span /></div></div><div className="stage-controls"><span>First marks</span><input aria-label="Reveal drawing progress" type="range" min="8" max="92" value={stage} onChange={(e) => setStage(e.target.value)} /><span>Final detail</span></div></Reveal>
      </section>

      <section className="commissions">
        <Reveal className="section-heading centered"><p className="section-label">Made for your walls</p><h2>Commission options</h2><p>Each portrait is an original, signed artwork on archival cotton paper.</p></Reveal>
        <div className="packages">{[{name:'The Study', size:'9 × 12 in', price:'From $280', detail:'An intimate head-and-shoulders drawing in graphite.'},{name:'The Portrait', size:'12 × 16 in', price:'From $480', detail:'Our signature charcoal and sanguine portrait.', featured:true},{name:'The Story', size:'18 × 24 in', price:'From $760', detail:'A larger composition with hands or meaningful details.'}].map((item) => <Reveal className={`package ${item.featured ? 'featured' : ''}`} key={item.name}><span className="package-size">{item.size}</span><h3>{item.name}</h3><p>{item.detail}</p><div><strong>{item.price}</strong><a href="#contact" aria-label={`Enquire about ${item.name}`}>↗</a></div></Reveal>)}</div>
        <p className="package-note">Couples, family groups, and pet portraits are quoted individually.</p>
      </section>

      <section className="about" id="about"><div className="about-art"><PhotoPlaceholder tone="white" label="Artist studio image placeholder" /></div><Reveal className="about-copy"><p className="section-label">Behind the pencil</p><h2>Hello, I’m <em>H.</em></h2><p className="lead">I draw people because faces never stop being interesting.</p><p>My practice sits somewhere between careful observation and expressive mark-making. I’m not trying to reproduce a photograph. I’m looking for the tilt of a smile, a familiar stillness, the small things that make someone unmistakably themselves.</p><p className="signature">H.</p></Reveal></section>

      <section className="testimonials"><p className="section-label">Kind words</p><div className="quote-wrap"><AnimatePresence mode="wait"><motion.blockquote key={quote} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>“{['You caught the exact expression my dad makes when he is trying not to laugh. The whole family went quiet when we opened it.','It feels less like a drawing of her and more like having her in the room. That is a remarkable gift.','Every detail—from choosing the photograph to opening the package—felt personal, calm, and deeply considered.'][quote]}”</motion.blockquote></AnimatePresence><div className="quote-footer"><span>{['— Clara, New York','— Michael, London','— Jo, Toronto'][quote]}</span><div>{[0,1,2].map(i => <button key={i} onClick={() => setQuote(i)} className={quote === i ? 'active' : ''} aria-label={`Show testimonial ${i+1}`} />)}</div></div></div></section>

      <section className="faq"><Reveal><p className="section-label">Good to know</p><h2>A few questions,<br /><em>answered.</em></h2></Reveal><div className="faq-list">{faqs.map(([question, answer], i) => <div className={`faq-item ${activeFaq === i ? 'open' : ''}`} key={question}><button onClick={() => setActiveFaq(activeFaq === i ? -1 : i)} aria-expanded={activeFaq === i}><span>{question}</span><i>{activeFaq === i ? '−' : '+'}</i></button><AnimatePresence initial={false}>{activeFaq === i && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}><p>{answer}</p></motion.div>}</AnimatePresence></div>)}</div></section>

      <section className="contact" id="contact"><div className="contact-orbit" aria-hidden="true"><span>YOUR STORY · DRAWN BY HAND · YOUR STORY · DRAWN BY HAND ·</span></div><Reveal><p className="section-label light">Begin a portrait</p><h2>Someone worth<br /><em>remembering?</em></h2><p>Tell me who you have in mind. I’ll reply personally within two working days.</p><a className="contact-link" href="mailto:hello@example.com?subject=Portrait%20commission">hello@example.com <span>↗</span></a></Reveal></section>
    </main>
    <footer><a className="wordmark" href="#top">H<span>/</span>STUDIO</a><p>Portraits with presence.<br />Drawn by hand, made to last.</p><div><a href="#">Instagram</a><a href="mailto:hello@example.com">Email</a></div><span>© {new Date().getFullYear()} H Studio</span></footer>
  </>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
