import companyLogo from "../../assets/logo/company_logo.jpg";

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
            className={`font-black ${
              dark ? "text-slate-900" : "text-white"
            }`}
            style={{
              fontSize: "2rem",
            }}
          >
            SHNOOR
          </h2>

          <p
            className={`uppercase tracking-[0.35em] ${
              dark ? "text-slate-500" : "text-slate-300"
            }`}
            style={{
              fontSize: "0.78rem",
            }}
          >
            AI INTERVIEW PLATFORM
          </p>

        </div>

      )}

    </div>
  );
}