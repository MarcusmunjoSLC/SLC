import {categoryOf,type Product} from "./catalogue";
const guides:Record<string,{intro:string;steps:[string,string][]}>={
 "t-shirts":{intro:"For an oversized tee, compare a T-shirt you already like wearing.",steps:[["Chest width","Lay the tee flat and measure straight across, just below the armholes."],["Body length","Measure from the highest shoulder point to the bottom hem."],["Sleeve length","Measure from the shoulder seam to the sleeve edge."]]},
 joggers:{intro:"Compare with a comfortable pair of joggers, laid flat without stretching.",steps:[["Waist","Measure around your natural waist with the tape comfortably level."],["Hips","Measure around the fullest part of your hips."],["Inside leg","Measure a well-fitting pair from the crotch seam to the hem."]]},
 "sports-bras":{intro:"Measure without padding and keep the tape level. Bra sizes vary between brands.",steps:[["Underbust","Measure around your ribcage directly beneath the bust."],["Bust","Measure around the fullest part of your bust without pulling the tape tight."]]},
 tracksuits:{intro:"Check the top and bottoms separately against pieces you already wear.",steps:[["Top","Lay a similar top flat. Measure across the chest and from the highest shoulder point to the hem."],["Waist and hips","Measure around your natural waist and the fullest part of your hips."],["Inside leg","Measure your trousers from the crotch seam to the hem."]]},
 sunglasses:{intro:"Compare the dimensions with a pair of glasses that fits you comfortably.",steps:[["Lens width","The width of one lens, usually listed in millimetres."],["Bridge width","The distance between the lenses across the nose."],["Temple length","The length of the arm from the hinge to its tip. These three measurements are often printed inside an arm."]]}
};
export default function SizeGuide({product}:{product:Product}){
 const eyewear=categoryOf(product)==="sunglasses";const guide=guides[categoryOf(product)]||guides["t-shirts"];
 return <details className="size-guide"><summary>{eyewear?"Frame fit & model guide":"Size, fit & model guide"}</summary>
 <div className="guide-content"><h2>{eyewear?"Find your frame fit":"How to measure"}</h2><p>{guide.intro}</p>
 <dl>{guide.steps.map(([label,copy])=><div key={label}><dt>{label}</dt><dd>{copy}</dd></div>)}</dl>
 <h2>{eyewear?"Frame measurements":"Size chart"}</h2><p>Verified {eyewear?"frame dimensions":"measurements for each size"} haven’t been supplied yet. We’ll add them before this item is available to order.</p>
 <h2>Model reference</h2><p>This item is shown as a product render, not on a model. {eyewear?"On-face fit photos":"Model height, measurements and size worn"} will be added with the model photography.</p></div>
 </details>;
}
