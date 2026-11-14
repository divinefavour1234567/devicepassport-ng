import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { WalletButton } from '@pollar/react';
import { Activity, ArrowUpRight, BadgeCheck, Check, ChevronRight, CircleHelp, ClipboardCheck, Clock3, Download, Fingerprint, LayoutDashboard, Menu, Plus, QrCode, Search, Shield, ShieldCheck, Smartphone, Wallet, X } from 'lucide-react';

type Device = {
  id: string;
  owner: string;
  make: string;
  model: string;
  storage: string;
  color: string;
  imei: string;
  created: string;
  status: 'Awaiting inspection' | 'Inspected' | 'Draft';
  grade?: string;
  technician?: string;
  notes?: string;
  batteryHealth?: number;
  screen?: string;
  cameras?: string;
  ports?: string;
  network?: string;
  reportId?: string;
};

const seed: Device[] = [
  {
    id: 'DP-8F2A91',
    owner: 'Ada Okafor',
    make: 'Apple',
    model: 'iPhone 13 Pro',
    storage: '256GB',
    color: 'Sierra Blue',
    imei: '••••••••••4821',
    created: '12 Nov 2026',
    status: 'Inspected',
    grade: 'B+',
    technician: 'Demo technician · identity not verified',
    notes: 'Minor frame wear. Display, cameras, speakers and charging port passed functional checks.',
    batteryHealth: 87,
    screen: 'Pass · light micro-scratches',
    cameras: 'Pass · front and rear',
    ports: 'Pass · Lightning',
    network: 'Pass · SIM and Wi-Fi',
    reportId: 'RPT-2026-0048',
  },
  {
    id: 'DP-2C7D14',
    owner: 'Tunde Bakare',
    make: 'Samsung',
    model: 'Galaxy S22',
    storage: '128GB',
    color: 'Phantom Black',
    imei: '••••••••••1190',
    created: '13 Nov 2026',
    status: 'Awaiting inspection',
  },
];

const money = (n: number) => `₦${n.toLocaleString('en-NG')}`;

