import { useMemo, useState } from "react";

export default function App() {
  const [activeTab, setActiveTab] = useState("home"); // home | presentation | inscription | planning | map | sports | activites | soirees | contacts
  const [step, setStep] = useState(1);
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false);
  const [copyHint, setCopyHint] = useState("");

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
  const [partnerChoice, setPartnerChoice] = useState(""); // "have" | "need"
  const [partnerName, setPartnerName] = useState("");

  // ÉTAPE 3 — Repas (1 choix par jour)
  const [mealByDay, setMealByDay] = useState({ thu: "", fri: "", sat: "" , sun: "" });

  const ALL_SPORTS = [
    "Football à 7 — Jeudi 14 à 9h (Terrain 14 Arboras)",
    "Tennis de table — Jeudi 14 à 10h (Gymnase lycée des Eucalyptus)",
    "Pétanque — Vendredi 15 à 9h (Boulodrome Henri Bernard)",
    "Badminton double — Samedi 16 à 9h (UFR Staps)",
    "Basket 3x3 — Samedi 16 à 13h (UFR Staps)",
  ];

  // Tarifs
  const SPORT_UNIT_PRICE = 20;
  const HELLOASSO_URL = "https://www.helloasso.com/associations/caram-elles/evenements/inscription-wisdin-2026";
  const LOGO_URL = "/wisdin-logo.png"; // placer le logo dans /public/wisdin-logo.png
  const CARAMELLES_LOGO = "/partners/caramelles.png"; // placé dans /public/partners
  const PARTNERS = [
    { name: "Département des Alpes-Maritimes", logo: "/partners/departement-alpes-maritimes.png" },
    { name: "Ville de Nice", logo: "/partners/ville-de-nice.png" },
    { name: "Union Européenne", logo: "/partners/eu-cofunded.png" },
    { name: "València Gay Games XII 2026", logo: "/partners/valencia-gay-games.png" },
    { name: "Full Girlz", logo: "/partners/fully-girlz.jpeg" },
    { name: "Fédération Sportive LGBT+", logo: "/partners/federation-sportive-lgbt.png" },
    { name: "Centre LGBTQIA+ Côte d’Azur", logo: "/partners/centre-lgbtqia.png" },
    { name: "Le Croque Bedaine", logo: "/partners/croque-bedaine.jpg" },
    { name: "Engie Home Services", logo: "/partners/engie-home-services.png" },
    { name: "Begaym", logo: "/partners/begaym.webp" },
  ];
  const LOCATIONS = [
    { name: "Centre LGBTQIA+", address: "Rue Cathy Richeux, 06300 Nice" },
    { name: "Football", address: "Parc 14 RSSI Football, 261 Bd du Mercantour, 06200 Nice" },
    { name: "Le Croque Bedaine", address: "22 Av. Saint-Jean-Baptiste, 06000 Nice" },
    { name: "Pétanque", address: "183 Rte de Grenoble, 06200 Nice" },
    { name: "Tennis de table", address: "14 Bd des Eucalyptus, 06200 Nice" },
    { name: "Badminton, Basket", address: "261 Bd du Mercantour, 06200 Nice" },
    { name: "Château", address: "Proche Comptoir des Anges, Quai Rauba Capeu, 06300 Nice" },
  ];
  const SPORTS_INFO = [
    {
      name: "Badminton double",
      description: "Tournoi de badminton en double",
      img: "/photos_sports/Bad.png",
    },
    {
      name: "Football à 7",
      description: "Tournoi de foot à 7 joueuses sur gazon synthétique au stade N°14 des Arboras",
      img: "/photos_sports/Foot.png",
    },
    {
      name: "Pétanque",
      description: "Tournoi de pétanque. Pétanque en triplette au boulodrome Henri Bernard",
      img: "/photos_sports/Pétanque.png",
    },
    {
      name: "Tennis de table",
      description: "Tournoi de tennis de table (Gymnase du lycée des Eucalyptus)",
      img: null, // placeholder pour ajout futur
    },
    {
      name: "Basket 3x3",
      description: "Tournoi de basket 3x3",
      img: null, // placeholder pour ajout futur
    },
  ];

  const ACTIVITIES_INFO = [
    {
      name: "Rallye urbain",
      description:
        "Point de départ et d'arrivée au Centre LGBTQIA+ (123 rue de Roquebillière). Rdv 13h30. Course d’orientation à travers Nice : indices à photographier, questions des bénévoles dans un temps imparti.",
      img: "/photos_activités/Rallye.png",
    },
    {
      name: "Sortie culturelle : Rando - Balade - Visite",
      description: "Balade/rando/visite sur Nice — lieu et horaire à préciser.",
      img: null,
    },
    {
      name: "Atelier participatif",
      description: "Atelier participatif (vendredi 19h, Centre LGBTQIA+, thème à préciser).",
      img: null,
    },
    {
      name: "Olympiades",
      description:
        "Dimanche 17 mai, 12h-15h30 au château. Jeux/épreuves conviviales. Rassemblement sur l'esplanade des Arcades du Château à partir de 12h00.",
      img: "/photos_activités/Course_solidaire.png",
    },
  ];

  const PACKS = [
    {
      id: "pack1",
      label: "Pack N°1 : Basket 3x3 + Badminton double",
      price: 25,
      type: "fixed",
      sports: [
        "Basket 3x3 — Samedi 16 à 13h (UFR Staps)",
        "Badminton double — Samedi 16 à 9h (UFR Staps)",
      ],
      note: "Sports imposés, même lieu UFR Staps",
    },
    {
      id: "pack2",
      label: "Pack N°2 : Je m'inscris à 2 sports",
      price: 30,
      type: "pick",
      pick: 2,
      note: "Choisir exactement 2 sports",
    },
    {
      id: "pack3",
      label: "Pack N°3 : Je m'inscris à 3 sports",
      price: 32,
      type: "pick",
      pick: 3,
      note: "Choisir exactement 3 sports",
    },
    {
      id: "pack4",
      label: "Pack N°4 : Je m'inscris à 4 sports",
      price: 34,
      type: "pick",
      pick: 4,
      note: "Choisir exactement 4 sports (Foot OU Tennis de table, pas les deux)",
    },
  ];

  // Événements (avec tes précisions)
  const EVENTS = [
    { id: "wed-rallye", label: "Rallye urbain (Centre LGBTQIA+)", place: "Centre LGBTQIA+", price: 8, day: "wed", start: "13h30", end: "16h30" },
    { id: "wed-welcome", label: "Soirée d’accueil des participantes", place: "Centre LGBTQIA+", price: 0, day: "wed", start: "17h00", end: "22h00" },
    { id: "thu-karaoke", label: "Karaoké", place: "Croque Bedaine", price: 5, day: "thu", start: "19h00", end: "00h00" },
    { id: "thu-fri-sortie", label: "Sortie culturelle : Rando - Balade - Visite", place: "Lieu à préciser", price: 5, days: ["thu", "fri"], start: "", end: "" },
    { id: "fri-atelier", label: "Atelier participatif", place: "Centre LGBTQIA+", price: 0, day: "fri", start: "19h00", end: "22h00" },
    { id: "fri-fullgirlz", label: "Soirée Full Girlz (payante sur place)", place: "Kosma ou Glam (à confirmer)", price: 0, day: "fri", start: "23h30", end: "04h00" },
    { id: "sat-bigparty", label: "Big Soirée de clôture WISDIN", place: "Lieu à déterminer", price: 15, day: "sat", start: "20h00", end: "02h00" },
    { id: "sun-olympiades", label: "Olympiades au château", place: "Château", price: 5, day: "sun", start: "12h00", end: "15h30" },
    { id: "sun-buffet", label: "Buffet offert par la Ville de Nice", place: "Château", price: 0, day: "sun", start: "12h00", end: "" },
    { id: "sun-cloture", label: "Clôture WISDIN", place: "Château", price: 0, day: "sun", start: "16h00", end: "" },
  ];
  const EVENT_ACTIVITY_IDS = ["wed-rallye", "thu-fri-sortie", "fri-atelier", "sun-olympiades"];
  const EVENT_SOIREE_IDS = ["wed-welcome", "thu-karaoke", "fri-fullgirlz", "sat-bigparty"];

  const SCHEDULE = {
    wed: [
      { time: "13h30", timeEnd: "16h30", title: "Rallye urbain", place: "Départ/arrivée Centre LGBTQIA+", type: "activite" },
      { time: "17h00", timeEnd: "22h00", title: "Soirée d’accueil des participantes", place: "Centre LGBTQIA+", type: "soiree" },
    ],
    thu: [
      { time: "09h00", timeEnd: "16h00", title: "Football à 7", place: "Terrain 14 des Arboras", type: "sport" },
      { time: "10h00", timeEnd: "15h00", title: "Tennis de table", place: "Gymnase du lycée des Eucalyptus", type: "sport" },
      { time: "À préciser", timeEnd: "", title: "Sortie culturelle : Rando - Balade - Visite", place: "Lieu à préciser", type: "activite" },
      { time: "19h00", timeEnd: "00h00", title: "Karaoké", place: "Croque Bedaine", type: "soiree" },
    ],
    fri: [
      { time: "09h00", timeEnd: "16h00", title: "Pétanque", place: "Boulodrome Henri Bernard", type: "sport" },
      { time: "19h00", timeEnd: "22h00", title: "Atelier participatif (thème à préciser)", place: "Centre LGBTQIA+", type: "activite" },
      { time: "À préciser", timeEnd: "", title: "Sortie culturelle : Rando - Balade - Visite", place: "Lieu à préciser", type: "activite" },
      { time: "23h30", timeEnd: "04h00", title: "Soirée Full Girlz (payante sur place)", place: "Kosma ou Glam (à confirmer)", type: "soiree" },
    ],
    sat: [
      { time: "09h00", timeEnd: "12h00", title: "Badminton double", place: "UFR Staps", type: "sport" },
      { time: "13h00", timeEnd: "16h00", title: "Basket 3x3", place: "UFR Staps", type: "sport" },
      { time: "20h00", timeEnd: "02h00", title: "Big Soirée de clôture WISDIN", place: "Lieu à déterminer", type: "soiree" },
    ],
    sun: [
      { time: "12h00", timeEnd: "", title: "Buffet offert par la Ville de Nice", place: "Château", type: "commun" },
      { time: "12h00", timeEnd: "15h30", title: "Olympiades au château", place: "Château", type: "activite" },
      { time: "16h00", timeEnd: "", title: "Clôture WISDIN", place: "Château", type: "commun" },
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
    const isFoot = sport.toLowerCase().includes("football");
    const isTennis = sport.toLowerCase().includes("tennis de table");
    setPackSportsPick((prev) => {
      const exists = prev.includes(sport);
      if (exists) return prev.filter((s) => s !== sport);
      // blocage foot vs tennis
      if (isFoot && prev.some((s) => s.toLowerCase().includes("tennis de table"))) return prev;
      if (isTennis && prev.some((s) => s.toLowerCase().includes("football"))) return prev;
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

    const hasSport = selectedSports.length > 0;
    const hasPaidEventSelected = events.some((id) => {
      const found = EVENTS.find((e) => e.id === id);
      return found && (found.price || 0) > 0;
    });
    const paidActivityEligible = hasSport || hasPaidEventSelected;

    // tarif (pack ou à la carte)
    sum += tariffPrice;

    // events avec règles spécifiques
    for (const ev of events) {
      const found = EVENTS.find((e) => e.id === ev);
      if (!found) continue;
      let price = found.price || 0;
      if (found.id === "thu-fri-sortie" && hasSport) price = 0;
      if (found.id === "sun-olympiades" && hasSport) price = 0;
      if (found.id === "thu-karaoke" && paidActivityEligible) price = 0;
      if (found.id === "fri-fullgirlz") price = 0; // payant sur place
      sum += price;
    }

    // meals (pas de repas dimanche)
    if (days.thu) sum += MEAL_PRICES[mealByDay.thu] || 0;
    if (days.fri) sum += MEAL_PRICES[mealByDay.fri] || 0;
    if (days.sat) sum += MEAL_PRICES[mealByDay.sat] || 0;

    return sum;
  }, [tariffPrice, events, days, mealByDay, selectedSports]);

  const goToHelloAsso = () => {
    setShowPaymentPrompt(true);
  };

  const openHelloAsso = () => {
    window.open(HELLOASSO_URL, "_blank");
    setShowPaymentPrompt(false);
  };

  const copyAmount = async () => {
    try {
      await navigator.clipboard.writeText(`${total}`);
    } catch (e) {
      // ignore clipboard errors silently
    }
  };

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
              ...(item.type === "sport"
                ? { background: "#0d6efd", color: "#fff" }
                : item.type === "soiree"
                ? { background: "#f97316", color: "#fff" }
                : item.type === "activite"
                ? { background: "#23a559", color: "#fff" }
                : { display: "none" }),
            }}
          >
            {item.type === "sport"
              ? "Sport"
              : item.type === "soiree"
              ? "Soirée"
              : item.type === "activite"
              ? "Activité"
              : ""}
          </span>
        </div>
      ))}
    </div>
  );

  const LocationCard = ({ name, address }) => {
    const openMaps = () => {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(url, "_blank");
    };

    const copyAddress = async () => {
      try {
        await navigator.clipboard.writeText(address);
        setCopyHint(name);
        setTimeout(() => setCopyHint(""), 1600);
      } catch (e) {
        // ignore
      }
    };

    return (
      <div style={styles.locationCard}>
        <div>
          <div style={styles.locationTitle}>{name}</div>
          <div style={styles.locationAddress}>{address}</div>
          {copyHint === name && <div style={styles.copyHint}>Adresse copiée dans le presse-papiers</div>}
        </div>
        <div style={styles.locationActions}>
          <button style={styles.secondary} onClick={copyAddress}>
            Copier
          </button>
          <button style={styles.button} onClick={openMaps}>
            Ouvrir Maps
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div style={styles.headerLeft}>
            <img
              src={LOGO_URL}
              alt="Logo WISDIN"
              style={styles.logo}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <div>
              <h1 style={styles.title}>WISDIN 2026</h1>
              <p style={styles.subtitle}>Women International Sports Days In Nice</p>
            </div>
          </div>

          {activeTab === "inscription" && (
            <div style={styles.totalPill}>
              <div style={styles.totalLabel}>Total</div>
              <div style={styles.totalValue}>
                {step === 1 ? "0€" : `${total}€`}
              </div>
            </div>
          )}
        </div>

        <div style={styles.tabRow}>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(activeTab === "home" ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab("home")}
          >
            Accueil
          </button>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(activeTab === "presentation" ? styles.tabBtnActive : {}), minWidth: 180 }}
            onClick={() => setActiveTab("presentation")}
          >
            Présentation
          </button>
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
            Programme
          </button>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(activeTab === "map" ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab("map")}
          >
            Carte
          </button>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(activeTab === "sports" ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab("sports")}
          >
            Sports
          </button>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(activeTab === "activites" ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab("activites")}
          >
            Activités
          </button>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(activeTab === "soirees" ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab("soirees")}
          >
            Soirées
          </button>
          <button
            type="button"
            style={{ ...styles.tabBtn, ...(activeTab === "contacts" ? styles.tabBtnActive : {}) }}
            onClick={() => setActiveTab("contacts")}
          >
            Contacts
          </button>
        </div>

        {activeTab === "home" ? (
          <>
            <div style={styles.hero}>
              <div>
                <div style={styles.heroBadge}>13 — 17 mai 2026 · Nice</div>
                <h2 style={styles.heroTitle}>Une nouvelle édition de WISDIN se prépare !</h2>
                <div style={styles.heroSubtitle}>Women International Sports Days In Nice</div>
                <p style={styles.heroText}>
                  Caram'elles est heureuse de présenter la 4ème édition des Rencontres Internationales Sportives
                  Féminines de Nice. Sport, convivialité, respect et découverte de la ville.
                </p>
                <button style={styles.button} onClick={() => setActiveTab("inscription")}>
                  Commencer l’inscription
                </button>
              </div>
              <div style={{ ...styles.heroCircle, backgroundImage: `url(${CARAMELLES_LOGO})` }} />
            </div>

            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <div style={styles.sectionTitle}>Partenaires WISDIN</div>
              </div>
              <div style={styles.partnerGrid}>
                {PARTNERS.map((p) => (
                  <div key={p.name} style={styles.partnerCard}>
                    {p.logo ? (
                      <img
                        src={p.logo}
                        alt={p.name}
                        style={styles.partnerLogo}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : null}
                    <div>{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : activeTab === "presentation" ? (
          <>
            <h2 style={styles.h2}>À propos de WISDIN 2026</h2>
            <p style={{ ...styles.helper, fontWeight: 800 }}>
              WISDIN, ce sont avant tout des rencontres et non une réelle compétition. But : partager un maximum
              d’activités sportives et culturelles dans un univers de femmes et en toute sécurité.
            </p>
            <div style={styles.presentationMedia}>
              <img
                src="/partners/Photo présentation .png"
                alt="Groupe Caram'elles"
                style={styles.presentationImg}
              />
            </div>
            <div style={styles.presentationGrid}>
              <div style={styles.presentationCol}>
                <div style={styles.presBlockTitle}>But</div>
                <ul style={styles.presList}>
                  <li>Lutter contre les discriminations.</li>
                  <li>Promouvoir les droits des femmes, l’égalité et la diversité.</li>
                  <li>Faciliter l’inclusion par le sport.</li>
                  <li>Rendre visibles les femmes dans le sport.</li>
                  <li>Permettre aux femmes de tout âge et conditions de participer.</li>
                  <li>Découvrir Nice et les Alpes-Maritimes dans un cadre inclusif.</li>
                </ul>
              </div>
              <div style={styles.presentationCol}>
                <div style={styles.presBlockTitle}>Bénéficiaires</div>
                <ul style={styles.presList}>
                  <li>Plus de 1000 personnes concernées : joueuses, visiteuses.</li>
                  <li>Femmes de tout âge, majoritairement lesbiennes et lesb-friendly.</li>
                  <li>Personnes transgenres, non binaires et indéterminées bienvenues.</li>
                </ul>
                <div style={{ marginTop: 14 }}>
                  <div style={styles.presBlockTitle}>Territoire</div>
                  <p style={styles.presParagraph}>
                    Rencontres organisées dans la Ville de Nice, accueillant des participantes de la région PACA, de la
                    France, de l’Europe, et du reste du monde.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === "planning" ? (
          <>
            <h2 style={styles.h2}>Programme complet</h2>

            {["wed", "thu", "fri", "sat", "sun"].map((day) => (
              <ScheduleDay key={day} dayKey={day} />
            ))}
          </>
        ) : activeTab === "map" ? (
          <>
            {LOCATIONS.map((loc) => (
              <LocationCard key={loc.name} name={loc.name} address={loc.address} />
            ))}
          </>
        ) : activeTab === "sports" ? (
          <>
            <h2 style={styles.h2}>Sports du programme</h2>
            <Section title="Liste des sports">
              <div style={styles.infoGrid}>
                {SPORTS_INFO.map((s) => (
                  <div key={s.name} style={styles.infoCard}>
                    {s.img ? (
                      <img src={s.img} alt={s.name} style={styles.infoImg} />
                    ) : (
                      <div style={styles.infoNoImg}>Photo à venir</div>
                    )}
                    <div style={styles.infoTitle}>{s.name}</div>
                    <div style={styles.infoDesc}>{s.description}</div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        ) : activeTab === "activites" ? (
          <>
            <h2 style={styles.h2}>Activités</h2>
            <Section title="Activités programmées">
              <div style={styles.infoGrid}>
                {ACTIVITIES_INFO.map((a) => (
                  <div key={a.name} style={styles.infoCard}>
                    {a.img ? (
                      <img src={a.img} alt={a.name} style={styles.infoImg} />
                    ) : (
                      <div style={styles.infoNoImg}>Photo à venir</div>
                    )}
                    <div style={styles.infoTitle}>{a.name}</div>
                    <div style={styles.infoDesc}>{a.description}</div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        ) : activeTab === "soirees" ? (
          <>
            <h2 style={styles.h2}>Soirées</h2>
            <Section title="Soirées programmées">
              {EVENTS.filter((e) => EVENT_SOIREE_IDS.includes(e.id)).map((e) => (
                <div key={e.id} style={styles.recapLine}>
                  <strong>{e.label}</strong>{" "}
                  <span style={styles.miniNote}>
                    {Array.isArray(e.days) ? e.days.map((d) => DAY_LABEL[d]).join(" / ") : DAY_LABEL[e.day]}
                    {" • "}
                    {(e.start || e.end) ? `${e.start || "Horaire à préciser"}${e.end ? ` – ${e.end}` : ""}` : "Horaire à préciser"}
                  </span>
                </div>
              ))}
            </Section>
          </>
        ) : activeTab === "contacts" ? (
          <>
            <h2 style={styles.h2}>Contacts</h2>
            <Section title="Nous écrire">
              <div style={styles.recapLine}>
                Email : <a href="mailto:wisdincaramelles@gmail.com">wisdincaramelles@gmail.com</a>
              </div>
            </Section>
            <Section title="Réseaux">
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
                <a href="http://caramelles06.free.fr/sommaire.html" target="_blank" rel="noreferrer" style={styles.contactLink}>
                  <img src="/partners/caramelles.png" alt="Caram'elles" style={styles.contactIcon} />
                  <span>Site Caram'elles</span>
                </a>
                <a href="https://www.instagram.com/caramelles06/" target="_blank" rel="noreferrer" style={styles.contactLink}>
                  <span style={styles.contactEmoji}>📸</span>
                  <span>Instagram</span>
                </a>
                <a href="https://www.facebook.com/caramelles06" target="_blank" rel="noreferrer" style={styles.contactLink}>
                  <span style={styles.contactEmoji}>📘</span>
                  <span>Facebook</span>
                </a>
              </div>
            </Section>
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

            <Section title="🏃‍♀️ Activités">
              {visibleEvents
                .filter((e) => EVENT_ACTIVITY_IDS.includes(e.id))
                .map((e) => {
                  const d = Array.isArray(e.days) ? e.days : e.day ? [e.day] : [];
                  const dayLabel =
                    d.length === 0 ? "Jour à préciser" : d.map((k) => DAY_LABEL[k] || k).join(" & ");
                  const time =
                    e.start || e.end
                      ? `${e.start || "Horaire à préciser"}${e.end ? ` – ${e.end}` : ""}`
                      : "Horaire à préciser";

                  const hasSport = selectedSports.length > 0;
                  let priceText = e.price === 0 ? "Gratuit" : `${e.price}€`;
                  if (e.id === "thu-fri-sortie" && hasSport) priceText = "Inclus si inscrite à un sport";
                  if (e.id === "sun-olympiades" && hasSport) priceText = "Inclus si inscrite à un sport";

                  return (
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
                          {dayLabel} • {time}
                        </span>
                      </span>
                      <span style={styles.priceTag}>{priceText}</span>
                    </label>
                  );
                })}
            </Section>

            <Section title="🌙 Soirées">
              {visibleEvents
                .filter((e) => EVENT_SOIREE_IDS.includes(e.id))
                .map((e) => {
                  const d = Array.isArray(e.days) ? e.days : e.day ? [e.day] : [];
                  const dayLabel =
                    d.length === 0 ? "Jour à préciser" : d.map((k) => DAY_LABEL[k] || k).join(" & ");
                  const time =
                    e.start || e.end
                      ? `${e.start || "Horaire à préciser"}${e.end ? ` – ${e.end}` : ""}`
                      : "Horaire à préciser";

                  const hasSport = selectedSports.length > 0;
                  const hasPaidEventSelected = events.some((id) => {
                    const found = EVENTS.find((evt) => evt.id === id);
                    return found && (found.price || 0) > 0;
                  });
                  const paidActivityEligible = hasSport || hasPaidEventSelected;
                  let priceText = e.price === 0 ? "Gratuit" : `${e.price}€`;
                  if (e.id === "thu-karaoke") priceText = paidActivityEligible ? "Inclus si inscrite à une activité payante" : "5€";
                  if (e.id === "fri-fullgirlz") priceText = "Payant sur place";

                  return (
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
                          {dayLabel} • {time}
                        </span>
                      </span>
                      <span style={styles.priceTag}>{priceText}</span>
                    </label>
                  );
                })}
            </Section>

            <Section title="🤝 Moments communs">
              {visibleEvents
                .filter(
                  (e) =>
                    !EVENT_ACTIVITY_IDS.includes(e.id) &&
                    !EVENT_SOIREE_IDS.includes(e.id)
                )
                .map((e) => {
                  const d = Array.isArray(e.days) ? e.days : e.day ? [e.day] : [];
                  const dayLabel =
                    d.length === 0 ? "Jour à préciser" : d.map((k) => DAY_LABEL[k] || k).join(" & ");
                  const time =
                    e.start || e.end
                      ? `${e.start || "Horaire à préciser"}${e.end ? ` – ${e.end}` : ""}`
                      : "Horaire à préciser";
                  let priceText = e.price === 0 ? "Gratuit" : `${e.price}€`;
                  return (
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
                          {dayLabel} • {time}
                        </span>
                      </span>
                      <span style={styles.priceTag}>{priceText}</span>
                    </label>
                  );
                })}
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
                        <option value="1">1 - Débutant (jamais joué)</option>
                        <option value="2">2 - Débutant</option>
                        <option value="3">3 - Intermédiaire</option>
                        <option value="4">4 - Bon niveau</option>
                      </select>
                      <span style={styles.selectArrow}>▾</span>
                    </div>
                  </div>

                  <div style={styles.block}>
                    <div style={styles.fieldLabel}>Partenaire</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <label style={styles.option}>
                        <input
                          type="radio"
                          name="partner-choice"
                          checked={partnerChoice === "have"}
                          onChange={() => setPartnerChoice("have")}
                        />
                        <span>J’ai une partenaire</span>
                      </label>
                      {partnerChoice === "have" && (
                        <input
                          style={styles.input}
                          placeholder="Nom de la partenaire"
                          value={partnerName}
                          onChange={(e) => setPartnerName(e.target.value)}
                        />
                      )}
                      <label style={styles.option}>
                        <input
                          type="radio"
                          name="partner-choice"
                          checked={partnerChoice === "need"}
                          onChange={() => setPartnerChoice("need")}
                        />
                        <span>J’ai besoin d’une partenaire</span>
                      </label>
                    </div>
                  </div>
                </div>
                  ) : (
                    <p style={styles.muted}>(Aucune option badminton)</p>
                  )}
                </Section>

                {/* REPAS */}
                <Section title="🍽️ Repas" note="  ">
              {!(days.thu || days.fri || days.sat) ? (
                <p style={styles.muted}>(Aucun jour sélectionné — choisis tes jours à l’étape 1)</p>
              ) : (
                <>
                  {days.thu && <DayMealPicker dayKey="thu" />}
                  {days.fri && <DayMealPicker dayKey="fri" />}
                  {days.sat && <DayMealPicker dayKey="sat" />}

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
                    <strong>Partenaire :</strong>{" "}
                    {partnerChoice === "have"
                      ? partnerName || "oui"
                      : partnerChoice === "need"
                      ? "à trouver"
                      : "non renseigné"}
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
                Voilà pour le site proto, ensuite let's go continuer vers HelloAsso pour le terminal de paiement...
              </div>
              <button style={{ ...styles.button, marginTop: 12 }} onClick={goToHelloAsso}>
                Payer sur HelloAsso
              </button>
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

        {showPaymentPrompt && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <div style={{ fontWeight: 900, fontSize: 18, marginBottom: 6 }}>Payer sur HelloAsso</div>
              <div style={styles.helper}>
                Montant à saisir sur HelloAsso : <strong>{total}€</strong>
              </div>
              <div style={styles.helper}>
                Le montant ne peut pas être pré-rempli automatiquement. Copie-le puis clique sur “Ouvrir HelloAsso”.
              </div>
              <div style={styles.modalActions}>
                <button style={styles.secondary} onClick={() => setShowPaymentPrompt(false)}>
                  Annuler
                </button>
                <button style={styles.secondary} onClick={copyAmount}>
                  Copier {total}€
                </button>
                <button style={styles.button} onClick={openHelloAsso}>
                  Ouvrir HelloAsso
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    width: "100vw",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f9c5ff 0%, #ffc9a3 20%, #f7f06d 40%, #8cf2a4 60%, #7bd1ff 80%, #c3a7ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },

  card: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 28,
    maxWidth: 1420,
    width: "100%",
    boxShadow: "0 12px 36px rgba(0,0,0,0.12)",
    color: "#111",
  },

  headerRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 8,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { width: 68, height: 68, borderRadius: "50%", objectFit: "cover", border: "2px solid #7c1111" },

  title: { margin: 0, fontSize: 54, color: "#7c1111", letterSpacing: -0.5, fontWeight: 900 },
  subtitle: { color: "#2f2f2f", marginTop: 8, marginBottom: 10, fontWeight: 700, fontSize: 17 },

  totalPill: {
    border: "1px solid #e7d9ff",
    background: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: "10px 12px",
    minWidth: 110,
    textAlign: "right",
  },
  totalLabel: { fontSize: 12, color: "#777", fontWeight: 700 },
  totalValue: { fontSize: 20, fontWeight: 900, color: "#111" },

  h2: { marginTop: 18, marginBottom: 10 },

  section: {
    border: "1px solid #e4d5ff",
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    background: "rgba(255,255,255,0.9)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: { fontWeight: 900, fontSize: 16, color: "#7c1111" },
  sectionNote: { fontSize: 13, color: "#444", marginTop: 2 },
  sectionBody: {},

  option: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
    color: "#111",
    fontSize: 17,
    background: "rgba(255,255,255,0.95)",
    border: "1px solid #e4d5ff",
    borderRadius: 14,
    padding: "10px 12px",
  },

  checkbox: { width: 18, height: 18 },

  priceTag: { fontWeight: 900, color: "#7c1111" },
  miniNote: { color: "#444", fontSize: 13 },

  block: {
    padding: 12,
    background: "rgba(255,255,255,0.95)",
    borderRadius: 14,
    border: "1px solid #e4d5ff",
  },

  button: {
    marginTop: 14,
    padding: "12px 18px",
    background: "#7c1111",
    color: "white",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 800,
  },

  secondary: {
    background: "#f3eaff",
    color: "#111",
    padding: "12px 18px",
    borderRadius: 12,
    border: "1px solid #e4d5ff",
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
    border: "1px solid #e4d5ff",
    background: "rgba(255,255,255,0.95)",
    color: "#111",
    cursor: "pointer",
    fontWeight: 900,
  },

  modeBtnActive: {
    border: "1px solid #7c1111",
    background: "#7c1111",
    color: "#fff",
  },

  tabRow: {
    display: "flex",
    gap: 14,
    marginTop: 10,
    marginBottom: 6,
    flexWrap: "nowrap",
    overflow: "hidden",
  },

  tabBtn: {
    flex: "0 1 auto",
    padding: "12px 16px",
    borderRadius: 12,
    border: "1px solid #e5e5e5",
    background: "#fff",
    color: "#111",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 14,
    minWidth: 140,
    whiteSpace: "nowrap",
    textAlign: "center",
  },

  tabBtnActive: {
    border: "1px solid #7c1111",
    background: "#7c1111",
    color: "#fff",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 20,
    alignItems: "center",
    padding: 18,
    borderRadius: 18,
    background: "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,255,255,0.7))",
    border: "1px solid #e4d5ff",
    marginBottom: 18,
  },
  heroBadge: {
    display: "inline-flex",
    padding: "10px 16px",
    background: "#7c1111",
    color: "#fff",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 15,
    marginBottom: 12,
  },
  heroTitle: { fontSize: 36, margin: "4px 0", color: "#7c1111" },
  heroSubtitle: { fontSize: 20, color: "#2f2f2f", fontWeight: 800, marginBottom: 10 },
  heroText: { color: "#333", fontSize: 16, lineHeight: 1.6 },
  heroCircle: {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,214,170,0.9), rgba(255,170,150,0.9))",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#7c1111",
    fontWeight: 900,
    fontSize: 20,
  },

  presentationGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginTop: 12,
  },
  presentationMedia: {
    width: "100%",
    marginTop: 12,
    textAlign: "center",
  },
  presentationImg: {
    width: "auto",
    maxWidth: "70%",
    height: "auto",
    objectFit: "contain",
    display: "inline-block",
    margin: "0 auto",
    display: "block",
  },
  presentationCol: {
    background: "rgba(255,255,255,0.9)",
    border: "1px solid #e4d5ff",
    borderRadius: 14,
    padding: 14,
  },
  presBlockTitle: { fontWeight: 900, color: "#7c1111", marginBottom: 8 },
  presList: { margin: 0, paddingLeft: 18, color: "#111", lineHeight: 1.5 },
  presParagraph: { margin: 0, color: "#111", lineHeight: 1.5 },

  partnerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: 14,
    marginTop: 10,
    width: "100%",
  },
  partnerCard: {
    background: "rgba(255,255,255,0.95)",
    border: "1px solid #e4d5ff",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontWeight: 800,
    color: "#7c1111",
  },
  partnerLogo: { maxWidth: "100%", maxHeight: 70, objectFit: "contain" },

  contactLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    border: "1px solid #e4d5ff",
    borderRadius: 10,
    textDecoration: "none",
    color: "#7c1111",
    fontWeight: 800,
    background: "rgba(255,255,255,0.95)",
  },
  contactIcon: { width: 38, height: 38, borderRadius: "50%", objectFit: "cover" },
  contactEmoji: { fontSize: 20 },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  infoCard: {
    background: "rgba(255,255,255,0.95)",
    border: "1px solid #e4d5ff",
    borderRadius: 12,
    padding: 12,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    textAlign: "center",
    alignItems: "center",
  },
  infoImg: {
    width: "100%",
    height: 140,
    objectFit: "cover",
    borderRadius: 10,
  },
  infoNoImg: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    background: "linear-gradient(135deg, #fbe9d7, #f7d1ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#7c1111",
    fontWeight: 800,
  },
  infoTitle: { fontWeight: 900, color: "#111", fontSize: 16 },
  infoDesc: { color: "#444", fontSize: 14, lineHeight: 1.5 },

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
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 13,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: 12,
  },
  modal: {
    background: "#fff",
    borderRadius: 14,
    padding: 16,
    maxWidth: 460,
    width: "100%",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 14,
  },

  locationCard: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    background: "#fff",
    border: "1px solid #eaeaea",
    borderRadius: 12,
    padding: "12px 14px",
    marginBottom: 10,
  },
  locationTitle: { fontWeight: 900, fontSize: 16, color: "#111" },
  locationAddress: { color: "#666", fontSize: 14 },
  locationActions: { display: "flex", gap: 8 },
  copyHint: { color: "#0a7e07", fontSize: 12, marginTop: 4, fontWeight: 700 },
};
