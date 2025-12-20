import { useMemo, useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("inscription"); // inscription | planning
  const [step, setStep] = useState(1);

  // ÉTAPE 1 — Présence (jours)
  const [days, setDays] = useState({ wed: false, thu: false, fri: false, sat: false, sun: false });

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

  const ALL_SPORTS = [
    "Football à 7 — Jeu 14, 9h (Terrain 14 Arboras)",
    "Tennis de table — Jeu 14, 10h (Gymnase lycée des Eucalyptus)",
    "Pétanque — Ven 15, 9h (Boulodrome Henri Bernard)",
    "Badminton double — Sam 16, 9h (UFR Staps)",
    "Basket 3x3 — Sam 16, 13h (UFR Staps)",
  ];

  // Tarifs
  const SPORT_UNIT_PRICE = 25;

  const PACKS = [
    {
      id: "pack1",
      label: "Pack N°1 : Basket 3x3 + Badminton double",
      price: 29,
      type: "fixed",
      sports: [
        "Basket 3x3 — Sam 16, 13h (UFR Staps)",
        "Badminton double — Sam 16, 9h (UFR Staps)",
      ],
      note: "Sports imposés, même lieu UFR Staps",
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
      label: "Pack N°4 : Je m'inscris à tous les sports",
      price: 36,
      type: "fixed",
      sports: [
        "Basket 3x3 — Sam 16, 13h (UFR Staps)",
        "Badminton double — Sam 16, 9h (UFR Staps)",
        "Pétanque — Ven 15, 9h (Boulodrome Henri Bernard)",
        "Football à 7 — Jeu 14, 9h (Terrain 14 Arboras)",
        "Tennis de table — Jeu 14, 10h (Gymnase lycée des Eucalyptus)",
      ],
      note: "Tous les sports du planning",
    },
  ];

  // Événements (avec tes précisions)
  const EVENTS = [
    { id: "wed-rallye", label: "Rallye urbain (Centre LGBTQIA+)", place: "Centre LGBTQIA+", price: 8, day: "wed", start: "14h00", end: "16h00" },
    { id: "wed-welcome", label: "Soirée d’accueil des participantes", place: "Centre LGBTQIA+", price: 0, day: "wed", start: "17h00", end: "20h00" },
    { id: "thu-karaoke", label: "Karaoké", place: "Croque Bedaine", price: 5, day: "thu", start: "19h00", end: "21h00" },
    { id: "thu-fri-sortie", label: "Sortie culturelle : Rando - Balade - Visite", place: "Lieu à préciser", price: 5, days: ["thu", "fri"], start: "", end: "" },
    { id: "fri-activelles", label: "Soirée Activ’elles", place: "Centre LGBTQIA+", price: 0, day: "fri", start: "19h00", end: "22h00" },
    { id: "fri-atelier", label: "Atelier participatif « Comment développer des clubs sportifs plus inclusifs ? »", place: "Centre LGBTQIA+", price: 0, day: "fri", start: "19h00", end: "21h00" },
    { id: "fri-before", label: "Soirée jeux en before ? (baby-foot ? Bar Ozz ou autre)", place: "Lieu à confirmer", price: 0, day: "fri", start: "", end: "" },
    { id: "fri-cantine", label: "Soirée à la Cantine de Jo ? (Anne et Muriel)", place: "Lieu à confirmer", price: 0, day: "fri", start: "", end: "" },
    { id: "fri-fullgirlz", label: "Soirée Full Girlz", place: "Kosma ou Glam (à confirmer)", price: 0, day: "fri", start: "23h30", end: "02h30" },
    { id: "sat-bigparty", label: "Big Soirée de clôture WISDIN", place: "Lieu à déterminer", price: 15, day: "sat", start: "20h00", end: "02h00" },
    { id: "sun-course", label: "Course solidaire au château (sous réserve)", place: "Château", price: 4, day: "sun", start: "12h00", end: "12h45" },
    { id: "sun-games", label: "Jeux au château", place: "Château", price: 0, day: "sun", start: "12h30", end: "14h00" },
    { id: "sun-buffet", label: "Buffet offert par la Ville de Nice", place: "Château", price: 0, day: "sun", start: "13h00", end: "14h30" },
    { id: "sun-cloture", label: "Clôture WISDIN", place: "Château", price: 0, day: "sun", start: "16h00", end: "17h00" },
  ];

  const SCHEDULE = {
    wed: [
      { time: "14h00", timeEnd: "16h00", title: "Rallye urbain", place: "Départ/arrivée Centre LGBTQIA+", type: "event" },
      { time: "17h00", timeEnd: "20h00", title: "Soirée d’accueil des participantes", place: "Centre LGBTQIA+", type: "event" },
    ],
    thu: [
      { time: "09h00", timeEnd: "11h00", title: "Football à 7", place: "Terrain 14 des Arboras", type: "sport" },
      { time: "10h00", timeEnd: "12h00", title: "Tennis de table", place: "Gymnase du lycée des Eucalyptus", type: "sport" },
      { time: "À préciser", timeEnd: "", title: "Sortie culturelle : Rando - Balade - Visite", place: "Lieu à préciser", type: "event" },
      { time: "19h00", timeEnd: "21h00", title: "Karaoké", place: "Croque Bedaine", type: "event" },
    ],
    fri: [
      { time: "09h00", timeEnd: "12h00", title: "Pétanque", place: "Boulodrome Henri Bernard", type: "sport" },
      { time: "19h00", timeEnd: "22h00", title: "Soirée Activ’elles", place: "Centre LGBTQIA+", type: "event" },
      { time: "19h00", timeEnd: "21h00", title: "Atelier participatif « clubs sportifs plus inclusifs »", place: "Centre LGBTQIA+", type: "event" },
      { time: "À préciser", timeEnd: "", title: "Sortie culturelle : Rando - Balade - Visite", place: "Lieu à préciser", type: "event" },
      { time: "À préciser", timeEnd: "", title: "Soirée jeux en before ? Baby-foot ? Bar Ozz ou autre", place: "Lieu à confirmer", type: "event" },
      { time: "À préciser", timeEnd: "", title: "Soirée à la Cantine de Jo ? (avec Anne et Muriel)", place: "Lieu à confirmer", type: "event" },
      { time: "23h30", timeEnd: "02h30", title: "Soirée Full Girlz", place: "Kosma ou Glam (à confirmer)", type: "event" },
    ],
    sat: [
      { time: "09h00", timeEnd: "12h00", title: "Badminton double", place: "UFR Staps", type: "sport" },
      { time: "13h00", timeEnd: "15h00", title: "Basket 3x3", place: "UFR Staps", type: "sport" },
      { time: "20h00", timeEnd: "02h00", title: "Big Soirée de clôture WISDIN", place: "Lieu à déterminer", type: "event" },
    ],
    sun: [
      { time: "12h00", timeEnd: "12h45", title: "Course solidaire (sous réserve)", place: "Château", type: "event" },
      { time: "12h30", timeEnd: "14h00", title: "Jeux au château", place: "Château", type: "event" },
      { time: "13h00", timeEnd: "14h30", title: "Buffet offert par la Ville de Nice", place: "Château", type: "event" },
      { time: "16h00", timeEnd: "17h00", title: "Clôture WISDIN", place: "Château", type: "event" },
    ],
  };

  const DAY_LABEL = {
    wed: "Mercredi",
    thu: "Jeudi",
    fri: "Vendredi",
    sat: "Samedi",
    sun: "Dimanche",
    tbd: "À définir",
    thu_fri: "Jeudi et Vendredi",
  };

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

  const isBadmintonSelected = selectedSports.some((s) => s.toLowerCase().includes("badminton"));

  // Visible events selon présence (tbd toujours visible; dimanche toujours visible)
  const visibleEvents = useMemo(() => {
    return EVENTS.filter((e) => {
      if (e.day === "tbd" || e.days === "tbd") return true;
      const eventDays = Array.isArray(e.days) ? e.days : e.day ? [e.day] : [];
      if (eventDays.includes("sun")) return true;
      if (eventDays.includes("wed")) return days.wed;
      if (eventDays.includes("thu")) return days.thu;
      if (eventDays.includes("fri")) return days.fri;
      if (eventDays.includes("sat")) return days.sat;
      if (eventDays.includes("sun")) return days.sun;
      if (e.day === "wed") return days.wed;
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

  const ScheduleDay = ({ dayKey }) => (
    <div style={styles.scheduleDay}>
      <div style={styles.scheduleDayHeader}>{DAY_LABEL[dayKey]}</div>
      {(SCHEDULE[dayKey] || []).map((item, idx) => (
        <div key={`${dayKey}-${idx}`} style={styles.scheduleItem}>
          <div style={styles.scheduleTime}>
            {item.timeEnd ? `${item.time} – ${item.timeEnd}` : item.time}
          </div>
          <div style={styles.scheduleInfo}>
            <div style={styles.scheduleTitle}>{item.title}</div>
            <div style={styles.schedulePlace}>{item.place}</div>
          </div>
          <span
            style={{
              ...styles.badge,
              background: item.type === "sport" ? "#0d6efd" : "#f97316",
              color: "#fff",
            }}
          >
            {item.type === "sport" ? "Sport" : "Événement"}
          </span>
        </div>
      ))}
    </div>
  );

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

        <div style={styles.tabRow}>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(activeTab === "inscription" ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab("inscription")}
          >
            Inscription
          </button>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(activeTab === "planning" ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab("planning")}
          >
            Emploi du temps
          </button>
        </div>

        {activeTab === "planning" ? (
          <>
            <h2 style={styles.h2}>Emploi du temps complet</h2>
            <p style={styles.helper}>
              Tous les sports et événements avec horaires, jours et lieux. Les éléments “à préciser” sont à confirmer.
            </p>

            {["wed", "thu", "fri", "sat", "sun"].map((day) => (
              <ScheduleDay key={day} dayKey={day} />
            ))}
          </>
        ) : (
          <>
            {/* ÉTAPE 1 — PRÉSENCE */}
            {step === 1 && (
              <>
                <h2 style={styles.h2}>1. Présence</h2>
                <p style={styles.helper}>
                  Sélectionne les jours où tu seras présente (ça filtre les options, repas, etc.).
                </p>

                {[
                  { key: "wed", label: "Mercredi" },
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

            <Section title="💳 Tarif d’inscription">
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
                    <span style={styles.miniNote}>
                      {" • "}
                      {(() => {
                        const d = Array.isArray(e.days) ? e.days : e.day ? [e.day] : [];
                        const dayLabel =
                          d.length === 0
                            ? "Jour à préciser"
                            : d.map((k) => DAY_LABEL[k] || k).join(" & ");
                        const time =
                          e.start || e.end
                            ? `${e.start || "Horaire à préciser"}${e.end ? ` – ${e.end}` : ""}`
                            : "Horaire à préciser";
                        return `${dayLabel} • ${time}`;
                      })()}
                    </span>
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

                <Section title="🏅 Sports sélectionnés">
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
                <Section title="🏸 Badminton">
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
                  {!(days.thu || days.fri || days.sat || days.sun) ? (
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
                  {days.sun && (
                    <div style={styles.recapLine}>
                      <strong>Dimanche :</strong> {MEAL_LABEL[mealByDay.sun]}
                    </div>
                  )}
                </Section>

            <Section title="✅ Total">
              <div style={{ fontSize: 20, fontWeight: 900 }}>{total}€</div>
              <div style={styles.helper}>
                Voilà pour le site proto, ensuite let's go continuer vers HelloAsso pour le terminal de paiement...
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

  tabRow: {
    display: "flex",
    gap: 10,
    marginTop: 10,
    marginBottom: 6,
  },

  tabBtn: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid #e5e5e5",
    background: "#fff",
    color: "#111",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 16,
  },

  tabBtnActive: {
    border: "1px solid #111",
    background: "#111",
    color: "#fff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },

  scheduleDay: {
    border: "1px solid #eee",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    background: "#fafafa",
  },
  scheduleDayHeader: { fontWeight: 900, fontSize: 17, marginBottom: 10, color: "#111" },
  scheduleItem: {
    display: "grid",
    gridTemplateColumns: "80px 1fr auto",
    alignItems: "center",
    gap: 12,
    background: "#fff",
    border: "1px solid #eaeaea",
    borderRadius: 12,
    padding: "10px 12px",
    marginBottom: 10,
  },
  scheduleTime: { fontWeight: 900, color: "#111", fontSize: 16 },
  scheduleInfo: { display: "flex", flexDirection: "column", gap: 4 },
  scheduleTitle: { fontSize: 16, fontWeight: 800, color: "#111" },
  schedulePlace: { fontSize: 14, color: "#666" },
  badge: {
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 12,
  },
};
