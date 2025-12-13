import "./LoginPage.css";

const LETTERS = [
  // Unique words for English fluency
  "Fluency",
  "Expression",
  "Articulation",
  "Clarity",
  "Confidence",
  "Dialogue",
  "Narrative",
  "Prose",
  "Eloquence",
  "Discourse",
  "Accent",
  "Intonation",
  "Pronunciation",
  "Phonetics",
  "Diction",
  "Syntax",
  "Semantics",
  "Pragmatics",
  "Rhetoric",
  "Idiom",
  "Verbs",
  "Nouns",
  "Adjectives",
  "Adverbs",
  "Prepositions",
  "Tense",
  "Voice",
  "Mood",
  "Aspect",
  "Clause",
  "Phrase",
  //   "Sentence",
  //   "Paragraph",
  //   "Essay",
  //   "Article",
  //   "Debate",
  //   "Discussion",
  //   "Interview",
  //   "Presentation",
  //   "Speech",
  //   "Novel",
  //   "Poetry",
  //   "Drama",
  //   "Fiction",
  //   "Narrative",
  //   "Context",
  //   "Inference",
  //   "Interpretation",
  //   "Analysis",
  //   "Critique",
  //   "Accent",
  //   "Dialect",
  //   "Jargon",
  "Slang",
  "Colloquial",
  "Synonym",
  "Antonym",
  "Homonym",
  "Metaphor",
  "Simile",
  "Listen",
  "Speak",
  "Write",
  "Respond",
  "Engage",
  "Improve",
  "Practice",
  "Master",
  "Achieve",
  "Succeed",
];

const COLORS = [
  "#4F46E5", // Indigo
  "#7C3AED", // Violet
  "#A855F7", // Purple
  "#EC4899", // Magenta
  "#F43F5E", // Rose
  "#EF4444", // Red
  "#F97316", // Orange
  "#FBBF24", // Amber
  "#FACC15", // Yellow
  "#84CC16", // Lime
  "#22C55E", // Green
  "#10B981", // Emerald
  "#14B8A6", // Teal
  "#06B6D4", // Cyan
  "#0EA5E9", // Sky Blue
  "#3B82F6", // Blue
  "#1E40AF", // Navy
  "#64748B", // Slate
  "#6B7280", // Gray
  "#71717A", // Zinc
  "#78716C", // Stone
  "#A3A3A3", // Neutral
  "#92888C", // Warm Gray
  "#FF6B6B", // Coral
  "#FF8C94", // Salmon
  "#FFAA88", // Peach
  "#FFD700", // Gold
  "#40E0D0", // Turquoise
  "#98FF98", // Mint
  "#E6E6FA", // Lavender
];

const randomDrift = () => {
  const dx = (Math.random() * 2 - 1) * 80; // -80vw to 80vw
  const dy = (Math.random() * 2 - 1) * 40; // -40vh to 40vh
  return { dx, dy };
};

function LoginPage({ onLogin }) {
  return (
    <div className="login-wrapper">
      <div className="floating-layer" aria-hidden="true">
        {LETTERS.map((letter, idx) => {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const delay = Math.random() * 5;
          const duration = 9 + Math.random() * 6;
          const { dx, dy } = randomDrift();
          const color = COLORS[idx % COLORS.length];
          return (
            <span
              key={letter + idx}
              className="float-letter"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                "--dx": `${dx}vw`,
                "--dy": `${dy}vh`,
                color,
                textShadow: `0 6px 20px ${color}33`,
              }}
            >
              {letter}
            </span>
          );
        })}
      </div>

      <div className="login-card">
        <img
          src="/LangFlu_Icon.png"
          alt="LangFlu logo"
          className="brand-logo"
        />
        <p className="tagline">Where consistency meets fluency</p>
        <div className="google-brand">
          <img
            src="/google_img.png"
            alt="Continue with Google"
            className="google-logo"
          />
        </div>
        <button onClick={onLogin} className="primary">
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
