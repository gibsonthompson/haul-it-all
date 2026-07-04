import ImagePlaceholder from "@/components/ImagePlaceholder";

export default function BeforeAfter() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="relative">
        <span className="absolute left-3 top-3 z-10 rounded-full border-2 border-ink bg-bone px-3 py-1 text-xs font-extrabold text-ink">Before</span>
        <ImagePlaceholder label="Cluttered garage" icon="garage" tone="bone" className="aspect-[4/3] w-full" />
      </div>
      <div className="relative">
        <span className="absolute left-3 top-3 z-10 rounded-full border-2 border-ink bg-green px-3 py-1 text-xs font-extrabold text-ink">After</span>
        <ImagePlaceholder label="Clean & swept" icon="check" tone="green" className="aspect-[4/3] w-full" />
      </div>
    </div>
  );
}