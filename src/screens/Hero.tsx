/** Full-bleed key art. The painted "Los geht's" pill is the real button (hotspot measured on the art). */
export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div className="screen hero">
      <div className="hero__stage">
        <img className="hero__art" src="/bg.jpg" alt="Wichteln ’26 – it has been an easy year. Ein Wichtel entspannt mit Bier im Sessel, während die Kinder herumwirbeln." draggable={false} />
        <button className="hero__hotspot" onClick={onStart} aria-label="Los geht’s">
          <span className="hero__ring" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
