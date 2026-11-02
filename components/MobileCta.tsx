import { site } from "@/lib/site";
import { Icon } from "./Icon";

/** Sticky call and quote bar on phones. Always visible, so no inert handling needed. */
export function MobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 gap-2 border-t border-white/10 bg-coal p-2 shadow-[0_-4px_16px_rgba(0,0,0,0.25)] md:hidden">
      <a href={site.phone.href} className="btn-amber px-2">
        <Icon name="phone" />
        Call now
      </a>
      <a href="#quote" className="btn-red px-2">
        Free quote
      </a>
    </div>
  );
}
