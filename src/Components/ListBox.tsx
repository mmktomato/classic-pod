import { clsx } from "clsx"

export const ListBox: React.FC<unknown> = () => {
  return (
    <div
      className={clsx(
        "h-full",
        "flex", "flex-col"
      )}
    >
      <div className={clsx(
        "bg-slate-200"
      )}>To Pimp a Butterfly</div>
      <ul className={clsx(
        "min-h-0", "overflow-y-scroll"
      )}>
        {/* TODO: fix this */}
        <li>Wesley's Theory (featuring George Clinton and Thundercat)</li>
        <li>For Free? (Interlude)</li>
        <li>King Kunta</li>
        <li>Institutionalized (featuring Bilal, Anna Wise and Snoop Dogg)</li>
        <li>These Walls (featuring Bilal, Anna Wise and Thundercat)</li>
        <li>U</li>
        <li>Alright</li>
        <li>For Sale? (Interlude)</li>
        <li>Momma</li>
        <li>Hood Politics</li>
        <li>How Much a Dollar Cost (featuring James Fauntleroy and Ronald Isley)</li>
        <li>Complexion (A Zulu Love) (featuring Rapsody)</li>
        <li>The Blacker the Berry</li>
        <li>You Ain't Gotta Lie (Momma Said)</li>
        <li>I</li>
        <li>Mortal Man</li>
      </ul>
    </div>
  )
}
