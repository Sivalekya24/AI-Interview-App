import companyLogo from "../../assets/logo/company_logo.webp";

export default function Logo({
  size = 60,
  showWordmark = true,
  dark = true,
  className = "",
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>

      <img
        src={companyLogo}
        alt="SHNOOR"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
        }}
      />

      {showWordmark && (

        <div className="leading-tight">

          <h2
            className="logo-heading font-black"
            style={{
              fontSize: "2rem",
              color: dark ? "var(--color-heading)" : "#FFFFFF",
            }}
          >
            SHNOOR
          </h2>

          <p
            className="logo-subtitle uppercase tracking-[0.35em]"
            style={{
              fontSize: "0.78rem",
              color: dark ? "var(--color-body)" : "#CBD5E1",
            }}
          >
            AI INTERVIEW PLATFORM
          </p>

        </div>

      )}

    </div>
  );
}