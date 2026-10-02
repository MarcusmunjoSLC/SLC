export type Product = {
  id: string;
  name: string;
  lineOne: string;
  lineTwo?: string;
  colour: string;
  colourName: string;
  category?: string;
  image?: string;
  gallery?: string[];
  concept?: boolean;
  description?: string;
  supporting?: [string, string];
};

export type BagItem = Product & { size: string };

export const newCollection: Product[] = [
  {
    "id": "slc-hoodies-white",
    "name": "SLC Zip Hoodie — White",
    "lineOne": "COMFORT IS MY STANDARD.",
    "colour": "#eee9de",
    "colourName": "White",
    "category": "hoodies",
    "image": "/new-collection/slc-hoodie-white.png",
    "concept": true,
    "description": "A hooded zip-front layer with drawstrings, front pockets and the SLC monogram. The styling quote describes the mood; the garment carries the logo shown.",
    "supporting": [
      "For the woman who makes ease look effortless.",
      "She keeps her comfort close and her standards high."
    ]
  },
  {
    "id": "slc-hoodies-black",
    "name": "SLC Zip Hoodie — Black",
    "lineOne": "COMFORT IS MY STANDARD.",
    "colour": "#171614",
    "colourName": "Black",
    "category": "hoodies",
    "image": "/new-collection/slc-hoodie-black.png",
    "concept": true,
    "description": "A hooded zip-front layer with drawstrings, front pockets and the SLC monogram. The styling quote describes the mood; the garment carries the logo shown.",
    "supporting": [
      "For the woman who makes ease look effortless.",
      "She keeps her comfort close and her standards high."
    ]
  },
  {
    "id": "slc-hoodies-brown",
    "name": "SLC Zip Hoodie — Brown",
    "lineOne": "COMFORT IS MY STANDARD.",
    "colour": "#4f3428",
    "colourName": "Brown",
    "category": "hoodies",
    "image": "/new-collection/slc-hoodie-brown.png",
    "concept": true,
    "description": "A hooded zip-front layer with drawstrings, front pockets and the SLC monogram. The styling quote describes the mood; the garment carries the logo shown.",
    "supporting": [
      "For the woman who makes ease look effortless.",
      "She keeps her comfort close and her standards high."
    ]
  },
  {
    "id": "slc-trousers-white",
    "name": "SLC Wide-Leg Joggers — White",
    "lineOne": "ROOM TO MOVE. SPACE TO BE.",
    "colour": "#eee9de",
    "colourName": "White",
    "category": "joggers",
    "image": "/new-collection/slc-pants-white.png",
    "concept": true,
    "description": "Wide-leg joggers with a drawstring waist and the SLC monogram. The styling quote describes the mood; the garment carries the logo shown.",
    "supporting": [
      "For the woman who moves through life on her own terms.",
      "She takes up space without explaining herself."
    ]
  },
  {
    "id": "slc-trousers-black",
    "name": "SLC Wide-Leg Joggers — Black",
    "lineOne": "ROOM TO MOVE. SPACE TO BE.",
    "colour": "#171614",
    "colourName": "Black",
    "category": "joggers",
    "image": "/new-collection/slc-pants-black.png",
    "concept": true,
    "description": "Wide-leg joggers with a drawstring waist and the SLC monogram. The styling quote describes the mood; the garment carries the logo shown.",
    "supporting": [
      "For the woman who moves through life on her own terms.",
      "She takes up space without explaining herself."
    ]
  },
  {
    "id": "slc-trousers-brown",
    "name": "SLC Wide-Leg Joggers — Brown",
    "lineOne": "ROOM TO MOVE. SPACE TO BE.",
    "colour": "#4f3428",
    "colourName": "Brown",
    "category": "joggers",
    "image": "/new-collection/slc-pants-brown.png",
    "concept": true,
    "description": "Wide-leg joggers with a drawstring waist and the SLC monogram. The styling quote describes the mood; the garment carries the logo shown.",
    "supporting": [
      "For the woman who moves through life on her own terms.",
      "She takes up space without explaining herself."
    ]
  },
  {
    "id": "slc-tops-white",
    "name": "SLC Signature Tank — White",
    "lineOne": "LESS NOISE. MORE ME.",
    "colour": "#eee9de",
    "colourName": "White",
    "category": "tops",
    "image": "/new-collection/slc-top-white.png",
    "concept": true,
    "description": "A slim-strap, scoop-neck top with the SLC monogram at the chest. The styling quote describes the mood; the garment carries the logo shown.",
    "supporting": [
      "For the woman who finds confidence in simplicity.",
      "Her presence says enough."
    ]
  },
  {
    "id": "slc-tops-black",
    "name": "SLC Signature Tank — Black",
    "lineOne": "LESS NOISE. MORE ME.",
    "colour": "#171614",
    "colourName": "Black",
    "category": "tops",
    "image": "/new-collection/slc-top-black.png",
    "concept": true,
    "description": "A slim-strap, scoop-neck top with the SLC monogram at the chest. The styling quote describes the mood; the garment carries the logo shown.",
    "supporting": [
      "For the woman who finds confidence in simplicity.",
      "Her presence says enough."
    ]
  },
  {
    "id": "slc-tops-brown",
    "name": "SLC Signature Tank — Brown",
    "lineOne": "LESS NOISE. MORE ME.",
    "colour": "#4f3428",
    "colourName": "Brown",
    "category": "tops",
    "image": "/new-collection/slc-top-brown.png",
    "concept": true,
    "description": "A slim-strap, scoop-neck top with the SLC monogram at the chest. The styling quote describes the mood; the garment carries the logo shown.",
    "supporting": [
      "For the woman who finds confidence in simplicity.",
      "Her presence says enough."
    ]
  },
  {
    "id": "slc-sunglasses-model-1",
    "name": "SLC Rimless Sunglasses — Champagne",
    "lineOne": "A SOFTER POINT OF VIEW.",
    "colour": "#c5aa87",
    "colourName": "Champagne",
    "category": "sunglasses",
    "image": "/new-collection/sunglasses-model-1.png",
    "concept": true,
    "description": "Rimless sunglasses with softly tinted lenses and decorative gold-tone arms. The styling quote is editorial, not lettering on the frames.",
    "supporting": [
      "For the woman who sees possibility everywhere.",
      "She chooses her own perspective."
    ],
    "gallery": [
      "/new-collection/sunglasses-model-1.1.png"
    ]
  },
  {
    "id": "slc-sunglasses-model-2",
    "name": "SLC Wrap Sunglasses — Black",
    "lineOne": "MY PEACE IS PRIVATE.",
    "colour": "#161616",
    "colourName": "Black",
    "category": "sunglasses",
    "image": "/new-collection/sunglasses-model-2.png",
    "concept": true,
    "description": "Black wrap-style sunglasses with dark lenses and the SLC monogram at the temples. The styling quote is editorial, not lettering on the frames.",
    "supporting": [
      "For the woman who decides what gets her attention.",
      "Her boundaries look good on her."
    ]
  },
  {
    "id": "slc-sunglasses-model-3",
    "name": "SLC Wrap Sunglasses — Brown",
    "lineOne": "UNBOTHERED. ALWAYS.",
    "colour": "#643524",
    "colourName": "Brown",
    "category": "sunglasses",
    "image": "/new-collection/sunglasses-model-3.png",
    "concept": true,
    "description": "Brown wrap-style sunglasses with tinted lenses and the SLC monogram at the temples. The styling quote is editorial, not lettering on the frames.",
    "supporting": [
      "For the woman whose confidence needs no audience.",
      "She keeps her outlook warm and her standards clear."
    ]
  }
];

