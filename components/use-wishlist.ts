"use client";
import {useEffect,useRef,useState} from "react";
import {useAuth} from "./auth-provider";
import {getSupabase} from "@/lib/supabase-browser";
import {products,type Product} from "./catalogue";
function guestItems():string[]{
 try{const value:unknown=JSON.parse(localStorage.getItem("slc-wishlist")||"[]");return Array.isArray(value)?[...new Set(value.filter((id):id is string=>typeof id==="string"&&products.some(p=>p.id===id)))]:[];}catch{return [];}
}
export function useWishlist(){
 const {user,ready}=useAuth();const [wishlist,setWishlist]=useState<string[]>([]);const [loadedFor,setLoadedFor]=useState<string|null>(null);
 const [busy,setBusy]=useState(false);const [notice,setNotice]=useState("");const generation=useRef(0);const lock=useRef(false);
 const identity=user?.id||"guest";
 useEffect(()=>{
  const version=++generation.current;setLoadedFor(null);setWishlist([]);setNotice("");setBusy(false);lock.current=false;
  if(!ready)return;
  if(!user){setWishlist(guestItems());setLoadedFor("guest");return;}
  getSupabase().from("slc_wishlist_items").select("product_id").eq("user_id",user.id).then(({data,error})=>{
   if(version!==generation.current)return;
   if(error){setNotice("Your wishlist couldn’t load. Refresh to try again.");return;}
   setWishlist((data||[]).map(row=>row.product_id).filter(id=>products.some(p=>p.id===id)));setLoadedFor(identity);
  });
  return ()=>{generation.current++;};
 },[ready,identity,user?.id]);
 const wishlistReady=ready&&loadedFor===identity&&!busy;
 async function toggleWishlist(product:Product){
  if(!wishlistReady||lock.current)return;
  lock.current=true;setBusy(true);const version=generation.current;const saved=wishlist.includes(product.id);
  const next=saved?wishlist.filter(id=>id!==product.id):[...wishlist,product.id];
  try{
   if(user){
    const db=getSupabase().from("slc_wishlist_items");
    const {error}=saved?await db.delete().eq("user_id",user.id).eq("product_id",product.id):await db.upsert({user_id:user.id,product_id:product.id},{onConflict:"user_id,product_id",ignoreDuplicates:true});
    if(error)throw error;
   }else{localStorage.setItem("slc-wishlist",JSON.stringify(next));}
   if(version!==generation.current)return;
   setWishlist(next);setNotice(`${product.name} ${saved?"removed from":"saved to"} your wishlist.`);
  }catch{if(version===generation.current)setNotice("Could not save that change. Please try again.");}
  finally{if(version===generation.current){lock.current=false;setBusy(false);}}
 }
 return {wishlist:wishlistReady||busy?wishlist:[],wishlistReady,loading:loadedFor!==identity,notice,toggleWishlist,user};
}
