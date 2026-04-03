import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Scale, BrainCircuit, ShieldCheck, Code2,
  ArrowRight, GitFork, BookOpen, ExternalLink
} from 'lucide-react';

const FADE_UP = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
  })
};

const STATS = [
  { label: 'Total Disputes Handled', value: 'Live' },
  { label: 'Active Validators', value: '5+' },
  { label: 'Resolution Time', value: '<2s' },
];

const FEATURES = [
  {
    icon: <BrainCircuit size={18} color="#007bff" />,
    title: 'AI Arbiters',
    desc: 'LLM validators analyze evidence and agreements with zero human bias — every verdict is derived purely from data.'
  },
  {
    icon: <Code2 size={18} color="#007bff" />,
    title: 'GenVM Native',
    desc: 'Python-based Intelligent Contracts can access live internet data natively, no external oracles required.'
  },
  {
    icon: <ShieldCheck size={18} color="#007bff" />,
    title: 'Optimistic Democracy',
    desc: 'Multiple validator nodes reach consensus independently. A verdict only finalizes when the network agrees.'
  },
];

const STEPS = [
  { num: '01', title: 'Submit Dispute', desc: 'User submits the original agreement and supporting evidence via the DApp.' },
  { num: '02', title: 'Contract Processing', desc: 'The Intelligent Contract embeds data into LLM prompts and forwards to the validator network.' },
  { num: '03', title: 'Network Consensus', desc: 'Multiple GenVM validators independently execute inference and apply Equivalence Principles.' },
  { num: '04', title: 'Verdict Finalized', desc: 'On consensus, the contract auto-executes the verdict: PAY_FREELANCER, APPROVED, SAFE, etc.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <nav className="navbar">
        <button className="navbar-logo" onClick={() => navigate('/')}>
          <Scale size={17} color="#007bff" strokeWidth={2.5} />
          GenResolve
        </button>

        <div className="navbar-nav">
          {['Freelance', 'Prediction', 'DAO Grants', 'Moderation'].map(item => (
            <button key={item} className="nav-link" onClick={() => navigate('/app')}>
              {item}
            </button>
          ))}
        </div>

        <div className="navbar-right">
          <span className="badge">
            <span className="live-dot" />
            Bradbury Testnet
          </span>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/app')}>
            Launch DApp
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ borderBottom: '1px solid #e4e4e4' }}>
        <div className="page-wrap" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
          >
            <motion.div variants={FADE_UP} custom={0} style={{
              fontSize: '0.6875rem', fontWeight: 700, color: '#007bff',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem'
            }}>
              GenLayer Bradbury Hackathon — 2025
            </motion.div>

            <motion.h1 variants={FADE_UP} custom={1} style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
              fontWeight: 800,
              color: '#000',
              letterSpacing: '-0.04em',
              lineHeight: 1.05,
              maxWidth: '680px',
              marginBottom: '1.25rem'
            }}>
              AI Arbitration<br />on GenLayer.
            </motion.h1>

            <motion.p variants={FADE_UP} custom={2} style={{
              fontSize: '1.0625rem', color: '#555',
              maxWidth: '520px', lineHeight: 1.65, marginBottom: '2.5rem'
            }}>
              Trustless dispute resolution powered by LLM validators on the GenLayer network.
              Objective, verifiable, and fully on-chain.
            </motion.p>

            <motion.div variants={FADE_UP} custom={3} style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/app')}>
                Launch DApp <ArrowRight size={15} />
              </button>
              <a href="https://github.com/yoiioy700/genresolve" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <button className="btn btn-secondary btn-lg">
                  <GitFork size={15} /> GitHub
                </button>
              </a>
            </motion.div>

            {/* STATS ROW */}
            <motion.div variants={FADE_UP} custom={4} style={{
              display: 'flex',
              borderTop: '1px solid #e4e4e4',
              paddingTop: '2.5rem',
              maxWidth: '580px'
            }}>
              {STATS.map((s, i) => (
                <div key={i} style={{
                  flex: 1,
                  paddingRight: i < 2 ? '2rem' : 0,
                  paddingLeft: i > 0 ? '2rem' : 0,
                  borderRight: i < 2 ? '1px solid #e4e4e4' : 'none',
                }}>
                  <div className="stat-lbl">{s.label}</div>
                  <div className="stat-val">{s.value}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ borderBottom: '1px solid #e4e4e4' }}>
        <div className="page-wrap" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              fontSize: '0.6875rem', fontWeight: 700, color: '#999',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem'
            }}>
              How it works
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#000', letterSpacing: '-0.025em' }}>
              Built on Intelligent Contracts
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1px',
            background: '#e4e4e4',
            border: '1px solid #e4e4e4',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                style={{ background: '#fff', padding: '2rem' }}
              >
                <div style={{
                  width: 36, height: 36,
                  background: '#f0f0f0',
                  borderRadius: '7px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.125rem'
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#000', marginBottom: '0.5rem' }}>
                  {f.title}
                </h3>
                <p style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.65 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section style={{ borderBottom: '1px solid #e4e4e4' }}>
        <div className="page-wrap" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              fontSize: '0.6875rem', fontWeight: 700, color: '#999',
              textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem'
            }}>
              Lifecycle
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#000', letterSpacing: '-0.025em' }}>
              Arbitration in four steps
            </h2>
          </div>

          <div style={{ maxWidth: '680px' }}>
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.28, delay: i * 0.05 }}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  padding: '1.375rem 0',
                  borderBottom: i < STEPS.length - 1 ? '1px solid #ebebeb' : 'none'
                }}
              >
                <div style={{
                  fontWeight: 800, fontSize: '0.6875rem',
                  color: '#c8c8c8', letterSpacing: '0.06em',
                  minWidth: '1.75rem', paddingTop: '0.2rem', flexShrink: 0
                }}>
                  {step.num}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#000', marginBottom: '0.25rem' }}>
                    {step.title}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.65 }}>{step.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: '#000', padding: '4rem 0' }}>
        <div className="page-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.375rem' }}>
              Try GenResolve on Bradbury Testnet.
            </h2>
            <p style={{ color: '#888', fontSize: '0.9375rem' }}>
              Connect MetaMask and submit your first dispute in under a minute.
            </p>
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/app')}
            style={{ flexShrink: 0 }}
          >
            Open DApp <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#fafafa', borderTop: '1px solid #e4e4e4', padding: '2rem 0' }}>
        <div className="page-wrap" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.875rem', color: '#000' }}>
            <Scale size={14} color="#007bff" strokeWidth={2.5} />
            GenResolve
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { href: 'https://github.com/yoiioy700/genresolve', icon: <GitFork size={13} />, label: 'GitHub' },
              { href: 'https://dorahacks.io/hackathon/genlayer-bradbury/detail', icon: <ExternalLink size={13} />, label: 'DoraHacks' },
              { href: 'https://docs.genlayer.com', icon: <BookOpen size={13} />, label: 'Docs' },
            ].map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" style={{
                color: '#888', textDecoration: 'none', fontSize: '0.8125rem',
                display: 'flex', alignItems: 'center', gap: '0.35rem'
              }}>
                {link.icon} {link.label}
              </a>
            ))}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#bbb' }}>
            GenLayer Bradbury Hackathon · 2025
          </div>
        </div>
      </footer>
    </div>
  );
}
