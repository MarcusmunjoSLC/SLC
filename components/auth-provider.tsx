"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase } from "@/lib/supabase-browser";
const Context = createContext<{ user: User | null; ready: boolean; recovery: boolean }>({user:null,ready:false,recovery:false});
export const useAuth = () => useContext(Context);
export default function AuthProvider({children}: {children:ReactNode}) {
  const [user,setUser]=useState<User|null>(null);
  const [ready,setReady]=useState(false);
  const [recovery,setRecovery]=useState(false);
  useEffect(()=>{
    const supabase=getSupabase();
    let alive=true;
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
      if(!alive)return;
      setUser(session?.user ?? null);setReady(true);
      if(event==="PASSWORD_RECOVERY")setRecovery(true);
      if(event==="SIGNED_OUT")setRecovery(false);
    });
    supabase.auth.getSession().then(({data})=>{if(alive){setUser(data.session?.user??null);setReady(true);}}).catch(()=>{if(alive)setReady(true);});
    return ()=>{alive=false;subscription.unsubscribe();};
  },[]);
  return <Context.Provider value={{user,ready,recovery}}>{children}</Context.Provider>;
}
