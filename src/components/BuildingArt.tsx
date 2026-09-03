import type { MapObjectType } from '../game/types'

type Props = {
  type: MapObjectType
  decorative?: boolean
}

export function BuildingArt({ type, decorative = false }: Props) {
  const common = {
    viewBox: '0 0 96 96',
    'aria-hidden': decorative || undefined,
    role: decorative ? undefined : 'img',
  } as const

  if (type === 'home') {
    return (
      <svg {...common} className="building-art building-home">
        <path className="shadow" d="M13 77h72l-8 9H20z" />
        <path className="wall" d="M21 40h55v39H21z" />
        <path className="roof" d="M13 43 48 15l36 28-7 8-29-22-28 22z" />
        <path className="door" d="M42 55h14v24H42z" />
        <path className="window" d="M27 53h11v12H27zm34 0h10v12H61z" />
        <circle className="door-knob" cx="52" cy="67" r="1.7" />
      </svg>
    )
  }

  if (type === 'bakery') {
    return (
      <svg {...common} className="building-art building-bakery">
        <path className="shadow" d="M10 79h76l-8 8H19z" />
        <path className="wall" d="M17 38h62v42H17z" />
        <path className="roof" d="M14 28h68l-6 16H20z" />
        <path className="awning-a" d="M18 38h12l-2 11H17z" />
        <path className="awning-b" d="M30 38h12v11H28z" />
        <path className="awning-a" d="M42 38h12v11H42z" />
        <path className="awning-b" d="M54 38h12l2 11H54z" />
        <path className="awning-a" d="M66 38h12l1 11H68z" />
        <path className="door" d="M58 55h13v25H58z" />
        <path className="window" d="M25 55h26v16H25z" />
        <path className="bread" d="M31 64c1-7 13-7 14 0z" />
      </svg>
    )
  }

  if (type === 'park') {
    return (
      <svg {...common} className="building-art building-park">
        <path className="grass" d="M10 75c12-10 25-4 37-7 14-4 25-8 39 6l-7 12H18z" />
        <path className="trunk" d="M43 42h10v37H43z" />
        <circle className="leaf-a" cx="35" cy="39" r="18" />
        <circle className="leaf-b" cx="55" cy="32" r="21" />
        <circle className="leaf-c" cx="66" cy="48" r="16" />
        <path className="bench" d="M20 67h25v6H20zm3 6h4v8h-4zm14 0h4v8h-4z" />
      </svg>
    )
  }

  if (type === 'road') {
    return (
      <svg {...common} className="building-art building-road">
        <path className="road" d="M6 27h84v50H6z" />
        <path className="road-edge" d="M6 27h84v7H6zm0 43h84v7H6z" />
        <path className="road-line" d="M12 49h18v6H12zm28 0h18v6H40zm28 0h16v6H68z" />
      </svg>
    )
  }

  if (type === 'pharmacy') {
    return (
      <svg {...common} className="building-art building-pharmacy">
        <path className="shadow" d="M12 79h73l-8 8H20z" />
        <path className="wall" d="M18 33h61v47H18z" />
        <path className="sign" d="M13 23h70v20H13z" />
        <path className="cross" d="M43 25h10v5h6v9h-6v5H43v-5h-6v-9h6z" />
        <path className="door" d="M56 54h15v26H56z" />
        <path className="window" d="M26 54h23v17H26z" />
      </svg>
    )
  }

  if (type === 'clinic') {
    return (
      <svg {...common} className="building-art building-clinic">
        <path className="shadow" d="M8 79h80l-8 8H17z" />
        <path className="wall" d="M14 29h68v51H14z" />
        <path className="roof" d="M11 22h74v13H11z" />
        <path className="cross" d="M44 35h9v8h8v9h-8v8h-9v-8h-8v-9h8z" />
        <path className="door" d="M38 62h21v18H38z" />
        <path className="window" d="M21 42h11v13H21zm43 0h11v13H64z" />
      </svg>
    )
  }

  if (type === 'busStop') {
    return (
      <svg {...common} className="building-art building-stop">
        <path className="ground" d="M12 80h74l-7 7H19z" />
        <path className="post" d="M69 22h7v59h-7z" />
        <circle className="sign" cx="72.5" cy="24" r="12" />
        <path className="sign-mark" d="M67 17h11v14H67z" />
        <path className="shelter" d="M20 38h43v8H20z" />
        <path className="glass" d="M24 46h35v26H24z" />
        <path className="bench" d="M29 62h26v6H29zm2 6h4v10h-4zm18 0h4v10h-4z" />
      </svg>
    )
  }

  if (type === 'bench') {
    return (
      <svg {...common} className="building-art building-bench">
        <ellipse className="ground" cx="48" cy="79" rx="38" ry="9" />
        <path className="wood" d="M17 44h62v12H17zm4 18h54v11H21z" />
        <path className="metal" d="M23 55h6v28h-6zm44 0h6v28h-6zM14 72h68v6H14z" />
        <path className="shine" d="M22 47h51v3H22z" />
      </svg>
    )
  }

  if (type === 'lamp') {
    return (
      <svg {...common} className="building-art building-lamp">
        <ellipse className="ground" cx="48" cy="83" rx="25" ry="7" />
        <path className="post" d="M44 31h8v50h-8z" />
        <path className="base" d="M35 78h26v8H35z" />
        <path className="cap" d="M31 23h34l-6 11H37z" />
        <path className="light" d="M37 32h22v22H37z" />
        <circle className="glow" cx="48" cy="43" r="22" />
      </svg>
    )
  }

  if (type === 'flowerBed') {
    return (
      <svg {...common} className="building-art building-flowerbed">
        <ellipse className="soil" cx="48" cy="70" rx="39" ry="17" />
        {[25, 42, 59, 75].map((x, index) => (
          <g key={x} className={`flower flower-${index}`}>
            <path className="stem" d={`M${x} 72V${42 + (index % 2) * 7}`} />
            <circle className="petal" cx={x} cy={40 + (index % 2) * 7} r="8" />
            <circle className="heart" cx={x} cy={40 + (index % 2) * 7} r="3" />
          </g>
        ))}
      </svg>
    )
  }

  if (type === 'marketStall') {
    return (
      <svg {...common} className="building-art building-stall">
        <ellipse className="ground" cx="48" cy="82" rx="40" ry="8" />
        <path className="counter" d="M17 54h62v25H17z" />
        <path className="post" d="M18 31h6v49h-6zm54 0h6v49h-6z" />
        <path className="awning" d="M12 27h72l-7 24H19z" />
        <path className="stripe" d="M28 27h13l-2 24H25zm27 0h13l3 24H57z" />
        <circle className="produce produce-a" cx="34" cy="62" r="5" />
        <circle className="produce produce-b" cx="48" cy="64" r="5" />
        <circle className="produce produce-c" cx="62" cy="61" r="5" />
      </svg>
    )
  }

  if (type === 'entrance') {
    return (
      <svg {...common} className="building-art building-entrance">
        <path className="ground" d="M8 78h80l-9 9H17z" />
        <path className="post" d="M19 29h9v52h-9zm49 0h9v52h-9z" />
        <path className="arch" d="M18 27c12-18 47-18 60 0v14h-9V30c-10-12-32-12-42 0v11h-9z" />
        <path className="sign" d="M27 31h42v19H27z" />
        <path className="sign-mark" d="M35 38h26v5H35z" />
        <path className="flower" d="M10 68c8-9 15-4 20 5-7 3-14 4-20-5zm76 0c-8-9-15-4-20 5 7 3 14 4 20-5z" />
      </svg>
    )
  }

  return (
    <svg {...common} className="building-art building-square">
      <path className="ground" d="M9 77 49 54l38 22-39 15z" />
      <path className="base" d="M34 54h29v24H34z" />
      <path className="water" d="M39 58h19v9H39z" />
      <path className="fountain" d="M46 29h6v31h-6z" />
      <path className="splash" d="M29 53c4-17 11-26 19-26s16 9 20 26h-6c-4-12-8-18-14-18s-10 6-13 18z" />
    </svg>
  )
}
