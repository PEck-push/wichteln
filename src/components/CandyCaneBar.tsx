export function CandyCaneBar({ value }: { value: number }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100)
  return (
    <div className="cane" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Wird geladen">
      <div className="cane__fill" style={{ transform: `scaleX(${pct / 100})` }}>
        <div className="cane__stripes" />
        <div className="cane__gloss" />
      </div>
    </div>
  )
}
