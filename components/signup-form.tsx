"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { areas } from "./areas";

export default function SignupForm({ kind }: { kind: "waitlist" | "partner" }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [interest, setInterest] = useState("all");
  const requestId = useRef("");
  useEffect(() => {
    requestId.current = crypto.randomUUID();
    const selected = new URLSearchParams(window.location.search).get("area");
    if (areas.some((area) => area.id === selected)) setInterest(selected!);
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "saving") return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    setState("saving");
    setMessage("");
    try {
      const response = await fetch("/api/signups", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, kind, consent: values.consent === "on", requestId: requestId.current }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || result.saved !== true) throw new Error(result.error || "We couldn’t save your details. Please try again.");
      setState("saved");
      setMessage(kind === "partner" ? "Your application is saved for review. This does not confirm a partnership." : "You’re on the SLC waitlist. Your email has been saved.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error && error.name !== "TimeoutError" ? error.message : "We couldn’t confirm your submission. Please retry; duplicate submissions won’t create another record.");
    }
  }
  return <div className="signup-wrap">
    {state !== "saved" && <form className="signup-form" onSubmit={submit}>
      {kind === "partner" && <><label>Your name<input name="name" autoComplete="name" required maxLength={120} /></label>
        <label>Brand, business or project<input name="organisation" autoComplete="organization" required maxLength={160} /></label></>}
      <label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      {kind === "partner" && <label>Website or social profile (optional)<input name="website" type="url" placeholder="https://" maxLength={500} /></label>}
      <label>{kind === "partner" ? "Which part of SLC fits your idea?" : "What would you like updates about?"}
        <select name="interest" value={interest} onChange={(event) => setInterest(event.target.value)}>
          <option value="all">All of SLC</option>
          {areas.map((area) => <option key={area.id} value={area.id}>SLC {area.name}</option>)}
        </select>
      </label>
      {kind === "partner" && <label>Tell us about your idea<textarea name="proposal" required minLength={20} maxLength={3000} rows={5} placeholder="What would you like to create together?" /></label>}
      <div className="form-trap" aria-hidden="true"><label>Leave this field empty<input name="fax" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="consent-row"><input type="checkbox" name="consent" required />
        <span>{kind === "partner" ? "I agree that SLC may save these details to review my application and contact me about this proposal." : "I agree that SLC may save my email and send me updates about the areas I’ve selected."}</span>
      </label>
      <button className="primary-link" type="submit" disabled={state === "saving"}>{state === "saving" ? "Saving…" : kind === "partner" ? "Submit partnership idea" : "Join the waitlist"}</button>
    </form>}
    <p role={state === "error" ? "alert" : "status"} aria-live="polite" className={state === "error" ? "form-error" : "form-status"}>{message}</p>
  </div>;
}
