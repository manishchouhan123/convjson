import React from "react";

export default function Header({
  title = "ConvJSON.com",
  logo = "/ConvJSON.png",
  subtitle = "Convert · Pretty · YAML · XML",
}) {
  return (
    <header className="mw-header grad" role="banner">
      <div className="mw-header-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src={logo}
            alt={`${title} logo`}
            className="app-logo"
            style={{ height: 50, width: 50, borderRadius: 25 }}
          />

          <div>
            <div
              className="mw-title"
              style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff" }}
            >
              {title}
            </div>
            <div className="mw-sub" style={{ marginTop: 2 }}>
              {subtitle}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="mw-chip">v1.0</div>
          <div className="mw-chip">Local</div>
        </div>
      </div>

      <svg
        className="mw-wave"
        viewBox="0 0 1440 150"
        preserveAspectRatio="none"
        height="150"
        aria-hidden
      >
        <path
          fill="currentColor"
          fillOpacity="0.18"
          d="M0,96L80,112C160,128,320,160,480,149.3C640,139,800,85,960,64C1120,43,1280,53,1360,58.7L1440,64L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        />
        <path
          fill="white"
          fillOpacity="0.06"
          d="M0,64L80,80C160,96,320,128,480,138.7C640,149,800,139,960,117.3C1120,96,1280,64,1360,64L1440,64L1440,150L1360,150C1280,150,1120,150,960,150C800,150,640,150,480,150C320,150,160,150,80,150L0,150Z"
        />
      </svg>
    </header>
  );
}