export const products: Product[] = [
  ...newCollection,
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

// AI-generated supplementary design views, shown only on product pages.
const detailViewIds = new Set(["slc-hoodies-white", "slc-tops-white", "slc-hoodies-black", "slc-tops-black", "slc-hoodies-brown", "slc-tops-brown", "strong-core-sports-bra", "out-of-office-sunglasses", "own-pace-tracksuit", "rich-in-peace", "bare-minimum", "protect-your-peace", "dont-chase", "fully-booked", "hard-boundaries", "peace-over-everything", "pay-me-yet", "moisturized"]);
for (const product of products) {
  if (detailViewIds.has(product.id)) product.gallery = [...(product.gallery || []), `/product-details/${product.id}.png`];
}

export const sizes = ["S", "M", "L", "XL"];

export const categories = [
  {id:"hoodies",name:"Hoodies",description:"Easy layers. The SLC signature.",cover:"slc-hoodies-white"},
  {id:"tops",name:"Tops",description:"Everyday essentials. Quiet confidence.",cover:"slc-tops-black"},
  {id:"joggers",name:"Joggers",description:"A little more room to move.",cover:"slc-trousers-brown"},
  { id: "t-shirts", name: "T-shirts", description: "Oversized fits. Statements that speak for you.", cover: "peace-over-everything" },
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
