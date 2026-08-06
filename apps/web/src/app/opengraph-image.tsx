import { ImageResponse } from "next/og"

export const alt = "Web3Insight | AI-Powered Web3 Developer Analytics Platform"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #08111f 0%, #102a43 60%, #0b4f6c 100%)",
        color: "white",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "80px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "28px", maxWidth: "980px" }}>
        <div style={{ color: "#5eead4", display: "flex", fontSize: 34, fontWeight: 700 }}>
          Web3Insight
        </div>
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.08 }}>
          AI-powered Web3 developer analytics
        </div>
        <div style={{ color: "#cbd5e1", display: "flex", fontSize: 30, lineHeight: 1.35 }}>
          Discover developers. Analyze ecosystems. Track growth.
        </div>
      </div>
    </div>,
    size,
  )
}
