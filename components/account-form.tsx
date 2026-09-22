"use client";
import {useEffect,useState,type FormEvent} from "react";
import {useAuth} from "./auth-provider";
import {getSupabase} from "@/lib/supabase-browser";
export default function AccountForm(){
 const {user,ready,recovery}=useAuth();
 const [mode,setMode]=useState<"login"|"signup"|"forgot"|"reset">("login");
 const [email,setEmail]=useState(""); const [password,setPassword]=useState("");const [confirmation,setConfirmation]=useState("");
 const [message,setMessage]=useState("");const [busy,setBusy]=useState(false);
 useEffect(()=>{
  const params=new URLSearchParams(window.location.search);
  const hash=new URLSearchParams(window.location.hash.slice(1));
  if(params.get("reset")==="1"||recovery)setMode("reset");
  if(hash.has("error")) {setMessage("That email link has expired or could not be used. Please request a new one.");history.replaceState(null,"",location.pathname);}
 },[recovery]);
 function change(next:typeof mode){setMode(next);setPassword("");setConfirmation("");setMessage("");}
 async function submit(event:FormEvent){
  event.preventDefault();setBusy(true);setMessage("");
  const supabase=getSupabase();
  try{
   if((mode==="signup"||mode==="reset")&&password!==confirmation)throw Error("Your passwords don’t match.");
   if(mode==="login"){
    const {error}=await supabase.auth.signInWithPassword({email:email.trim(),password});if(error)throw error;
    setPassword("");setMessage("You’re logged in.");
   }else if(mode==="signup"){
    const {data,error}=await supabase.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:location.origin+"/account"}});if(error)throw error;
    setPassword("");setConfirmation("");setMessage(data.session?"Your account is ready.":"Check your email for a confirmation link. If you already have an account, log in or reset your password.");
   }else if(mode==="forgot"){
    const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo:location.origin+"/account?reset=1"});if(error)throw error;
    setMessage("If there’s an account for that email, you’ll receive a password reset link.");
   }else{
    const {error}=await supabase.auth.updateUser({password});if(error)throw error;
    setPassword("");setConfirmation("");setMode("login");history.replaceState(null,"","/account");setMessage("Your password has been updated.");
   }
  }catch(error){setMessage(error instanceof Error?error.message:"Something went wrong. Please try again.");}finally{setBusy(false);}
 }
 async function logout(){setBusy(true);setMessage("");try{const {error}=await getSupabase().auth.signOut();if(error)throw error;change("login");}catch{setMessage("Could not log out. Please try again.");}finally{setBusy(false);}}
 if(!ready)return <p role="status">Loading your account…</p>;
 return <>
 <h1>{user&&mode!=="reset"?"Your account.":mode==="signup"?"Create your account.":mode==="forgot"?"Reset your password.":mode==="reset"?"Choose a new password.":"Welcome back."}</h1>
 {user&&mode!=="reset"?<div><p>Signed in as {user.email}</p><p><a href="/wishlist">View your wishlist →</a></p><button className="wishlist-toggle" disabled={busy} onClick={logout}>Log out</button></div>:mode==="reset"&&!user?<p>Open the password reset link from your email to continue. <button className="text-button" onClick={()=>change("forgot")}>Request a new link</button></p>:<>
 <p>Save your favourites and find them on any device.</p>
 <form className="account-form" onSubmit={submit}>
 {mode!=="reset"&&<label>Email<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)}/></label>}
 {mode!=="forgot"&&<label>{mode==="reset"?"New password":"Password"}<input type="password" required minLength={mode==="login"?1:8} maxLength={128} autoComplete={mode==="login"?"current-password":"new-password"} value={password} onChange={e=>setPassword(e.target.value)}/></label>}
 {(mode==="signup"||mode==="reset")&&<><p>Use at least 8 characters.</p><label>Confirm password<input type="password" required autoComplete="new-password" value={confirmation} onChange={e=>setConfirmation(e.target.value)}/></label></>}
 <button className="primary-link" disabled={busy} type="submit">{busy?"Please wait…":mode==="login"?"Log in":mode==="signup"?"Create account":mode==="forgot"?"Send reset link":"Save password"}</button>
 </form>
 <div className="account-options">{mode!=="login"&&<button className="text-button" onClick={()=>change("login")}>Back to log in</button>}{mode==="login"&&<><button className="text-button" onClick={()=>change("signup")}>Create an account</button><button className="text-button" onClick={()=>change("forgot")}>Forgot password?</button></>}</div>
 </>}
 <p role="status">{message}</p>
 </>;
}
