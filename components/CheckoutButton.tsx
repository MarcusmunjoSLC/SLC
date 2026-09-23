"use client";

type CheckoutItem = {
  productId: string;
  size: string;
  quantity: number;
};

export default function CheckoutButton({
  items,
  disabled = false,
}: {
  items: CheckoutItem[];
  disabled?: boolean;
}) {
  async function handleCheckout() {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Checkout is currently unavailable.");
      return;
    }

    window.location.href = data.url;
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={disabled || items.length === 0}
    >
      Checkout
    </button>
  );
}
