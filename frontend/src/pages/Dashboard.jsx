import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Scale, Briefcase, BarChart2, Building2, MessageSquareWarning,
  Wallet, Plus, CheckCircle2, XCircle, Info, RefreshCw, Zap, Shield, ChevronDown
} from 'lucide-react';
import { getGenLayerClient, GEN_RESOLVE_ADDRESS, BRADBURY_CHAIN } from '../lib/genlayer';
import { useNavigate } from 'react-router-dom';

const TABS = [
  {
    id: 'freelance',
    label: 'Freelance Dispute',
    icon: <Briefcase size={14} />,
    title: 'Freelance Dispute Resolution',
    description: 'Compares the initial agreement against submitted work evidence to determine if delivery meets contractual obligations.',
    method: 'resolve_freelance_dispute',
    inputs: [
      { id: 'arg1', label: 'Initial Agreement / Scope', placeholder: 'e.g., Deliver a React dashboard with 3 pages by Friday.' },
      { id: 'arg2', label: 'Submitted Work Evidence', placeholder: 'e.g., I built 2 pages but encountered API issues. Sent via zip.' }
    ],
    positiveVerdict: 'PAY_FREELANCER'
  },
  {
    id: 'prediction',
    label: 'Prediction Market',
    icon: <BarChart2 size={14} />,
    title: 'Prediction Market Verification',
    description: 'The AI acts as a neutral fact-checker to determine the factual outcome of a real-world event or claim.',
    method: 'resolve_prediction_market',
    inputs: [
      { id: 'arg1', label: 'Market Question / Statement', placeholder: 'e.g., Did SpaceX successfully land Starship on March 14, 2024?' }
    ],
    positiveVerdict: 'YES'
  },
  {
    id: 'dao',
    label: 'DAO Grants',
    icon: <Building2 size={14} />,
    title: 'DAO Grant Evaluation',
    description: 'Evaluates grantee progress against the DAO manifesto to determine if milestone criteria have been satisfied.',
    method: 'evaluate_dao_grant',
    inputs: [
      { id: 'arg1', label: 'DAO Manifesto / Goals', placeholder: 'e.g., Build a decentralized identity protocol.' },
      { id: 'arg2', label: 'Grantee Progress Report', placeholder: 'e.g., Shipped v1 core contracts to testnet.' }
    ],
    positiveVerdict: 'APPROVED'
  },
  {
    id: 'content',
    label: 'Content Moderation',
    icon: <MessageSquareWarning size={14} />,
    title: 'Community Content Moderation',
    description: 'Evaluates user-generated content against decentralized platform safety standards for compliance.',
    method: 'moderate_content',
    inputs: [
      { id: 'arg1', label: 'Post Content', placeholder: 'e.g., This is a normal, friendly community discussion.' }
    ],
    positiveVerdict: 'SAFE'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [disputeCount, setDisputeCount] = useState('—');
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [formData, setFormData] = useState({ arg1: '', arg2: '' });
  const [isArbitrating, setIsArbitrating] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const client = getGenLayerClient();
        const count = await client.readContract({
          address: GEN_RESOLVE_ADDRESS,
          functionName: 'get_dispute_count',
          args: [],
        });
        setDisputeCount(Number(count).toString());
      } catch (err) {
        console.error('Failed to read testnet data', err);
        setDisputeCount('—');
      }
    }
    fetchStats();

    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(res => { if (res.length > 0) setAccount(res[0]); })
        .catch(console.error);
    }

    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFormData({ arg1: '', arg2: '' });
    setVerdict(null);
  }, [activeTab]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        console.error('MetaMask error', err);
      }
    } else {
      alert('Please install MetaMask to interact with GenLayer.');
    }
  };

  const addNetwork = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${BRADBURY_CHAIN.id.toString(16)}`,
          chainName: BRADBURY_CHAIN.name,
          nativeCurrency: BRADBURY_CHAIN.nativeCurrency,
          rpcUrls: BRADBURY_CHAIN.rpcUrls.default.http,
          blockExplorerUrls: [BRADBURY_CHAIN.blockExplorers.default.url],
        }]
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleArbitrate = async (e) => {
    e.preventDefault();
    if (!account) return alert('Please connect your wallet first.');

    const argsToPass = [];
    for (let input of activeTab.inputs) {
      if (!formData[input.id]) return alert(`Please fill in: ${input.label}`);
      argsToPass.push(formData[input.id]);
    }

    setIsArbitrating(true);
    setVerdict(null);

    try {
      const client = getGenLayerClient(account);
      const txHash = await client.writeContract({
        address: GEN_RESOLVE_ADDRESS,
        functionName: activeTab.method,
        args: argsToPass,
      });

      console.log('Tx sent:', txHash);

      setTimeout(async () => {
        try {
          const result = await client.readContract({
            address: GEN_RESOLVE_ADDRESS,
            functionName: 'get_last_resolution',
            args: []
          });
          setVerdict(result);
        } catch (e) {
          console.error('Fetch result failed', e);
          setVerdict('FETCH_ERROR');
        } finally {
          setIsArbitrating(false);
          setDisputeCount(prev => (prev === '—' ? '1' : String(parseInt(prev) + 1)));
        }
      }, 15000);

    } catch (err) {
      console.error(err);
      setIsArbitrating(false);
      alert('Transaction failed or rejected. Check the console for details.');
    }
  };

  const isPositiveVerdict = verdict === activeTab.positiveVerdict;

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <nav className="navbar">
        <button className="navbar-logo" onClick={() => navigate('/')}>
          <Scale size={17} color="#007bff" strokeWidth={2.5} />
          GenResolve
        </button>

        <div className="navbar-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`nav-link ${activeTab.id === tab.id ? 'active' : ''}`}
              onClick={() => !isArbitrating && setActiveTab(tab)}
              style={{ cursor: isArbitrating ? 'not-allowed' : 'pointer' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="navbar-right">
          {/* Network info popover */}
          <div style={{ position: 'relative' }}>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowNetworkInfo(!showNetworkInfo)}
              style={{ gap: '0.3rem' }}
            >
              <Info size={13} />
              Network
              <ChevronDown size={11} style={{ transform: showNetworkInfo ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            <AnimatePresence>
              {showNetworkInfo && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    width: 280, background: '#fff',
                    border: '1px solid #e4e4e4', borderRadius: '8px',
                    padding: '1rem', zIndex: 200,
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#000', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Shield size={13} color="#007bff" />
                    Network Setup
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#666', lineHeight: 1.55, marginBottom: '0.875rem' }}>
                    Configure MetaMask for the <strong style={{ color: '#000' }}>Bradbury Testnet</strong> to send transactions.
                  </p>
                  <button onClick={addNetwork} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                    <Plus size={13} /> Add to MetaMask
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="btn btn-primary btn-sm" onClick={connectWallet}>
            <Wallet size={13} />
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      {/* STATS BAR */}
      <div className="stats-bar">
        {[
          { label: 'Contract Address', value: `${GEN_RESOLVE_ADDRESS.slice(0, 10)}...${GEN_RESOLVE_ADDRESS.slice(-6)}` },
          { label: 'Network', value: 'Bradbury Testnet' },
          {
            label: 'Total Disputes Handled',
            value: (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {disputeCount}
                {isArbitrating && <RefreshCw size={14} color="#007bff" style={{ animation: 'spin 1s linear infinite' }} />}
              </span>
            )
          },
          { label: 'Status', value: <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}>● Live</span> },
        ].map((s, i) => (
          <div key={i} className="stat-cell">
            <div className="stat-lbl">{s.label}</div>
            <div className="stat-val" style={{ fontSize: '0.9375rem', fontWeight: 700, fontFamily: i === 0 ? 'monospace' : 'inherit' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="main-grid">

        {/* SIDEBAR — Case info */}
        <aside className="sidebar">
          <div>
            <div style={{
              fontSize: '0.6875rem', fontWeight: 700, color: '#999',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem'
            }}>
              Active Module
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#000', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
              {activeTab.title}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.6, marginBottom: '1rem' }}>
              {activeTab.description}
            </p>
            <span className="method-tag">
              {activeTab.method}()
            </span>
          </div>

          <div className="divider" />

          {/* SEGMENT TABS (mobile / sidebar display) */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              Use Case
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => !isArbitrating && setActiveTab(tab)}
                  disabled={isArbitrating}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.625rem 0.875rem', borderRadius: '6px', border: 'none',
                    background: activeTab.id === tab.id ? '#007bff' : 'transparent',
                    color: activeTab.id === tab.id ? '#fff' : '#555',
                    fontFamily: 'inherit', fontSize: '0.8125rem', fontWeight: activeTab.id === tab.id ? 600 : 500,
                    cursor: isArbitrating ? 'not-allowed' : 'pointer', textAlign: 'left',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Wallet status */}
          <div style={{ background: account ? 'rgba(22, 163, 74, 0.06)' : '#f0f0f0', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.375rem' }}>
              Wallet
            </div>
            {account ? (
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#166534', fontFamily: 'monospace' }}>
                ✓ {account.slice(0, 8)}...{account.slice(-6)}
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.75rem' }}>
                  Connect your wallet to submit disputes.
                </div>
                <button className="btn btn-primary btn-sm" onClick={connectWallet} style={{ width: '100%' }}>
                  <Wallet size={13} /> Connect Wallet
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* FORM PANEL */}
        <main className="content-area">

          {/* Tabs row (top, desktop-primary) */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.625rem' }}>
              Dispute Type
            </div>
            <div className="segment-tabs" style={{ display: 'inline-flex', width: 'auto' }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  className={`segment-tab ${activeTab.id === tab.id ? 'active' : ''}`}
                  onClick={() => !isArbitrating && setActiveTab(tab)}
                  disabled={isArbitrating}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="card"
            >
              <form onSubmit={handleArbitrate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {activeTab.inputs.map(input => (
                  <div className="form-field" key={input.id}>
                    <label className="form-lbl">{input.label}</label>
                    <textarea
                      className="form-textarea"
                      placeholder={input.placeholder}
                      value={formData[input.id]}
                      onChange={e => setFormData({ ...formData, [input.id]: e.target.value })}
                      disabled={isArbitrating}
                      style={activeTab.inputs.length === 1 ? { minHeight: '160px' } : {}}
                    />
                  </div>
                ))}

                <div style={{ paddingTop: '0.5rem' }}>
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isArbitrating || !account}
                    style={{ width: '100%', gap: '0.625rem' }}
                  >
                    <AnimatePresence mode="wait">
                      {isArbitrating ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}
                        >
                          <span className="spinner" />
                          AI validators deliberating...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="ready"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Zap size={15} />
                          Run AI Arbitration
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                  {!account && (
                    <p style={{ fontSize: '0.75rem', color: '#999', textAlign: 'center', marginTop: '0.625rem' }}>
                      Connect wallet to enable submissions
                    </p>
                  )}
                </div>
              </form>
            </motion.div>
          </AnimatePresence>

          {/* Verdict */}
          <AnimatePresence>
            {verdict && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.625rem' }}>
                  AI Verdict
                </div>
                <div className={`verdict-box ${verdict === activeTab.positiveVerdict ? 'verdict-positive' : 'verdict-negative'}`}>
                  {verdict === activeTab.positiveVerdict
                    ? <CheckCircle2 size={20} />
                    : <XCircle size={20} />
                  }
                  <span style={{ fontSize: '1.125rem', letterSpacing: '0.04em' }}>{verdict}</span>
                  <span style={{
                    marginLeft: 'auto', fontSize: '0.75rem', fontWeight: 500, opacity: 0.75
                  }}>
                    {verdict === activeTab.positiveVerdict ? 'Positive outcome' : 'Negative outcome'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info box */}
          <div style={{
            background: '#f8f9ff', border: '1px solid #dde5ff',
            borderRadius: '8px', padding: '1rem',
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
          }}>
            <Info size={14} color="#007bff" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '0.8125rem', color: '#555', lineHeight: 1.6 }}>
              <strong style={{ color: '#000' }}>How this works:</strong> Your submission is processed by GenLayer's
              Intelligent Contract, which sends it through multiple LLM validator nodes. Consensus takes ~15 seconds
              via Optimistic Democracy. Contract: <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{GEN_RESOLVE_ADDRESS.slice(0, 10)}...{GEN_RESOLVE_ADDRESS.slice(-6)}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
