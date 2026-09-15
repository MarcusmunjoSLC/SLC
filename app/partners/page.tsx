import Storefront from "@/components/storefront";
import SignupForm from "@/components/signup-form";
export const metadata = { title: "Partner with SLC | Soft Life Club", description: "Join the movement. Share a partnership idea with Soft Life Club." };
export default function PartnersPage() {
  return <Storefront><section className="form-page"><p className="eyebrow">PARTNER WITH SLC</p><h1>Join the movement.</h1><p>If you have an idea for something we could create together, we’d love to hear it.</p><p>Tell us about your work and where it fits within Love, Escapes, Wardrobe or Society. Applications are reviewed before any partnership is agreed.</p><SignupForm kind="partner" /></section></Storefront>;
}
