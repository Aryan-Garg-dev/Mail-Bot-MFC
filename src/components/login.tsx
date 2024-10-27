import { useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Input from "./input";

const Login = ({
  handleClose,
  handleSubmit
}: {
  handleClose: ()=>void,
  handleSubmit: (username: string, password: string)=>void,
})=>{
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const onSubmit = ()=>{
    handleSubmit(username, password);
  }
  return (
    <div className="w-full max-w-md max-h-full p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg shadow-2xl shadow-slate-800 flex flex-col item-center gap-3 pb-5 px-10">
      <div className="text-slate-300 text-3xl font-medium border-b-[3px] pb-2 border-slate-600 flex justify-between items-center mb-2">
        <div>Login</div>
        <div onClick={handleClose}><IoIosCloseCircleOutline /></div>
      </div>
      <Input id="username" placeholder="aryan" setValue={setUsername} label="Username"  />
      <Input id="password" placeholder="secret" setValue={setPassword} label="Password" type="password" />
      <button className="mt-2 bg-slate-900 hover:bg-slate-950 text-slate-200 text-xl font-medium p-1 rounded-md active:scale-95 hover:text-slate-300" onClick={onSubmit}>Login</button>
    </div>
  )
}

export default Login;