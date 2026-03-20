function LangToggle({ lang, setLang }) {
  return (
    <div style={{ marginLeft: "auto" }}>
      <button
        onClick={() => setLang("en")}
        style={lang === "en" ? active : btn}
      >
        EN
      </button>

      <button
        onClick={() => setLang("hi")}
        style={lang === "hi" ? active : btn}
      >
        हिन्दी
      </button>
    </div>
  );
}

export default LangToggle;

/* styles */

const btn = {
  padding: "8px 12px",
  margin: "5px",
  border: "1px solid #ccc",
  cursor: "pointer",
};

const active = {
  ...btn,
  background: "#2D6A4F",
  color: "white",
};