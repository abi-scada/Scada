import { useEffect, useRef } from "react";
import NET from "vanta/dist/vanta.net.min";
import * as THREE from "three";

export default function VantaNet({ lineColor, dotColor, opacity }) {
  const vantaRef = useRef(null);       // DOM element
  const vantaEffect = useRef(null);    // Vanta instance

  useEffect(() => {
    if (!vantaRef.current) return;

    // 🔥 destroy previous effect
    if (vantaEffect.current) {
      vantaEffect.current.destroy();
      vantaEffect.current = null;
    }

    // 🔁 create new effect
    vantaEffect.current = NET({
      el: vantaRef.current,
      THREE,

      color: dotColor,
      lineColor: lineColor,

      backgroundAlpha: 0,
      points: 10,
      spacing: 23,
      maxDistance: 1,
    });

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, [lineColor, dotColor]);

  return (
    <div
      ref={vantaRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: opacity,
      }}
    />
  );
}
