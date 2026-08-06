import { ImageResponse } from "next/og";

export const alt = "Web3Insight Web3 Analytics Dashboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "88px",
          color: "#f8fafa",
          background: "linear-gradient(135deg, #0a0d0d 0%, #123a38 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#67e8d2" }}>
          WEB3 DEVELOPER INTELLIGENCE
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 86,
            fontWeight: 700,
            letterSpacing: "-3px",
          }}
        >
          Web3Insight
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            maxWidth: 900,
            fontSize: 36,
            lineHeight: 1.35,
            color: "#c8d5d3",
          }}
        >
          Transparent ecosystem, repository, developer, and event analytics.
        </div>
      </div>
    ),
    size,
  );
}
