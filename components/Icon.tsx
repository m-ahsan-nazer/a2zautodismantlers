import { iconPaths, type IconName } from "./icon-paths";

/** Icons repeated many times per page are rendered once in <IconSprite/> and referenced with <use>. */
const SPRITE: IconName[] = ["headset", "caretRight", "radio", "phone", "pin"];

export function Icon({ name, className = "ico" }: { name: IconName; className?: string }) {
  if (SPRITE.includes(name)) {
    return (
      <svg className={className} viewBox="0 0 256 256" aria-hidden="true" focusable="false">
        <use href={`#i-${name}`} />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 256 256" aria-hidden="true" focusable="false">
      <path d={iconPaths[name]} />
    </svg>
  );
}

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      {SPRITE.map((n) => (
        <symbol key={n} id={`i-${n}`} viewBox="0 0 256 256">
          <path d={iconPaths[n]} />
        </symbol>
      ))}
    </svg>
  );
}
