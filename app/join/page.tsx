import Storefront from "@/components/storefront";
import SignupForm from "@/components/signup-form";
export const metadata = { title: "Join SLC | Soft Life Club", description: "Join the waitlist for SLC Love, Escapes, Wardrobe and Society." };
export default function JoinPage() {
  return <Storefront><section className="form-page"><p className="eyebrow">BE PART OF WHAT’S NEXT</p><h1>Join SLC.</h1><p>Love. Escapes. Wardrobe. Society. Leave your email to hear as each part of SLC grows.</p><SignupForm kind="waitlist" /></section></Storefront>;
}
