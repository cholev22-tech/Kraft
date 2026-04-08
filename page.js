\
"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "kraft-service-offers-v1";

const defaultServices = [
  { id: 1, name: "Смяна масло и филтри", type: "labor", price: 40, discount: 0 },
  { id: 2, name: "Смяна на свещи", type: "labor", price: 120, discount: 0 },
  { id: 3, name: "Стенд дюзи", type: "service", price: 250, discount: 0 },
  { id: 4, name: "Ремонт дюзи (2 бр.)", type: "service", price: 360, discount: 0 },
  { id: 5, name: "Смяна ангренаж", type: "labor", price: 500, discount: 0 },
  { id: 6, name: "Труд", type: "labor", price: 120, discount: 0 },
];

const defaultParts = [
  { id: 1, name: "Маслен филтър", type: "part", price: 10, discount: 25 },
  { id: 2, name: "Въздушен филтър", type: "part", price: 20, discount: 25 },
  { id: 3, name: "Горивен филтър", type: "part", price: 105, discount: 25 },
  { id: 4, name: "Филтър купе", type: "part", price: 30, discount: 25 },
  { id: 5, name: "Двигателно масло", type: "part", price: 100, discount: 25 },
  { id: 6, name: "Свещи", type: "part", price: 190, discount: 25 },
  { id: 7, name: "Ангренажен комплект", type: "part", price: 450, discount: 25 },
];

const defaultTemplates = [
  {
    id: 1,
    name: "Пълно обслужване",
    items: [
      { id: 101, name: "Маслен филтър", type: "part", qty: 1, price: 10, discount: 25 },
      { id: 102, name: "Въздушен филтър", type: "part", qty: 1, price: 20, discount: 25 },
      { id: 103, name: "Горивен филтър", type: "part", qty: 1, price: 105, discount: 25 },
      { id: 104, name: "Филтър купе", type: "part", qty: 1, price: 30, discount: 25 },
      { id: 105, name: "Двигателно масло", type: "part", qty: 1, price: 100, discount: 25 },
      { id: 106, name: "Смяна масло и филтри", type: "labor", qty: 1, price: 40, discount: 0 },
    ],
  },
];

const defaultClients = [
  { id: 1, name: "Важен клиент", phone: "", car: "", plate: "", notes: "" },
];

