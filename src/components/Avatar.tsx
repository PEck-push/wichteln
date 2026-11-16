import { useState } from 'react'
import { CHARACTERS, type Person } from '../characters'

/** Character portrait; until the real picture is dropped in, a festive monogram stands in. */
export function Avatar({ person, size = 96, className = '' }: { person: Person; size?: number; className?: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <span className={`avatar ${className}`} style={{ width: size, height: size }}>
      {failed ? (
        <span className="avatar__mono display" style={{ fontSize: size * 0.5 }} aria-hidden="true">
          {person[0]}
        </span>
      ) : (
        <img src={CHARACTERS[person].image} alt="" width={size} height={size} onError={() => setFailed(true)} draggable={false} />
      )}
    </span>
  )
}
