import { Html, useProgress } from "@react-three/drei";

export function LoadingOverlay() {
  const { progress, loaded, total, item, ...rest } = useProgress();

  return (
    <Html center>
      <div style={{ minWidth: 220 }}>
        <div>Carregando… {Math.round(progress)}%</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {loaded}/{total} {item ? `— ${item}` : ""}
        </div>
      </div>
    </Html>
  );
}
