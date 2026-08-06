import { ImageResponse } from "next/og"

export const alt = "Web3Insight Dev Card — your proof of build"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        color: "white",
        background: "radial-gradient(circle at 20% 20%, #4c3b86 0%, #08080b 45%, #003c2b 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, color: "#b9adff", marginBottom: 28 }}>WEB3INSIGHT</div>
      <div style={{ display: "flex", fontSize: 86, fontWeight: 700, letterSpacing: -4 }}>Dev Card</div>
      <div style={{ display: "flex", fontSize: 36, color: "#d4d4d8", marginTop: 24 }}>
        Not just a profile — it&apos;s your proof of build.
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 54, fontSize: 24 }}>
        <span style={{ color: "#9f8eff" }}>Monad</span>
        <span style={{ color: "#5eead4" }}>Mantle</span>
        <span style={{ color: "#01db83" }}>OpenBuild</span>
      </div>
    </div>,
    size
  )
}
