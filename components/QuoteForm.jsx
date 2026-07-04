"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import Icon from "@/components/Icon";

const SERVICES = ["Junk removal", "Dumpster rental", "Not sure yet"];

export default function QuoteForm() {
  const [form, setForm] = useState({ name: "", phone: "", location: "", service: "Junk removal", details: "" });
  const [photos, setPhotos] = useState([]);
  const [status, setStatus] = useState("idle");
  const valid = form.name.trim() && form.phone.trim();
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!valid) return;
    setStatus("sending");
    // TODO (backend): POST /api/quote -> Supabase leads + Telnyx alert, upload photos to Storage.
    await new Promise((r) => setTimeout(r, 600));
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="frame bg-green p-8 text-ink">
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-full border-2 border-ink bg-bone">
          <Icon name="check" className="h-6 w-6" stroke={2.5} />
        </div>
        <p className="font-display text-3xl">GOT IT, {form.name.split(" ")[0].toUpperCase()}.</p>
        <p className="mt-2 text-sm font-medium leading-relaxed">
          We'll reach out shortly with your price. Sooner? Call or text{" "}
          <a href={site.phoneHref} className="font-extrabold underline">{site.phone}</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="frame bg-bone p-6 sm:p-7">
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Field label="Name" required>
          <input value={form.name} onChange={set("name")} placeholder="Jordan Miller" className={inputCls} style={{ fontSize: 16 }} />
        </Field>
        <Field label="Phone" required>
          <input value={form.phone} onChange={set("phone")} inputMode="tel" placeholder="(770) 000-0000" className={inputCls} style={{ fontSize: 16 }} />
        </Field>
      </div>
      <div className="mt-3.5 grid gap-3.5 sm:grid-cols-2">
        <Field label="City or zip">
          <input value={form.location} onChange={set("location")} placeholder="Flowery Branch" className={inputCls} style={{ fontSize: 16 }} />
        </Field>
        <Field label="What do you need?">
          <select value={form.service} onChange={set("service")} className={inputCls}>
            {SERVICES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <div className="mt-3.5">
        <Field label="Details (optional)">
          <textarea value={form.details} onChange={set("details")} rows={2} placeholder="A garage full of furniture and a couple appliances..." className={`${inputCls} resize-none`} style={{ fontSize: 16 }} />
        </Field>
      </div>
      <label className="mt-3.5 flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-ink/40 bg-white px-4 py-3 text-sm font-bold text-ink-soft transition-colors hover:border-ink">
        <Icon name="camera" className="h-5 w-5 text-green-deep" />
        {photos.length ? `${photos.length} photo${photos.length > 1 ? "s" : ""} added` : "Add photos for a faster, exact price"}
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => setPhotos(Array.from(e.target.files || []))} />
      </label>
      <button type="submit" disabled={!valid || status === "sending"}
        className="mt-5 w-full rounded-full border-2 border-ink bg-green px-6 py-3.5 text-base font-extrabold text-ink transition-colors hover:bg-ink hover:text-green disabled:opacity-50">
        {status === "sending" ? "Sending..." : "Get my free price"}
      </button>
      <p className="mt-3 text-center text-xs text-ink-soft">No spam, no pushy sales. Just a fast, fair price.</p>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border-2 border-ink/25 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink";

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-wide text-ink-soft">
        {label}{required && <span className="text-green-deep"> *</span>}
      </span>
      {children}
    </label>
  );
}