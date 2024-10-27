const Input = ({
  label, id, setValue, placeholder = "", type="text"
}: {
  label: string,
  id: string,
  setValue: (value: string)=>void,
  placeholder?: string
  type?: string
})=>{
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-slate-400">{label}</label>
      <input type={type} className="bg-slate-900 focus:bg-slate-950 border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 caret-dullWhite p-2 rounded-md text-slate-50 px-2 placeholder:text-slate-500 focus:placeholder:text-transparent" placeholder={placeholder} id={id} onChange={(e)=>setValue(e.target.value)} />
    </div>
  )
}

export default Input;