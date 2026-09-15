export type Product = {
  id: string;
  name: string;
  lineOne: string;
  lineTwo?: string;
  colour: string;
  colourName: string;
};

export type BagItem = Product & { size: string };

export const products: Product[] = [
  { id: "peace-over-everything", name: "Peace Over Everything Tee", lineOne: "SOFT LIFE CLUB", lineTwo: "peace over everything", colour: "#eeeae0", colourName: "Cream" },
  { id: "pay-me-yet", name: "Pay Me Yet Tee", lineOne: "WHY ARE YOU SPEAKING TO ME?", lineTwo: "YOU DIDN’T PAY ME YET.", colour: "#42372f", colourName: "Mocha" },
  { id: "rich-in-peace", name: "Rich In Peace Tee", lineOne: "RICH IN PEACE", lineTwo: "SOFT LIFE CLUB", colour: "#e7e0d5", colourName: "Sand" },
  { id: "protect-your-peace", name: "Protect Your Peace Tee", lineOne: "PROTECT YOUR PEACE.", lineTwo: "COLLECT YOUR MONEY.", colour: "#e9e3d8", colourName: "Cream" },
  { id: "dont-chase", name: "I Don’t Chase Tee", lineOne: "I DON’T CHASE.", lineTwo: "I CHOOSE.", colour: "#352b26", colourName: "Mocha" },
  { id: "bare-minimum", name: "Bare Minimum Tee", lineOne: "LUXURY IS THE", lineTwo: "BARE MINIMUM.", colour: "#f4f3ef", colourName: "White" },
  { id: "moisturized", name: "Too Moisturized Tee", lineOne: "TOO MOISTURIZED", lineTwo: "TO ARGUE.", colour: "#151515", colourName: "Black" },
  { id: "fully-booked", name: "Fully Booked Tee", lineOne: "MY SCHEDULE IS FULLY BOOKED…", lineTwo: "WITH DOING NOTHING.", colour: "#ece7dd", colourName: "Cream" },
  { id: "hard-boundaries", name: "Hard Boundaries Tee", lineOne: "SOFT LIFE.", lineTwo: "HARD BOUNDARIES.", colour: "#d8cdbd", colourName: "Sand" },
];

export const sizes = ["S", "M", "L", "XL"];
