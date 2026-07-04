import Link from "next/link";
import { site } from "@/lib/site";
import Icon from "@/components/Icon";

export default function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-[3px] border-ink bg-bone p-2.5 lg:hidden">
      <div className="mx-auto flex max-w-md gap-2.5">
        <a href={site.phoneHref} className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-ink py-3 text-sm font-extrabold text-ink">
          <Icon name="phone" className="h-4 w-4" /> Call
        </a>
        <Link href="/#quote" className="flex flex-[1.4] items-center justify-center rounded-full border-2 border-ink bg-green py-3 text-sm font-extrabold text-ink">
          Get my free price
        </Link>
      </div>
    </div>
  );
}