function formatEUR(value) {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function makeOfferNumber(nextNumber) {
  const year = new Date().getFullYear();
  return `OFF-${year}-${String(nextNumber).padStart(4, "0")}`;
}

function lineTotals(item) {
  const base = Number(item.qty || 0) * Number(item.price || 0);
  const discountValue = base * (Number(item.discount || 0) / 100);
  const finalValue = base - discountValue;
  return { base, discountValue, finalValue };
}

function seedState() {
  return {
    company: {
      name: "Крафт Сервиз София",
      address: "Околовръстен път",
      title: "СПЕЦИАЛНА ОФЕРТА",
      footer: "Благодарим Ви за доверието.",
      logoTextTop: "KRAFT",
      logoTextBottom: "SERVICE",
    },
    sequence: 1,
    clients: defaultClients,
    partsCatalog: defaultParts,
    servicesCatalog: defaultServices,
    templates: defaultTemplates,
    offers: [],
  };
}

const styles = {
  page: { minHeight: "100vh", padding: 16, color: "#f4f4f5" },
  shell: { maxWidth: 1400, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 },
  title: { fontSize: 34, fontWeight: 900, margin: 0 },
  subtitle: { color: "#a1a1aa", marginTop: 6 },
  actions: { display: "flex", gap: 8, flexWrap: "wrap" },
  btn: { borderRadius: 16, padding: "12px 16px", border: "1px solid #3f3f46", background: "#09090b", color: "#f4f4f5", cursor: "pointer" },
  btnPrimary: { borderRadius: 16, padding: "12px 16px", border: "1px solid #fb923c", background: "#f97316", color: "#111827", cursor: "pointer", fontWeight: 700 },
  tabbar: { display: "flex", gap: 8, background: "#09090b", border: "1px solid #3f3f46", padding: 8, borderRadius: 16, marginBottom: 24, flexWrap: "wrap" },
  tab: { borderRadius: 12, padding: "10px 14px", background: "transparent", border: "none", color: "#d4d4d8", cursor: "pointer" },
  tabActive: { background: "#f97316", color: "#111827", fontWeight: 700 },
  grid: { display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 24 },
  cardDark: { background: "rgba(9,9,11,.92)", border: "1px solid rgba(249,115,22,.25)", borderRadius: 28, padding: 22, boxShadow: "0 20px 50px rgba(0,0,0,.35)" },
  cardLight: { background: "#fff", color: "#111827", border: "1px solid rgba(249,115,22,.25)", borderRadius: 28, padding: 28, boxShadow: "0 20px 50px rgba(0,0,0,.35)" },
  miniCard: { background: "#111827", border: "1px solid #27272a", borderRadius: 18, padding: 14 },
  rowGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  rowGrid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 },
  label: { display: "block", marginBottom: 6, fontSize: 13, color: "#d4d4d8" },
  input: { width: "100%", borderRadius: 12, border: "1px solid #3f3f46", background: "#18181b", color: "#fafafa", padding: "10px 12px" },
  select: { width: "100%", borderRadius: 12, border: "1px solid #3f3f46", background: "#18181b", color: "#fafafa", padding: "10px 12px" },
  itemBox: { border: "1px solid #3f3f46", borderRadius: 18, padding: 12, marginBottom: 10, background: "#111827" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#18181b", color: "#fff", textAlign: "left", padding: "12px 10px", fontSize: 13 },
  td: { padding: "12px 10px", borderBottom: "1px solid #e5e7eb", fontSize: 14 },
  badge: { display: "inline-block", padding: "8px 12px", borderRadius: 999, background: "#f4f4f5", color: "#111827", fontWeight: 700, fontSize: 13 },
};

function Field({ label, children }) {
  return (
    <div>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

export default function Page() {
  const [store, setStore] = useState(seedState);
  const [tab, setTab] = useState("offers");
  const [selectedClientId, setSelectedClientId] = useState("1");
  const [searchOffer, setSearchOffer] = useState("");
  const [searchClient, setSearchClient] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [currentOffer, setCurrentOffer] = useState({
    id: null,
    number: makeOfferNumber(1),
    date: today(),
    status: "Чернова",
    clientId: 1,
    notes: "",
    items: [],
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setStore(parsed);
        const firstClient = parsed.clients?.[0]?.id || 1;
        setSelectedClientId(String(firstClient));
        setCurrentOffer((prev) => ({
          ...prev,
          number: makeOfferNumber(parsed.sequence || 1),
          clientId: firstClient,
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  const selectedClient = useMemo(
    () => store.clients.find((c) => String(c.id) === String(selectedClientId)) || store.clients[0],
    [store.clients, selectedClientId]
  );

  useEffect(() => {
    if (selectedClient) {
      setCurrentOffer((prev) => ({ ...prev, clientId: selectedClient.id }));
    }
  }, [selectedClient]);

  const totals = useMemo(() => {
    const regular = currentOffer.items.reduce((sum, item) => sum + lineTotals(item).base, 0);
    const discount = currentOffer.items.reduce((sum, item) => sum + lineTotals(item).discountValue, 0);
    const final = currentOffer.items.reduce((sum, item) => sum + lineTotals(item).finalValue, 0);
    return { regular, discount, final };
  }, [currentOffer.items]);

  const addManualItem = () => {
    setCurrentOffer((prev) => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), name: "", type: "part", qty: 1, price: 0, discount: 25 }],
    }));
  };

  const addCatalogItem = (catalogItem) => {
    setCurrentOffer((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now() + Math.random(),
          name: catalogItem.name,
          type: catalogItem.type,
          qty: 1,
          price: catalogItem.price,
          discount: catalogItem.discount,
        },
      ],
    }));
  };

  const updateItem = (id, key, value) => {
    setCurrentOffer((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== id) return item;
        const next = { ...item, [key]: value };
        if (key === "type") next.discount = value === "part" ? 25 : 0;
        return next;
      }),
    }));
  };

  const removeItem = (id) => {
    setCurrentOffer((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
  };

  const applyTemplate = () => {
    const template = store.templates.find((t) => String(t.id) === String(selectedTemplateId));
    if (!template) return;
    setCurrentOffer((prev) => ({
      ...prev,
      items: template.items.map((item) => ({ ...item, id: Date.now() + Math.random() })),
    }));
  };

  const saveOffer = () => {
    const offerToSave = {
      ...currentOffer,
      id: currentOffer.id || Date.now(),
      clientName: selectedClient?.name || "",
      regularTotal: totals.regular,
      discountTotal: totals.discount,
      finalTotal: totals.final,
    };

    setStore((prev) => {
      const exists = prev.offers.some((o) => o.id === offerToSave.id);
      return {
        ...prev,
        offers: exists
          ? prev.offers.map((o) => (o.id === offerToSave.id ? offerToSave : o))
          : [offerToSave, ...prev.offers],
        sequence: currentOffer.id ? prev.sequence : prev.sequence + 1,
      };
    });

    if (!currentOffer.id) {
      setCurrentOffer((prev) => ({ ...prev, id: offerToSave.id, number: offerToSave.number }));
    }
  };

  const newOffer = () => {
    setCurrentOffer({
      id: null,
      number: makeOfferNumber(store.sequence),
      date: today(),
      status: "Чернова",
      clientId: selectedClient?.id || 1,
      notes: "",
      items: [],
    });
    setTab("offers");
  };

  const loadOffer = (offer) => {
    setSelectedClientId(String(offer.clientId || selectedClient?.id || 1));
    setCurrentOffer({
      id: offer.id,
      number: offer.number,
      date: offer.date,
      status: offer.status,
      clientId: offer.clientId,
      notes: offer.notes || "",
      items: offer.items || [],
    });
    setTab("offers");
  };

  const addClient = () => {
    const newClient = {
      id: Date.now(),
      name: `Нов клиент ${store.clients.length + 1}`,
      phone: "",
      car: "",
      plate: "",
      notes: "",
    };
    setStore((prev) => ({ ...prev, clients: [newClient, ...prev.clients] }));
    setSelectedClientId(String(newClient.id));
  };

  const updateClient = (id, key, value) => {
    setStore((prev) => ({
      ...prev,
      clients: prev.clients.map((client) => (client.id === id ? { ...client, [key]: value } : client)),
    }));
  };

  const addCatalogRecord = (kind) => {
    const item = {
      id: Date.now(),
      name: kind === "part" ? "Нова част" : "Нова услуга",
      type: kind,
      price: 0,
      discount: kind === "part" ? 25 : 0,
    };
    setStore((prev) =>
      kind === "part"
        ? { ...prev, partsCatalog: [item, ...prev.partsCatalog] }
        : { ...prev, servicesCatalog: [item, ...prev.servicesCatalog] }
    );
  };

  const updateCatalogRecord = (kind, id, key, value) => {
    const target = kind === "part" ? "partsCatalog" : "servicesCatalog";
    setStore((prev) => ({
      ...prev,
      [target]: prev[target].map((row) => (row.id === id ? { ...row, [key]: value } : row)),
    }));
  };

  const markAccepted = () => setCurrentOffer((prev) => ({ ...prev, status: "Приета" }));
  const markRejected = () => setCurrentOffer((prev) => ({ ...prev, status: "Отказана" }));
  const duplicateOffer = () => {
    setCurrentOffer((prev) => ({
      ...prev,
      id: null,
      number: makeOfferNumber(store.sequence),
      date: today(),
      status: "Чернова",
      items: prev.items.map((item) => ({ ...item, id: Date.now() + Math.random() })),
    }));
  };

  const filteredOffers = store.offers.filter((offer) => {
    const q = searchOffer.toLowerCase();
    return !q || offer.number.toLowerCase().includes(q) || (offer.clientName || "").toLowerCase().includes(q);
  });

  const filteredClients = store.clients.filter((client) => {
    const q = searchClient.toLowerCase();
    return !q || client.name.toLowerCase().includes(q) || client.car.toLowerCase().includes(q) || client.plate.toLowerCase().includes(q);
  });

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Крафт Оферти Pro</h1>
            <div style={styles.subtitle}>Готов сайт за оферти, клиенти, каталог, история и печат.</div>
          </div>
          <div style={styles.actions}>
            <button style={styles.btnPrimary} onClick={newOffer}>Нова оферта</button>
            <button style={styles.btn} onClick={saveOffer}>Запази</button>
            <button style={styles.btn} onClick={duplicateOffer}>Дублирай</button>
            <button style={styles.btn} onClick={markAccepted}>Приета</button>
            <button style={styles.btn} onClick={markRejected}>Отказана</button>
            <button style={styles.btn} onClick={() => window.print()}>Печат / PDF</button>
          </div>
        </div>

        <div style={styles.tabbar}>
          {[
            ["offers", "Оферти"],
            ["clients", "Клиенти"],
            ["catalog", "Каталог"],
            ["history", "История"],
          ].map(([key, label]) => (
            <button
              key={key}
              style={{ ...styles.tab, ...(tab === key ? styles.tabActive : {}) }}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "offers" && (
          <div className="offers-grid" style={styles.grid}>
            <div style={styles.cardDark}>
              <h2 style={{ marginTop: 0 }}>Редактор на оферта</h2>

              <div className="two-grid" style={styles.rowGrid2}>
                <Field label="Номер на оферта">
                  <input style={styles.input} value={currentOffer.number} onChange={(e) => setCurrentOffer((p) => ({ ...p, number: e.target.value }))} />
                </Field>
                <Field label="Дата">
                  <input style={styles.input} type="date" value={currentOffer.date} onChange={(e) => setCurrentOffer((p) => ({ ...p, date: e.target.value }))} />
                </Field>
                <Field label="Клиент">
                  <select style={styles.select} value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
                    {store.clients.map((client) => <option key={client.id} value={client.id}>{client.name}</option>)}
                  </select>
                </Field>
                <Field label="Статус">
                  <select style={styles.select} value={currentOffer.status} onChange={(e) => setCurrentOffer((p) => ({ ...p, status: e.target.value }))}>
                    {["Чернова", "Изпратена", "Приета", "Отказана"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
              </div>

              <div className="three-grid" style={{ ...styles.rowGrid3, marginTop: 16 }}>
                <div style={styles.miniCard}>
                  <Field label="Шаблон">
                    <select style={styles.select} value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)}>
                      <option value="">Избери шаблон</option>
                      {store.templates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
                    </select>
                  </Field>
                  <button style={{ ...styles.btn, width: "100%", marginTop: 8 }} onClick={applyTemplate}>Зареди шаблон</button>
                </div>

                <div style={styles.miniCard}>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Части</div>
                  <div style={{ maxHeight: 210, overflow: "auto" }}>
                    {store.partsCatalog.map((item) => (
                      <button key={item.id} style={{ ...styles.btn, width: "100%", marginBottom: 6, textAlign: "left" }} onClick={() => addCatalogItem(item)}>
                        {item.name} — {formatEUR(item.price)}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.miniCard}>
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>Труд / услуги</div>
                  <div style={{ maxHeight: 210, overflow: "auto" }}>
                    {store.servicesCatalog.map((item) => (
                      <button key={item.id} style={{ ...styles.btn, width: "100%", marginBottom: 6, textAlign: "left" }} onClick={() => addCatalogItem(item)}>
                        {item.name} — {formatEUR(item.price)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ ...styles.miniCard, marginTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ fontWeight: 700 }}>Позиции</div>
                  <button style={styles.btnPrimary} onClick={addManualItem}>Добави ред</button>
                </div>

                {currentOffer.items.length === 0 && <div style={{ color: "#a1a1aa" }}>Няма добавени позиции.</div>}

                {currentOffer.items.map((item) => {
                  const totals = lineTotals(item);
                  return (
                    <div key={item.id} style={styles.itemBox}>
                      <div className="item-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr .6fr 1fr .7fr auto", gap: 10 }}>
                        <input style={styles.input} value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} placeholder="Описание" />
                        <select style={styles.select} value={item.type} onChange={(e) => updateItem(item.id, "type", e.target.value)}>
                          <option value="part">Част</option>
                          <option value="labor">Труд</option>
                          <option value="service">Услуга</option>
                        </select>
                        <input style={styles.input} type="number" value={item.qty} onChange={(e) => updateItem(item.id, "qty", e.target.value)} />
                        <input style={styles.input} type="number" value={item.price} onChange={(e) => updateItem(item.id, "price", e.target.value)} />
                        <input style={styles.input} type="number" value={item.discount} onChange={(e) => updateItem(item.id, "discount", e.target.value)} />
                        <button style={styles.btn} onClick={() => removeItem(item.id)}>X</button>
                      </div>
                      <div style={{ marginTop: 8, textAlign: "right", color: "#fdba74", fontWeight: 700 }}>{formatEUR(totals.finalValue)}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 16 }}>
                <Field label="Бележки">
                  <textarea style={{ ...styles.input, minHeight: 100 }} value={currentOffer.notes} onChange={(e) => setCurrentOffer((p) => ({ ...p, notes: e.target.value }))} />
                </Field>
              </div>
            </div>

            <div style={styles.cardLight}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start", borderBottom: "1px solid #e5e7eb", paddingBottom: 18, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg,#fb923c,#fdba74)", color: "#111827", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontWeight: 900 }}>
                    <div>{store.company.logoTextTop}</div>
                    <div style={{ fontSize: 10, letterSpacing: 3 }}>{store.company.logoTextBottom}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 30, fontWeight: 900 }}>{store.company.name}</div>
                    <div style={{ color: "#71717a" }}>{store.company.address}</div>
                  </div>
                </div>
                <div style={styles.badge}>{currentOffer.status}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginTop: 22, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2 }}>{store.company.title}</div>
                  <div style={{ marginTop: 8, color: "#71717a" }}>№ {currentOffer.number}</div>
                  <div style={{ color: "#71717a" }}>Дата: {currentOffer.date}</div>
                </div>
                <div style={{ borderRadius: 22, background: "#18181b", color: "#fff", padding: "16px 18px" }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#d4d4d8" }}>Крайна сума</div>
                  <div style={{ fontSize: 30, fontWeight: 900 }}>{formatEUR(totals.final)}</div>
                </div>
              </div>

              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 18, padding: 16, marginTop: 18 }}>
                <div style={{ fontWeight: 700 }}>Клиент: {selectedClient?.name || "—"}</div>
                <div style={{ fontSize: 14, color: "#52525b", marginTop: 4 }}>Телефон: {selectedClient?.phone || "—"}</div>
                <div style={{ fontSize: 14, color: "#52525b" }}>Автомобил: {selectedClient?.car || "—"}</div>
                <div style={{ fontSize: 14, color: "#52525b" }}>Рег. номер: {selectedClient?.plate || "—"}</div>
              </div>

              <div style={{ overflow: "auto", borderRadius: 18, border: "1px solid #e5e7eb", marginTop: 18 }}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Описание</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Бр.</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Без отстъпка</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>Отстъпка</th>
                      <th style={{ ...styles.th, textAlign: "right" }}>С отстъпка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOffer.items.map((item) => {
                      const row = lineTotals(item);
                      return (
                        <tr key={item.id}>
                          <td style={styles.td}>{item.name || "—"}</td>
                          <td style={{ ...styles.td, textAlign: "right" }}>{item.qty}</td>
                          <td style={{ ...styles.td, textAlign: "right", color: "#a1a1aa", textDecoration: "line-through" }}>{formatEUR(row.base)}</td>
                          <td style={{ ...styles.td, textAlign: "right", color: "#ea580c", fontWeight: 700 }}>{item.discount}%</td>
                          <td style={{ ...styles.td, textAlign: "right", color: "#ea580c", fontWeight: 900 }}>{formatEUR(row.finalValue)}</td>
                        </tr>
                      );
                    })}
                    {currentOffer.items.length === 0 && (
                      <tr>
                        <td style={styles.td} colSpan={5}>Няма добавени позиции.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="summary-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 18 }}>
                <div style={{ background: "#f4f4f5", borderRadius: 18, padding: 14 }}>
                  <div style={{ fontSize: 13, color: "#71717a" }}>Редовна сума</div>
                  <div style={{ fontWeight: 800, fontSize: 22 }}>{formatEUR(totals.regular)}</div>
                </div>
                <div style={{ background: "#fff7ed", borderRadius: 18, padding: 14 }}>
                  <div style={{ fontSize: 13, color: "#71717a" }}>Обща отстъпка</div>
                  <div style={{ fontWeight: 800, fontSize: 22, color: "#c2410c" }}>-{formatEUR(totals.discount)}</div>
                </div>
                <div style={{ background: "#ffedd5", borderRadius: 18, padding: 14 }}>
                  <div style={{ fontSize: 13, color: "#71717a" }}>Финална цена</div>
                  <div style={{ fontWeight: 900, fontSize: 22, color: "#c2410c" }}>{formatEUR(totals.final)}</div>
                </div>
              </div>

              {currentOffer.notes && (
                <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #e5e7eb" }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Бележки</div>
                  <div style={{ whiteSpace: "pre-wrap", color: "#52525b" }}>{currentOffer.notes}</div>
                </div>
              )}

              <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", color: "#71717a", fontSize: 14, gap: 12, flexWrap: "wrap" }}>
                <div>{store.company.footer}</div>
                <div>Подпис: __________________</div>
              </div>
            </div>
          </div>
        )}

        {tab === "clients" && (
          <div style={styles.cardDark}>
            <div style={{ ...styles.header, marginBottom: 16 }}>
              <h2 style={{ margin: 0 }}>Клиенти</h2>
              <button style={styles.btnPrimary} onClick={addClient}>Нов клиент</button>
            </div>

            <input
              style={{ ...styles.input, maxWidth: 420, marginBottom: 16 }}
              placeholder="Търси клиент, автомобил или номер"
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
            />

            <div className="clients-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {filteredClients.map((client) => (
                <div key={client.id} style={styles.miniCard}>
                  <div style={{ fontWeight: 800, marginBottom: 10 }}>{client.name}</div>
                  <div className="two-grid" style={styles.rowGrid2}>
                    <input style={styles.input} value={client.name} onChange={(e) => updateClient(client.id, "name", e.target.value)} placeholder="Име" />
                    <input style={styles.input} value={client.phone} onChange={(e) => updateClient(client.id, "phone", e.target.value)} placeholder="Телефон" />
                    <input style={styles.input} value={client.car} onChange={(e) => updateClient(client.id, "car", e.target.value)} placeholder="Автомобил" />
                    <input style={styles.input} value={client.plate} onChange={(e) => updateClient(client.id, "plate", e.target.value)} placeholder="Рег. номер" />
                  </div>
                  <textarea style={{ ...styles.input, minHeight: 90, marginTop: 10 }} value={client.notes} onChange={(e) => updateClient(client.id, "notes", e.target.value)} placeholder="Бележки" />
                </div>
              ))}
              {filteredClients.length === 0 && <div style={{ color: "#a1a1aa" }}>Няма намерени клиенти.</div>}
            </div>
          </div>
        )}

        {tab === "catalog" && (
          <div className="catalog-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={styles.cardDark}>
              <div style={{ ...styles.header, marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Каталог части</h2>
                <button style={styles.btnPrimary} onClick={() => addCatalogRecord("part")}>Добави част</button>
              </div>
              {store.partsCatalog.map((part) => (
                <div key={part.id} style={styles.itemBox}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
                    <input style={styles.input} value={part.name} onChange={(e) => updateCatalogRecord("part", part.id, "name", e.target.value)} />
                    <input style={styles.input} type="number" value={part.price} onChange={(e) => updateCatalogRecord("part", part.id, "price", e.target.value)} />
                    <input style={styles.input} type="number" value={part.discount} onChange={(e) => updateCatalogRecord("part", part.id, "discount", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.cardDark}>
              <div style={{ ...styles.header, marginBottom: 16 }}>
                <h2 style={{ margin: 0 }}>Каталог труд и услуги</h2>
                <button style={styles.btnPrimary} onClick={() => addCatalogRecord("service")}>Добави услуга</button>
              </div>
              {store.servicesCatalog.map((service) => (
                <div key={service.id} style={styles.itemBox}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
                    <input style={styles.input} value={service.name} onChange={(e) => updateCatalogRecord("service", service.id, "name", e.target.value)} />
                    <input style={styles.input} type="number" value={service.price} onChange={(e) => updateCatalogRecord("service", service.id, "price", e.target.value)} />
                    <input style={styles.input} type="number" value={service.discount} onChange={(e) => updateCatalogRecord("service", service.id, "discount", e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "history" && (
          <div style={styles.cardDark}>
            <h2 style={{ marginTop: 0 }}>История на офертите</h2>
            <input
              style={{ ...styles.input, maxWidth: 420, marginBottom: 16 }}
              placeholder="Търси по номер или клиент"
              value={searchOffer}
              onChange={(e) => setSearchOffer(e.target.value)}
            />
            <div style={{ overflow: "auto", borderRadius: 18, border: "1px solid #3f3f46" }}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Номер</th>
                    <th style={styles.th}>Дата</th>
                    <th style={styles.th}>Клиент</th>
                    <th style={styles.th}>Статус</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Сума</th>
                    <th style={{ ...styles.th, textAlign: "right" }}>Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map((offer) => (
                    <tr key={offer.id}>
                      <td style={{ ...styles.td, color: "#fff" }}>{offer.number}</td>
                      <td style={styles.td}>{offer.date}</td>
                      <td style={styles.td}>{offer.clientName}</td>
                      <td style={styles.td}>{offer.status}</td>
                      <td style={{ ...styles.td, textAlign: "right" }}>{formatEUR(offer.finalTotal)}</td>
                      <td style={{ ...styles.td, textAlign: "right" }}>
                        <button style={styles.btn} onClick={() => loadOffer(offer)}>Отвори</button>
                      </td>
                    </tr>
                  ))}
                  {filteredOffers.length === 0 && (
                    <tr>
                      <td style={styles.td} colSpan={6}>Няма запазени оферти.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