function App() {
  const [devices, setDevices] = useState<Device[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('dp-devices') || 'null') || seed;
    } catch {
      return seed;
    }
  });
  const [active, setActive] = useState(
    () => new URLSearchParams(window.location.search).has('passport') ? 'Passports' : 'Overview',
  );
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<'device' | 'inspection' | 'passport' | null>(null);
  const [selected, setSelected] = useState(
    () => new URLSearchParams(window.location.search).get('passport') || 'DP-8F2A91',
  );
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({
    owner: '',
    make: 'Apple',
    model: '',
    storage: '128GB',
    color: '',
    imei: '',
  });
  const [inspection, setInspection] = useState({
    deviceId: 'DP-2C7D14',
    battery: '88',
    screen: 'Pass',
    cameras: 'Pass',
    ports: 'Pass',
    network: 'Pass',
    notes: '',
  });

  useEffect(() => {
    localStorage.setItem('dp-devices', JSON.stringify(devices));
  }, [devices]);

  useEffect(() => {
    const passportId = new URLSearchParams(window.location.search).get('passport');
    if (passportId) {
      setSelected(passportId);
      setActive('Passports');
    }
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const filtered = useMemo(
    () => devices.filter((device) =>
      `${device.make} ${device.model} ${device.owner} ${device.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    ),
    [devices, query],
  );

  const inspected = devices.filter((device) => device.status === 'Inspected').length;
  const pending = devices.filter((device) => device.status === 'Awaiting inspection').length;
  const current = devices.find((device) => device.id === selected) || devices[0];

  function addDevice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const device: Device = {
      ...form,
      id: `DP-${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
      created: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Awaiting inspection',
    };
    setDevices((previous) => [device, ...previous]);
    setSelected(device.id);
    setModal(null);
    setForm({ owner: '', make: 'Apple', model: '', storage: '128GB', color: '', imei: '' });
    setToast('Device registered. Its passport ID is ready.');
  }

  function saveInspection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const device = devices.find((item) => item.id === inspection.deviceId);
    if (!device) return;

    const reportId = `RPT-${new Date().getFullYear()}-${String(devices.length + 48).padStart(4, '0')}`;
    setDevices((previous) => previous.map((item) => item.id === device.id
      ? {
          ...item,
          status: 'Inspected',
          grade: Number(inspection.battery) >= 90
            ? 'A'
            : Number(inspection.battery) >= 80 ? 'B+' : 'C',
          technician: 'Demo technician · identity not verified',
          notes: inspection.notes || 'Inspection recorded using the demo checklist.',
          batteryHealth: Number(inspection.battery),
          screen: inspection.screen,
          cameras: inspection.cameras,
          ports: inspection.ports,
          network: inspection.network,
          reportId,
        }
      : item));
    setSelected(device.id);
    setModal(null);
    setActive('Passports');
    setToast('Inspection report saved locally. Technician identity is demo-only.');
  }

  function exportReport(device: Device) {
    const blob = new Blob([JSON.stringify(device, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${device.id}-passport.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const nav = [
    ['Overview', LayoutDashboard],
    ['Devices', Smartphone],
    ['Inspections', ClipboardCheck],
    ['Passports', QrCode],
  ] as const;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Fingerprint size={23} /></div>
          <div><b>devicepassport</b><small>NG · TRUSTED DEVICE RECORDS</small></div>
        </div>
        <div className="workspace">
          <span className="avatar">DP</span>
          <div><b>Demo workspace</b><small>Personal account</small></div>
          <ChevronRight size={15} />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {nav.map(([name, Icon]) => (
            <button
              key={name}
              className={active === name ? 'nav-item active' : 'nav-item'}
              onClick={() => setActive(name)}
            >
              <Icon size={18} />
              {name}
              {name === 'Inspections' && pending > 0 && <span className="nav-count">{pending}</span>}
            </button>
          ))}
        </nav>
        <div className="side-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={18} /></div>
            <b>Need a hand?</b>
            <p>Learn how device passports build buyer confidence.</p>
            <button onClick={() => setToast('Help centre will be connected in the next build.')}>
              Visit help centre <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="profile">
            <div className="avatar user">DO</div>
            <div><b>Demo Operator</b><small>Administrator</small></div>
            <Menu size={17} />
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumb">Workspace <span>/</span> <b>{active}</b></div>
          <div className="top-actions">
            <span className="demo-pill"><span /> TESTNET ENVIRONMENT</span>
            <WalletButton />
            <button className="icon-btn" onClick={() => setToast('Notifications are not connected in this prototype.')}>
              <Activity size={18} />
            </button>
            <div className="avatar user">DO</div>
          </div>
        </header>

        <div className="content">
          {active === 'Overview' && (
            <>
              <div className="welcome-row">
                <div>
                  <div className="eyebrow">SATURDAY, 14 NOVEMBER 2026</div>
                  <h1>Good afternoon, Operator <span>✦</span></h1>
                  <p className="subhead">Here’s what’s happening across your device verification workspace.</p>
                </div>
                <button className="primary" onClick={() => setModal('device')}>
                  <Plus size={17} /> Register a device
                </button>
              </div>

              <div className="stat-grid">
                <Stat icon={<Smartphone />} label="Registered devices" value={String(devices.length).padStart(2, '0')} trend="Across all device records" />
                <Stat icon={<ShieldCheck />} label="Recorded inspections" value={String(inspected).padStart(2, '0')} trend="Demo records only" />
                <Stat icon={<Clock3 />} label="Awaiting inspection" value={String(pending).padStart(2, '0')} trend="Ready for technician review" />
                <Stat icon={<Wallet />} label="Inspection fees" value={money(0)} trend="No live payments recorded" />
              </div>

              <div className="section-grid">
                <section className="panel recent-panel">
                  <div className="panel-head">
                    <div><h2>Recent devices</h2><p>Your latest registered devices and their status.</p></div>
                    <button className="text-btn" onClick={() => setActive('Devices')}>View all <ChevronRight size={15} /></button>
                  </div>
                  <div className="table-wrap">
                    <table>
                      <thead><tr><th>DEVICE</th><th>OWNER</th><th>DATE ADDED</th><th>STATUS</th><th /></tr></thead>
                      <tbody>
                        {devices.slice(0, 5).map((device) => (
                          <tr key={device.id}>
                            <td>
                              <div className="device-cell">
                                <div className="device-thumb"><Smartphone size={19} /></div>
                                <div><b>{device.make} {device.model}</b><small>{device.id} · {device.storage}</small></div>
                              </div>
                            </td>
                            <td>{device.owner}</td>
                            <td>{device.created}</td>
                            <td><Status status={device.status} /></td>
                            <td><button className="row-more" onClick={() => { setSelected(device.id); setModal('passport'); }}>↗</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="panel activity-panel">
                  <div className="panel-head"><div><h2>Quick actions</h2><p>Move your verification workflow forward.</p></div></div>
                  <button className="action-tile" onClick={() => setModal('device')}>
                    <div className="action-icon purple"><Plus /></div>
                    <div><b>Register a device</b><small>Create a new device passport record</small></div>
                    <ChevronRight />
                  </button>
                  <button className="action-tile" onClick={() => {
                    setInspection((previous) => ({
                      ...previous,
                      deviceId: devices.find((device) => device.status !== 'Inspected')?.id || devices[0]?.id || '',
                    }));
                    setModal('inspection');
                  }}>
                    <div className="action-icon blue"><ClipboardCheck /></div>
                    <div><b>Record an inspection</b><small>Submit a technician checklist</small></div>
                    <ChevronRight />
                  </button>
                  <button className="action-tile" onClick={() => setActive('Passports')}>
                    <div className="action-icon green"><QrCode /></div>
                    <div><b>Verify a passport</b><small>Review a device’s inspection history</small></div>
                    <ChevronRight />
                  </button>
                  <div className="integrity-note">
                    <ShieldCheck size={17} />
                    <span><b>Evidence-first records</b><small>Inspection results are attributed to the person who records them. This demo does not independently authenticate technicians.</small></span>
                  </div>
                </section>
              </div>

              <section className="pollar-banner">
                <div className="pollar-symbol"><Wallet size={24} /></div>
                <div className="pollar-copy">
                  <span className="eyebrow">PAYMENT INFRASTRUCTURE</span>
                  <h2>Pollar-powered inspection payments</h2>
                  <p>Connect a Pollar testnet wallet to collect inspection fees and link a signed payment reference to each inspection request.</p>
                </div>
                <div className="pollar-right">
                  <span className="integration-status"><i /> Integration pending</span>
                  <button className="outline-light" onClick={() => setToast('Pollar credentials are not configured. Add VITE_POLLAR_PUBLISHABLE_KEY in .env.local to begin integration.')}>
                    Configure Pollar <ArrowUpRight size={15} />
                  </button>
                </div>
              </section>
            </>
          )}

          {active === 'Devices' && (
            <>
              <div className="page-title">
                <div><div className="eyebrow">DEVICE INVENTORY</div><h1>Devices</h1><p className="subhead">Register and manage devices entering the inspection network.</p></div>
                <button className="primary" onClick={() => setModal('device')}><Plus size={17} /> Register device</button>
              </div>
              <div className="panel list-panel">
                <div className="list-toolbar">
                  <div className="searchbox"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search device, owner or passport ID..." /></div>
                  <span className="muted">{filtered.length} records</span>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead><tr><th>DEVICE</th><th>OWNER</th><th>PASSPORT ID</th><th>DATE ADDED</th><th>STATUS</th><th /></tr></thead>
                    <tbody>
                      {filtered.map((device) => (
                        <tr key={device.id}>
                          <td><b>{device.make} {device.model}</b><small className="cell-sub">{device.storage} · {device.color}</small></td>
                          <td>{device.owner}</td><td className="mono">{device.id}</td><td>{device.created}</td>
                          <td><Status status={device.status} /></td>
                          <td><button className="small-outline" onClick={() => { setSelected(device.id); setModal('passport'); }}>Open passport</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && <div className="empty">No devices match that search.</div>}
                </div>
              </div>
            </>
          )}

          {active === 'Inspections' && (
            <>
              <div className="page-title">
                <div><div className="eyebrow">QUALITY & CONDITION</div><h1>Inspections</h1><p className="subhead">Structured condition checks recorded against each device.</p></div>
                <button className="primary" onClick={() => setModal('inspection')}><Plus size={17} /> New inspection</button>
              </div>
              <div className="notice">
                <Shield size={18} />
                <span><b>Important:</b> Reports in this prototype are user-entered demo records. A real deployment needs technician onboarding, identity verification, evidence capture and audit controls.</span>
              </div>
              <div className="inspection-grid">
                {devices.map((device) => (
                  <div className="panel inspection-card" key={device.id}>
                    <div className="inspection-card-top"><div className="device-thumb"><Smartphone /></div><Status status={device.status} /></div>
                    <h3>{device.make} {device.model}</h3>
                    <p className="muted mono">{device.id}</p>
                    {device.status === 'Inspected' ? (
                      <>
                        <div className="grade-row"><div className="grade">{device.grade}</div><div><b>Condition grade</b><small>Based on recorded checklist</small></div></div>
                        <p className="inspection-note">{device.notes}</p>
                        <button className="small-outline full" onClick={() => { setSelected(device.id); setModal('passport'); }}>View report <ChevronRight size={14} /></button>
                      </>
                    ) : (
                      <>
                        <p className="inspection-note">This device is waiting for an inspection to be recorded.</p>
                        <button className="primary full" onClick={() => { setInspection((previous) => ({ ...previous, deviceId: device.id })); setModal('inspection'); }}>Start inspection <ArrowUpRight size={14} /></button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {active === 'Passports' && (
            <>
              <div className="page-title">
                <div><div className="eyebrow">PORTABLE DEVICE RECORDS</div><h1>Device passports</h1><p className="subhead">A shareable record of device identity, condition checks and inspection history.</p></div>
              </div>
              <div className="passport-layout">
                <div className="panel passport-list">
                  <div className="panel-head"><div><h2>All passports</h2><p>Select a device to view its record.</p></div></div>
                  {devices.map((device) => (
                    <button className={selected === device.id ? 'passport-select selected' : 'passport-select'} key={device.id} onClick={() => setSelected(device.id)}>
                      <div className="device-thumb"><Smartphone /></div>
                      <div><b>{device.make} {device.model}</b><small>{device.id} · {device.owner}</small></div>
                      <ChevronRight size={16} />
                    </button>
                  ))}
                </div>

                {current && (
                  <div className="panel passport-detail">
                    <div className="passport-head">
                      <div><span className="eyebrow">DEVICEPASSPORT NG</span><h2>{current.make} {current.model}</h2><p className="mono muted">{current.id}</p></div>
                      <Status status={current.status} />
                    </div>
                    <div className="passport-body">
                      <div className="qr-block">
                        <QRCodeSVG value={`${window.location.origin}/?passport=${current.id}`} size={142} level="H" includeMargin />
                        <small>SCAN TO OPEN PASSPORT</small>
                      </div>
                      <div className="passport-facts">
                        <Fact label="Registered owner" value={current.owner} />
                        <Fact label="Storage / colour" val
