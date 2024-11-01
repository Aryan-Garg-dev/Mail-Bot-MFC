import { useState } from "react"
import { LuEye, LuEyeOff } from "react-icons/lu"

const Input = ({
  label, id, setValue, placeholder = "", type="text"
}: {
  label: string,
  id: string,
  setValue: (value: string)=>void,
  placeholder?: string
  type?: "text"|"password"|"number"
})=>{
  const [ show, setShow ] = useState(false)

  const handleToggle = ()=>{
    setShow(!show);
  }

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-slate-400">{label}</label>
      <div className="relative flex items-center">
        <input type={type == "password" ? show ? "text" : "password" : type } className={`w-full p-2 bg-slate-900 focus:bg-slate-950 border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 caret-dullWhite rounded-md text-slate-200 placeholder:text-slate-500 focus:placeholder:text-transparent ${type == "password" && "pr-7"}`} placeholder={placeholder} id={id} onChange={(e)=>setValue(e.target.value)} />
        { type == "password" && <div className="absolute right-2.5 text-slate-700 p-1 rounded-full" onClick={handleToggle}>{show ? <LuEyeOff /> : <LuEye />}</div>}
      </div>
    </div>
  )
}

export default Input;