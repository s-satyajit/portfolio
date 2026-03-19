import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Satyajit Samal";
  const subtitle = searchParams.get("subtitle") || "AI Engineer + Full-Stack Developer";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: "64px",
          background: "linear-gradient(135deg, #070b13 0%, #0f1728 60%, #0f1f3c 100%)",
          color: "#edf3ff",
          fontFamily: "sans-serif",
          position: "relative"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "1px solid rgba(45, 212, 255, 0.35)",
            borderRadius: "24px"
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "auto" }}>
          <p style={{ color: "#2dd4ff", fontSize: "24px", letterSpacing: "0.18em" }}>
            OFFICIAL PORTFOLIO
          </p>
          <h1 style={{ fontSize: "68px", lineHeight: 1.1, maxWidth: "940px" }}>{title}</h1>
          <p style={{ color: "#9caecc", fontSize: "30px" }}>{subtitle}</p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
