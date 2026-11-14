
import React, { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Activity,
  ArrowUpRight,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  Fingerprint,
  LayoutDashboard,
  Plus,
  QrCode,
  Search,
  ShieldCheck,
  Smartphone,
  Wallet,
  X
} from 'lucide-react';

type DeviceStatus = 'Awaiting inspection' | 'Inspected';

type Device = {
  id: string;
  owner: string;
  make: string;
  model: string;
  storage: string;
  color: string;
  imei: string;
  created: string;
  status: DeviceStatus;
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

const STORAGE_KEY = 'devicepassport-ng-devices-v1';

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
    technician: 'Demo technician',
    notes: 'Minor frame wear. Display, cameras, speakers and charging port passed the recorded checks.',
    batteryHealth: 87,
    screen: 'Pass · light micro-scratches',
    cameras: 'Pass · front and rear',
    ports: 'Pass · Lightning',
    network: 'Pass · SIM and Wi-Fi',
    reportId: 'RPT-2026-0048'
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
    status: 'Awaiting inspection'
  }
];

const money = (amount: number) =>
  `₦${amount.toLocaleString('en-NG')}`;

function App() {
  const [devices, setDevices] = useState<Device[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) as Device[] : seed;
    } catch {
      return seed;
    }
  });

  const [active, setActive] = useState<
    'Overview' | 'Devices' | 'Inspections' | 'Passports'
  >(() => {
    return new URLSearchParams(window.location.search).has('passport')
      ? 'Passports'
      : 'Overview';
  });

  const [selected, setSelected] = useState(
    () =>
      new URLSearchParams(window.location.search).get('passport') ||
      'DP-8F2A91'
  );

  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<'device' | 'inspection' | null>(null);
  const [toast, setToast] = useState('');

  const [form, setForm] = useState({
    owner: '',
    make: 'Apple',
    model: '',
    storage: '128GB',
    color: '',
    imei: ''
  });

  const [inspection, setInspection] = useState({
    deviceId: 'DP-2C7D14',
    battery: '88',
    screen: 'Pass',
    cameras: 'Pass',
    ports: 'Pass',
    network: 'Pass',
    notes: ''
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
    } catch {
      setToast('Unable to save records in this browser.');
    }
  }, [devices]);

  useEffect(() => {
    const passportId = new URLSearchParams(
      window.location.search
    ).get('passport');

    if (passportId) {
      setSelected(passportId);
      setActive('Passports');
    }
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => setToast(''), 3200);

    return () => window.clearTimeout(timer);
  }, [toast]);

  const filtered = useMemo(() => {
    return devices.filter(device =>
      `${device.make} ${device.model} ${device.owner} ${device.id}`
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [devices, query]);

  const inspected = devices.filter(
    device => device.status === 'Inspected'
  ).length;

  const pending = devices.filter(
    device => device.status === 'Awaiting inspection'
  ).length;

  const current =
    devices.find(device => device.id === selected) || devices[0];

  function addDevice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const device: Device = {
      ...form,
      id: `DP-${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
      created: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: 'Awaiting inspection'
    };

    setDevices(previous => [device, ...previous]);
    setSelected(device.id);
    setModal(null);

    setForm({
      owner: '',
      make: 'Apple',
      model: '',
      storage: '128GB',
      color: '',
      imei: ''
    });

    setToast('Device registered. Passport ID created.');
  }

  function saveInspection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const exists = devices.some(
      device => device.id === inspection.deviceId
    );

    if (!exists) {
      setToast('Please select a valid device.');
      return;
    }

    const battery = Number(inspection.battery);

    if (!Number.isFinite(battery) || battery < 0 || battery > 100) {
      setToast('Battery health must be between 0 and 100.');
      return;
    }

    const reportId =
      `RPT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

    setDevices(previous =>
      previous.map(device => {
        if (device.id !== inspection.deviceId) return device;

        return {
          ...device,
          status: 'Inspected',
          grade: battery >= 90 ? 'A' : battery >= 80 ? 'B+' : 'C',
          technician: 'Demo technician · identity not verified',
          notes: inspection.notes ||
            'Inspection recorded using the demo checklist.',
          batteryHealth: battery,
          screen: inspection.screen,
          cameras: inspection.cameras,
          ports: inspection.ports,
          network: inspection.network,
          reportId
        };
      })
    );

    setSelected(inspection.deviceId);
    setModal(null);
    setActive('Passports');

    setToast(
      'Inspection saved locally. Technician identity is not verified.'
    );
  }

  function startInspection(deviceId?: string) {
    const nextId =
      deviceId ||
      devices.find(
        device => device.status === 'Awaiting inspection'
      )?.id ||
      devices[0]?.id ||
      '';

    setInspection(previous => ({
      ...previous,
      deviceId: nextId
    }));

    setModal('inspection');
  }

  function exportReport(device: Device) {
    const blob = new Blob(
      [JSON.stringify(device, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `${device.id}-passport.json`;
    anchor.click();

    URL.revokeObjectURL(url);
  }

  const navigation = [
    ['Overview', LayoutDashboard],
    ['Devices', Smartphone],
    ['Inspections', ClipboardCheck],
    ['Passports', QrCode]
  ] as const;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Fingerprint size={23} />
          </div>
          <div>
            <b>devicepassport</b>
            <small>NG · TRUSTED DEVICE RECORDS</small>
          </div>
        </div>

        <div className="workspace">
          <span className="avatar">DP</span>
          <div>
            <b>Demo workspace</b>
            <small>Local prototype</small>
          </div>
          <ChevronRight size={15} />
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav>
          {navigation.map(([name, Icon]) => (
            <button
              key={name}
              className={active === name ? 'nav-item active' : 'nav-item'}
              onClick={() => setActive(name)}
            >
              <Icon size={18} />
              {name}
              {name === 'Inspections' && pending > 0 && (
                <span className="nav-count">{pending}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="side-bottom">
          <div className="help-card">
            <b>Evidence-first records</b>
            <p>
              Prototype records are not independent proof of device
              condition or technician identity.
            </p>
          </div>

          <div className="profile">
            <div className="avatar user">DP</div>
            <div>
              <b>Demo Operator</b>
              <small>Prototype account</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="crumb">
            Workspace <span>/</span> <b>{active}</b>
          </div>

          <div className="top-actions">
            <span className="demo-pill">
              <span /> TESTNET DEMO
            </span>

            <span className="muted">Pollar integration pending</span>

            <button
              className="icon-btn"
              onClick={() =>
                setToast('Notifications are not connected yet.')
              }
            >
              <Activity size={18} />
            </button>
          </div>
        </header>

        <div className="content">
          {active === 'Overview' && (
            <>
              <div className="welcome-row">
                <div>
                  <div className="eyebrow">
                    DEVICE VERIFICATION WORKSPACE
                  </div>
                  <h1>
                    Good day, Operator <span>✦</span>
                  </h1>
                  <p className="subhead">
                    Track device registrations, inspection records
                    and shareable passports.
                  </p>
                </div>

                <button
                  className="primary"
                  onClick={() => setModal('device')}
                >
                  <Plus size={17} /> Register a device
                </button>
              </div>

              <div className="stat-grid">
                <Stat
                  icon={<Smartphone />}
                  label="Registered devices"
                  value={String(devices.length).padStart(2, '0')}
                  trend="Saved in this browser"
                />
                <Stat
                  icon={<ShieldCheck />}
                  label="Recorded inspections"
                  value={String(inspected).padStart(2, '0')}
                  trend="Includes demo records"
                />
                <Stat
                  icon={<Clock3 />}
                  label="Awaiting inspection"
                  value={String(pending).padStart(2, '0')}
                  trend="Pending checklist"
                />
                <Stat
                  icon={<Wallet />}
                  label="Inspection fees"
                  value={money(0)}
                  trend="No live payments recorded"
                />
              </div>

              <div className="section-grid">
                <section className="panel recent-panel">
                  <div className="panel-head">
                    <div>
                      <h2>Recent devices</h2>
                      <p>Latest records in this workspace.</p>
                    </div>
                    <button
                      className="text-btn"
                      onClick={() => setActive('Devices')}
                    >
                      View all <ChevronRight size={15} />
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>DEVICE</th>
                          <th>OWNER</th>
                          <th>DATE ADDED</th>
                          <th>STATUS</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {devices.slice(0, 5).map(device => (
                          <tr key={device.id}>
                            <td>
                              <div className="device-cell">
                                <div className="device-thumb">
                                  <Smartphone size={19} />
                                </div>
                                <div>
                                  <b>{device.make} {device.model}</b>
                                  <small>
                                    {device.id} · {device.storage}
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>{device.owner}</td>
                            <td>{device.created}</td>
                            <td><Status status={device.status} /></td>
                            <td>
                              <button
                                className="row-more"
                                onClick={() => {
                                  setSelected(device.id);
                                  setActive('Passports');
                                }}
                              >
                                ↗
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="panel activity-panel">
                  <div className="panel-head">
                    <div>
                      <h2>Quick actions</h2>
                      <p>Continue the verification workflow.</p>
                    </div>
                  </div>

                  <Action
                    icon={<Plus />}
                    title="Register a device"
                    detail="Create a passport record"
                    onClick={() => setModal('device')}
                  />
                  <Action
                    icon={<ClipboardCheck />}
                    title="Record an inspection"
                    detail="Enter technician checklist results"
                    onClick={() => startInspection()}
                  />
                  <Action
                    icon={<QrCode />}
                    title="View passports"
                    detail="Open a shareable device record"
                    onClick={() => setActive('Passports')}
                  />

                  <div className="integrity-note">
                    <ShieldCheck size={17} />
                    <span>
                      <b>Prototype integrity notice</b>
                      <small>
                        Records are stored locally. They are not yet
                        server-backed, signed or independently verified.
                      </small>
                    </span>
                  </div>
                </section>
              </div>

              <section className="pollar-banner">
                <div className="pollar-symbol">
                  <Wallet size={24} />
                </div>
                <div className="pollar-copy">
                  <span className="eyebrow">POLLAR SDK · TESTNET</span>
                  <h2>Wallet connection for inspection payments</h2>
                  <p>
                    Pollar payment collection and payment-to-report
                    linking are not yet implemented. This prototype
                    does not claim to have processed any payments.
                  </p>
                </div>
                <div className="pollar-right">
                  <span className="integration-status">
                    <i /> Integration pending
                  </span>
                </div>
              </section>
            </>
          )}

          {active === 'Devices' && (
            <>
              <PageTitle
                eyebrow="DEVICE INVENTORY"
                title="Devices"
                description="Register and manage devices entering the inspection network."
                action={
                  <button
                    className="primary"
                    onClick={() => setModal('device')}
                  >
                    <Plus size={17} /> Register device
                  </button>
                }
              />

              <div className="panel list-panel">
                <div className="list-toolbar">
                  <div className="searchbox">
                    <Search size={17} />
                    <input
                      value={query}
                      onChange={event => setQuery(event.target.value)}
                      placeholder="Search device, owner or passport ID..."
                    />
                  </div>
                  <span className="muted">
                    {filtered.length} records
                  </span>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>DEVICE</th>
                        <th>OWNER</th>
                        <th>PASSPORT ID</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(device => (
                        <tr key={device.id}>
                          <td>
                            <b>{device.make} {device.model}</b>
                            <small>
                              {device.storage} · {device.color}
                            </small>
                          </td>
                          <td>{device.owner}</td>
                          <td className="mono">{device.id}</td>
                          <td>{device.created}</td>
                          <td><Status status={device.status} /></td>
                          <td>
                            <button
                              className="small-outline"
                              onClick={() => {
                                setSelected(device.id);
                                setActive('Passports');
                              }}
                            >
                              Open passport
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <div className="empty">
                      No devices match that search.
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {active === 'Inspections' && (
            <>
              <PageTitle
                eyebrow="QUALITY & CONDITION"
                title="Inspections"
                description="Structured condition checks recorded against each device."
                action={
                  <button
                    className="primary"
                    onClick={() => startInspection()}
                  >
                    <Plus size={17} /> New inspection
                  </button>
                }
              />

              <div className="notice">
                <ShieldCheck size={18} />
                <span>
                  <b>Important:</b> Reports in this prototype are
                  user-entered demo records. Technician identity,
                  physical evidence and report signing are not
                  independently verified.
                </span>
              </div>

              <div className="inspection-grid">
                {devices.map(device => (
                  <div className="panel ins
