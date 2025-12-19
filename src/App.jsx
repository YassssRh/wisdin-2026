import { useMemo, useState } from "react";

export default function App() {
  const [step, setStep] = useState(1);

  // ÉTAPE 1 — Présence (jours)
  const [days, setDays] = useState({ thu: false, fri: false, sat: false, sun: false });

  // ÉTAPE 2 — Tarif (pack / à la carte)
  const [tariffMode, setTariffMode] = useState("pack"); // "pack" | "alacarte"
  const [selectedPack, setSelectedPack] = useState("pack4"); // pack1/pack2/pack3/pack4
  const [packSportsPick, setPackSportsPick] = useState([]); // pour pack2/pack3
  const [sportsAlaCarte, setSportsAlaCarte] = useState([]);

  // ÉTAPE 2 — Événements
  const [events, setEvents] = useState([]);

  // ÉTAPE 3 — Options (badminton)
  const [badmintonLevel, setBadmintonLevel] = useState("");
  const [needPartner, setNeedPartner] = useState(false);
  const [partnerName, setPartnerName] = useState("");

  // ÉTAPE 3 — Repas (1 choix par jour)
  const [mealByDay, setMealByDay] = useState({ thu: "", fri: "", sat: "" , sun: "" });

  const ALL_SPORTS = ["Basket 🏀 ", "Badminton 🏸", "Pétanque 𓂂⚪", "Football ⚽"];

  // Tarifs
  const SPORT_UNIT_PRICE = 25;

  const PACKS = [
    {
      id: "pack1",
      label: "Pack N°1 : Tournoi de Basket + Badminton",
      price: 29,
      type: "fixed",
      sports: ["Basket", "Badminton"],
      note: "Sports imposés",
    },
    {
      id: "pack2",
      label: "Pack N°2 : Je m'inscris à 2 sports",
      price: 32,
      type: "pick",
      pick: 2,
      note: "Choisir exactement 2 sports",
    },
    {
      id: "pack3",
      label: "Pack N°3 : Je m'inscris à 3 sports",
      price: 34,
      type: "pick",
      pick: 3,
      note: "Choisir exactement 3 sports",
    },
    {
      id: "pack4",
      label: "Pack N°4 : Je m'inscris à 4 sports",
      price: 36,
      type: "fixed",
      sports: ["Basket", "Badminton", "Pétanque", "Football"],
      note: "Tous les sports",
    },
  ];

  // Événements (avec tes précisions)
  const EVENTS = [
    { id: "Rallye urbain", label: "Rallye urbain ", price: 8, day: "tbd" },
    { id: "Course solidaire", label: "Course solidaire ", price: 4, day: "sun" },
    { id: "Soirée", label: "Soirée ", price: 10, day: "sat" },
    { id: "Karaoké", label: "Karaoké ", price: 5, day: "thu" },
    { id: "Atelier participatif", label: "Atelier participatif ", price: 0, day: "fri" },
    { id: "Sortie culturelle", label: "Sortie culturelle ", price: 5, day: "thu_fri" },
    { id: "Olympiade", label: "Olympiade ", price: 5, day: "sun" },

  ];

  const DAY_LABEL = { thu: "Jeudi", fri: "Vendredi", sat: "Samedi", sun: "Dimanche", tbd: "À définir", thu_fri: "Jeudi et Vendredi" };

  // Repas
  const MEAL_PRICES = { poulet: 9, vege: 9, pan: 9, "": 0 };
  const MEAL_LABEL = {
    "": "Aucun",
    poulet: "Repas complet au poulet (9€)",
    vege: "Repas complet végé (9€)",
    pan: "Repas complet avec pan bagnat (9€)",
  };

  // Helpers
  const toggle = (list, value, setList) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const packObj = useMemo(() => PACKS.find((p) => p.id === selectedPack), [selectedPack]);

  const selectedSports = useMemo(() => {
    if (tariffMode === "alacarte") return sportsAlaCarte;

    // pack mode
    if (!packObj) return [];
    if (packObj.type === "fixed") return packObj.sports;
    return packSportsPick;
  }, [tariffMode, sportsAlaCarte, packObj, packSportsPick]);

  const isBadmintonSelected = selectedSports.includes("Badminton");

  // Visible events selon présence (tbd toujours visible; dimanche toujours visible)
  const visibleEvents = useMemo(() => {
    return EVENTS.filter((e) => {
      if (e.day === "tbd") return true;
      if (e.day === "sun") return true;
      if (e.day === "thu") return days.thu;
      if (e.day === "fri") return days.fri;
      if (e.day === "sat") return days.sat;
      if (e.day === "sun") return days.sun;
      return true;
    });
  }, [days]);

  // Nettoyages quand on change de mode tarif / pack
  const setMode = (mode) => {
    setTariffMode(mode);
    // Optionnel : ne pas tout effacer, mais on garde propre
    if (mode === "alacarte") {
      setSelectedPack("pack4");
      setPackSportsPick([]);
    } else {
      setSportsAlaCarte([]);
    }
  };

  const setPack = (packId) => {
    setSelectedPack(packId);
    const p = PACKS.find((x) => x.id === packId);
    if (!p) return;
    if (p.type === "fixed") {
      setPackSportsPick([]);
    } else {
      // si on passe de 3 à 2 sports, on tronque
      setPackSportsPick((prev) => prev.slice(0, p.pick));
    }
  };

  const togglePackPickSport = (sport) => {
    if (!packObj || packObj.type !== "pick") return;

    setPackSportsPick((prev) => {
      const exists = prev.includes(sport);
      if (exists) return prev.filter((s) => s !== sport);
      if (prev.length >= packObj.pick) return prev; // bloque
      return [...prev, sport];
    });
  };

  // Prix tarif
  const tariffPrice = useMemo(() => {
    if (tariffMode === "alacarte") return sportsAlaCarte.length * SPORT_UNIT_PRICE;
    const p = PACKS.find((x) => x.id === selectedPack);
    return p ? p.price : 0;
  }, [tariffMode, sportsAlaCarte, selectedPack]);

  // Validations pack pick
  const packPickOk = useMemo(() => {
    if (tariffMode !== "pack") return true;
    if (!packObj) return false;
    if (packObj.type === "fixed") return true;
    return packSportsPick.length === packObj.pick;
  }, [tariffMode, packObj, packSportsPick]);

  // Total
  const total = useMemo(() => {
    let sum = 0;

    // tarif (pack ou à la carte)
    sum += tariffPrice;

    // events
    for (const ev of events) {
      const found = EVENTS.find((e) => e.id === ev);
      if (found) sum += found.price || 0;
    }

    // meals
    if (days.thu) sum += MEAL_PRICES[mealByDay.thu] || 0;
    if (days.fri) sum += MEAL_PRICES[mealByDay.fri] || 0;
    if (days.sat) sum += MEAL_PRICES[mealByDay.sat] || 0;
    if (days.sun) sum += MEAL_PRICES[mealByDay.sun] || 0;


    return sum;
  }, [tariffPrice, events, days, mealByDay]);

  // UI components
  const Section = ({ title, note, children }) => (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <div style={styles.sectionTitle}>{title}</div>
          {note ? <div style={styles.sectionNote}>{note}</div> : null}
        </div>
      </div>
      <div style={styles.sectionBody}>{children}</div>
    </div>
  );

  const DayMealPicker = ({ dayKey }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={styles.dayTitle}>{DAY_LABEL[dayKey]}</div>
      {["", "poulet", "vege", "pan"].map((v) => (
        <label key={`${dayKey}-${v}`} style={styles.radioOption}>
          <input
            type="radio"
            name={`meal-${dayKey}`}
            checked={mealByDay[dayKey] === v}
            onChange={() => setMealByDay((m) => ({ ...m, [dayKey]: v }))}
          />
          <span style={{ flex: 1 }}>{MEAL_LABEL[v]}</span>
        </label>
      ))}
    </div>
  );

  const canGoStep3 = useMemo(() => {
    if (tariffMode === "pack") return packPickOk;
    // à la carte : on autorise même si 0 sport, à toi de voir
    return true;
  }, [tariffMode, packPickOk]);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>WISDIN 2026</h1>
            <p style={styles.subtitle}>Inscription – proto</p>
          </div>

          <div style={styles.totalPill}>
            <div style={styles.totalLabel}>Total</div>
            <div style={styles.totalValue}>
              {step === 1 ? "0€" : `${total}€`}
            </div>
          </div>
        </div>

        {/* ÉTAPE 1 — PRÉSENCE */}
        {step === 1 && (
          <>
            <h2 style={styles.h2}>1. Présence</h2>
            <p style={styles.helper}>
              Sélectionne les jours où tu seras présente (ça filtre les options, repas, etc.).
            </p>

            {[
              { key: "thu", label: "Jeudi" },
              { key: "fri", label: "Vendredi" },
              { key: "sat", label: "Samedi" },
              { key: "sun", label: "Dimanche" },
            ].map((d) => (
              <label key={d.key} style={styles.option}>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={days[d.key]}
                  onChange={() => setDays((x) => ({ ...x, [d.key]: !x[d.key] }))}
                />
                <span>{d.label}</span>
              </label>
            ))}

            <button style={styles.button} onClick={() => setStep(2)}>
              Suivant
            </button>
          </>
        )}

        {/* ÉTAPE 2 — TARIFS + EVENTS */}
        {step === 2 && (
          <>
            <h2 style={styles.h2}>2. Tarifs, sports & événements</h2>

            <Section title="💳 Tarif d’inscription" note="Choisis un pack OU l’inscription à la carte">
              <div style={styles.modeRow}>
                <button
                  type="button"
                  onClick={() => setMode("pack")}
                  style={{
                    ...styles.modeBtn,
                    ...(tariffMode === "pack" ? styles.modeBtnActive : {}),
                  }}
                >
                  Packs
                </button>
                <button
                  type="button"
                  onClick={() => setMode("alacarte")}
                  style={{
                    ...styles.modeBtn,
                    ...(tariffMode === "alacarte" ? styles.modeBtnActive : {}),
                  }}
                >
                  À la carte
                </button>
              </div>

              {tariffMode === "pack" ? (
                <>
                  {PACKS.map((p) => (
                    <label key={p.id} style={styles.option}>
                      <input
                        type="radio"
                        name="pack"
                        checked={selectedPack === p.id}
                        onChange={() => setPack(p.id)}
                      />
                      <span style={{ flex: 1 }}>
                        <strong>{p.label}</strong>
                        <span style={styles.miniNote}> • {p.note}</span>
                      </span>
                      <span style={styles.priceTag}>{p.price}€</span>
                    </label>
                  ))}

                  {packObj?.type === "pick" && (
                    <div style={styles.block}>
                      <div style={{ fontWeight: 800, marginBottom: 8 }}>
                        Choisis {packObj.pick} sports ({packSportsPick.length}/{packObj.pick})
                      </div>

                      {ALL_SPORTS.map((s) => {
                        const checked = packSportsPick.includes(s);
                        const disabled = !checked && packSportsPick.length >= packObj.pick;

                        return (
                          <label
                            key={`pick-${s}`}
                            style={{
                              ...styles.option,
                              opacity: disabled ? 0.55 : 1,
                              cursor: disabled ? "not-allowed" : "pointer",
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={disabled}
                              onChange={() => togglePackPickSport(s)}
                            />
                            <span style={{ flex: 1 }}>{s}</span>
                          </label>
                        );
                      })}

                      {!packPickOk && (
                        <div style={{ ...styles.helper, marginTop: 8 }}>
                          ⚠️ Tu dois sélectionner exactement {packObj.pick} sports pour ce pack.
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={styles.helper}>
                    À la carte : {SPORT_UNIT_PRICE}€ par sport.
                  </div>

                  {ALL_SPORTS.map((s) => (
                    <label key={`a-${s}`} style={styles.option}>
                      <input
                        type="checkbox"
                        style={styles.checkbox}
                        checked={sportsAlaCarte.includes(s)}
                        onChange={() => toggle(sportsAlaCarte, s, setSportsAlaCarte)}
                      />
                      <span style={{ flex: 1 }}>{s}</span>
                      <span style={styles.priceTag}>{SPORT_UNIT_PRICE}€</span>
                    </label>
                  ))}
                </>
              )}
            </Section>

            <Section title="🎉 Événements" note=".        ">
              {visibleEvents.map((e) => (
                <label key={e.id} style={styles.option}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={events.includes(e.id)}
                    onChange={() => toggle(events, e.id, setEvents)}
                  />
                  <span style={{ flex: 1 }}>
                    {e.label}
                    <span style={styles.miniNote}> • {e.day === "tbd" ? "à définir" : DAY_LABEL[e.day]}</span>
                  </span>
                  <span style={styles.priceTag}>{e.price === 0 ? "Gratuit" : `${e.price}€`}</span>
                </label>
              ))}
            </Section>

            <div style={styles.nav}>
              <button style={styles.secondary} onClick={() => setStep(1)}>
                Retour
              </button>
              <button
                style={{
                  ...styles.button,
                  opacity: canGoStep3 ? 1 : 0.55,
                  cursor: canGoStep3 ? "pointer" : "not-allowed",
                }}
                disabled={!canGoStep3}
                onClick={() => setStep(3)}
              >
                Suivant
              </button>
            </div>
          </>
        )}

        {/* ÉTAPE 3 — OPTIONS */}
        {step === 3 && (
          <>
            <h2 style={styles.h2}>3. Options</h2>

            <Section
              title="🏅 Sports sélectionnés"
              //note={tariffMode === "pack" ? "Issus du pack choisi" : "Issus de la sélection à la carte"}
            >
              <div style={styles.recapLine}>
                <strong>Sports :</strong> {selectedSports.join(", ") || "Aucun"}
              </div>
              <div style={styles.recapLine}>
                <strong>Tarif :</strong>{" "}
                {tariffMode === "pack"
                  ? PACKS.find((p) => p.id === selectedPack)?.label
                  : "À la carte"}
                {" — "}
                <strong>{tariffPrice}€</strong>
              </div>
            </Section>

            {/* BADMINTON */}
            <Section
              title="🏸 Badminton"
              //note={isBadmintonSelected ? "Option visible car Badminton sélectionné" : "Non sélectionné"}
            >
              {isBadmintonSelected ? (
                <div style={styles.block}>
                  <div style={styles.formRow}>
                    <div style={styles.fieldLabel}>Niveau</div>

                    <div style={styles.selectWrap}>
                      <select
                        value={badmintonLevel}
                        onChange={(e) => setBadmintonLevel(e.target.value)}
                        style={styles.select}
                      >
                        <option value="">Choisir un niveau</option>
                        <option>Débutant</option>
                        <option>Intermédiaire</option>
                        <option>Très bon niveau</option>
                      </select>
                      <span style={styles.selectArrow}>▾</span>
                    </div>
                  </div>

                  <label style={styles.option}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={needPartner}
                      onChange={() => setNeedPartner(!needPartner)}
                    />
                    <span>J’ai besoin d’une partenaire</span>
                  </label>

                  {needPartner && (
                    <>
                      <input
                        style={styles.input}
                        placeholder="Nom de la partenaire (optionnel)"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                      />
                      <div style={styles.helper}>
                        Si tu n’as pas encore de partenaire, laisse vide : l’orga pourra aider au matching.
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p style={styles.muted}>(Aucune option badminton)</p>
              )}
            </Section>

            {/* REPAS */}
            <Section title="🍽️ Repas" note="  ">
              {!days.thu && !days.fri && !days.sat ? (
                <p style={styles.muted}>(Aucun jour sélectionné — choisis tes jours à l’étape 1)</p>
              ) : (
                <>
                  {days.thu && <DayMealPicker dayKey="thu" />}
                  {days.fri && <DayMealPicker dayKey="fri" />}
                  {days.sat && <DayMealPicker dayKey="sat" />}
                  {days.sun && <DayMealPicker dayKey="sun" />}


                  <div style={styles.helper}>
                    Tu peux sélectionner un repas différent chaque jour si tu es présente plusieurs jours.
                  </div>
                </>
              )}
            </Section>

            <div style={styles.nav}>
              <button style={styles.secondary} onClick={() => setStep(2)}>
                Retour
              </button>
              <button style={styles.button} onClick={() => setStep(4)}>
                Récap
              </button>
            </div>
          </>
        )}

        {/* ÉTAPE 4 — RÉCAP */}
        {step === 4 && (
          <>
            <h2 style={styles.h2}>Récapitulatif</h2>

            <Section title="📅 Présence">
              <div style={styles.recapLine}>
                <strong>Jours :</strong>{" "}
                {Object.entries(days)
                  .filter(([, v]) => v)
                  .map(([k]) => DAY_LABEL[k])
                  .join(", ") || "Aucun"}
              </div>
            </Section>

            <Section title="💳 Tarif">
              <div style={styles.recapLine}>
                <strong>Mode :</strong> {tariffMode === "pack" ? "Pack" : "À la carte"}
              </div>
              <div style={styles.recapLine}>
                <strong>Choix :</strong>{" "}
                {tariffMode === "pack"
                  ? PACKS.find((p) => p.id === selectedPack)?.label
                  : `À la carte (${SPORT_UNIT_PRICE}€ / sport)`}
              </div>
              <div style={styles.recapLine}>
                <strong>Sports :</strong> {selectedSports.join(", ") || "Aucun"}
              </div>
              <div style={styles.recapLine}>
                <strong>Sous-total tarif :</strong> {tariffPrice}€
              </div>
            </Section>

            <Section title="🎉 Événements">
              <div style={styles.recapLine}>
                <strong>Événements :</strong>{" "}
                {events.map((id) => EVENTS.find((e) => e.id === id)?.label || id).join(", ") || "Aucun"}
              </div>
            </Section>

            <Section title="🏸 Badminton (options)">
              {isBadmintonSelected ? (
                <>
                  <div style={styles.recapLine}>
                    <strong>Niveau :</strong> {badmintonLevel || "—"}
                  </div>
                  <div style={styles.recapLine}>
                    <strong>Partenaire :</strong> {needPartner ? partnerName || "à trouver" : "non"}
                  </div>
                </>
              ) : (
                <div style={styles.muted}>(Badminton non sélectionné)</div>
              )}
            </Section>

            <Section title="🍽️ Repas">
              {days.thu && (
                <div style={styles.recapLine}>
                  <strong>Jeudi :</strong> {MEAL_LABEL[mealByDay.thu]}
                </div>
              )}
              {days.fri && (
                <div style={styles.recapLine}>
                  <strong>Vendredi :</strong> {MEAL_LABEL[mealByDay.fri]}
                </div>
              )}
              {days.sat && (
                <div style={styles.recapLine}>
                  <strong>Samedi :</strong> {MEAL_LABEL[mealByDay.sat]}
                </div>
              )}
            </Section>

            <Section title="✅ Total">
              <div style={{ fontSize: 20, fontWeight: 900 }}>{total}€</div>
              <div style={styles.helper}>
                MVP : ensuite on pourra continuer vers paiement, HelloAsso, etc...
              </div>
            </Section>

            <div style={styles.nav}>
              <button style={styles.secondary} onClick={() => setStep(3)}>
                Retour
              </button>
              <button style={styles.button} onClick={() => alert("Valider (MVP) — à brancher plus tard 🙂")}>
                Valider
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    minHeight: "100vh",
    background: "#f6f6f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },

  card: {
    background: "#fff",
    borderRadius: 20,
    padding: 28,
    maxWidth: 980,
    width: "100%",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    color: "#111",
  },

  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 8,
  },

  title: { margin: 0, fontSize: 46, color: "#111", letterSpacing: -0.5 },
  subtitle: { color: "#555", marginTop: 8, marginBottom: 10 },

  totalPill: {
    border: "1px solid #eee",
    background: "#fafafa",
    borderRadius: 16,
    padding: "10px 12px",
    minWidth: 110,
    textAlign: "right",
  },
  totalLabel: { fontSize: 12, color: "#777", fontWeight: 700 },
  totalValue: { fontSize: 20, fontWeight: 900, color: "#111" },

  h2: { marginTop: 18, marginBottom: 10 },

  section: {
    border: "1px solid #eee",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    background: "#fafafa",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { fontWeight: 900, fontSize: 16, color: "#111" },
  sectionNote: { fontSize: 13, color: "#666", marginTop: 2 },
  sectionBody: {},

  option: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    color: "#111",
    fontSize: 17,
    background: "#fff",
    border: "1px solid #e9e9e9",
    borderRadius: 14,
    padding: "10px 12px",
  },

  checkbox: { width: 18, height: 18 },

  priceTag: { fontWeight: 900, color: "#111" },
  miniNote: { color: "#777", fontSize: 13 },

  block: {
    padding: 12,
    background: "#fff",
    borderRadius: 14,
    border: "1px solid #e9e9e9",
  },

  button: {
    marginTop: 14,
    padding: "12px 18px",
    background: "#111",
    color: "white",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 800,
  },

  secondary: {
    background: "#e5e5e5",
    color: "#111",
    padding: "12px 18px",
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    cursor: "pointer",
    fontWeight: 800,
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },

  muted: { color: "#888", fontStyle: "italic" },

  helper: { color: "#666", fontSize: 14, marginTop: 6 },

  recapLine: { padding: "6px 0", color: "#111" },

  formRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
    marginBottom: 14,
  },

  fieldLabel: {
    minWidth: 90,
    color: "#111",
    fontSize: 18,
    fontWeight: 700,
  },

  selectWrap: {
    position: "relative",
    display: "inline-block",
    flex: 1,
    maxWidth: 320,
  },

  select: {
    width: "100%",
    padding: "10px 38px 10px 12px",
    fontSize: 16,
    borderRadius: 12,
    border: "1px solid #d6d6d6",
    color: "#111",
    backgroundColor: "#fff",
    appearance: "none",
    WebkitAppearance: "none",
    MozAppearance: "none",
    outline: "none",
  },

  selectArrow: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    color: "#777",
    fontSize: 16,
  },

  input: {
    width: "100%",
    maxWidth: 360,
    padding: "10px 12px",
    fontSize: 16,
    borderRadius: 12,
    border: "1px solid #d6d6d6",
    backgroundColor: "#fff",
    color: "#111",
    outline: "none",
    marginTop: 10,
  },

  dayTitle: { fontWeight: 900, marginBottom: 8 },

  radioOption: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    background: "#fff",
    border: "1px solid #e5e5e5",
    borderRadius: 12,
    padding: "10px 12px",
  },

  modeRow: {
    display: "flex",
    gap: 10,
    marginBottom: 12,
  },

  modeBtn: {
    flex: 1,
    borderRadius: 12,
    padding: "10px 12px",
    border: "1px solid #e5e5e5",
    background: "#fff",
    color: "#111",          
    cursor: "pointer",
    fontWeight: 900,
  },

  modeBtnActive: {
    border: "1px solid #111",
    background: "#111",
    color: "#fff",
  },

};
