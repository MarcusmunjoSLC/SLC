export type Product = {
  id: string;
  name: string;
  lineOne: string;
  lineTwo?: string;
  colour: string;
  colourName: string;
  category?: string;
  image?: string;
  concept?: boolean;
  description?: string;
  supporting?: [string, string];
};

export type BagItem = Product & { size: string };

export const products: Product[] = [
  { id: "off-duty-joggers", name: "Off Duty Joggers", lineOne: "OFF DUTY. STILL THAT GIRL.", colour: "#eeeae0", colourName: "Cream", category: "joggers", image: "/joggers.png", concept: true, description: "A cream jogger concept with a drawstring waist, cuffed ankles and a small SLC monogram above the slogan.", supporting: ["For the woman who clocks out without shrinking.", "Her confidence doesn’t take a day off."] },
  { id: "strong-core-sports-bra", name: "Strong Core Sports Bra", lineOne: "SOFT LIFE. STRONG CORE.", colour: "#72513e", colourName: "Mocha", category: "sports-bras", image: "/sports-bra.png", concept: true, description: "A mocha scoop-neck sports-bra concept with cream lettering and the SLC monogram on the lower band.", supporting: ["For the woman building strength on her own terms.", "She makes room for softness, too."] },
  { id: "out-of-office-sunglasses", name: "Out of Office Sunglasses", lineOne: "LESS ACCESS. BETTER VIEWS.", colour: "#151515", colourName: "Black", category: "sunglasses", image: "/sunglasses.png", concept: true, description: "A black rectangular sunglasses concept with a gold-tone SLC monogram at the temple. The quote is the piece’s mood; the frames carry the logo only.", supporting: ["For the woman who chooses what gets her attention.", "Her outlook is clear. Her availability is limited."] },
  { id: "own-pace-tracksuit", name: "Own Pace Tracksuit", lineOne: "MOVING AT MY OWN PACE.", colour: "#d8cdbd", colourName: "Sand", category: "tracksuits", image: "/tracksuit.png", concept: true, description: "A sand zip-hoodie and jogger concept with matching SLC monograms and a small slogan on the thigh.", supporting: ["For the woman who has nothing to prove by rushing.", "She sets the pace and keeps her peace."] },
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

export const categories = [
  { id: "t-shirts", name: "T-shirts", description: "Oversized fits. Statements that speak for you.", cover: "peace-over-everything" },
  { id: "joggers", name: "Joggers", description: "Off-duty ease with a little attitude.", cover: "off-duty-joggers" },
  { id: "sports-bras", name: "Sports bras", description: "Soft life. Strong energy.", cover: "strong-core-sports-bra" },
  { id: "sunglasses", name: "Sunglasses", description: "A different outlook. The same SLC signature.", cover: "out-of-office-sunglasses" },
  { id: "tracksuits", name: "Tracksuits", description: "Matching pieces. Your own pace.", cover: "own-pace-tracksuit" },
];
export const categoryOf = (product: Product) => product.category || "t-shirts";
export const teeProducts = products.filter((product) => !product.concept);
const teeStories: [string, string][] = [
  ["For the woman who puts peace on her calendar.", "She gives herself the space she gives everyone else."],
  ["For the woman who knows the value of her time.", "Her energy is generous. Her work is not free."],
  ["For the woman whose favourite luxury is a quiet mind.", "She measures wealth in more than money."],
  ["For the woman building a life that pays her back.", "Her goals are big. Her boundaries are clear."],
  ["For the woman who trusts her own taste.", "She chooses what fits and lets the rest pass."],
  ["For the woman who makes comfort a standard.", "She saves the best for herself, too."],
  ["For the woman who has better plans than an argument.", "She keeps her glow and leaves the noise."],
  ["For the woman who can make space for doing nothing.", "Her downtime needs no explanation."],
  ["For the woman who can be warm and still say no.", "Her softness comes with standards."],
];
export function storyFor(product: Product): [string, string] {
  return product.supporting || teeStories[teeProducts.findIndex((item) => item.id === product.id)];
}
