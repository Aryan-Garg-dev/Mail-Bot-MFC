import { useState } from "react";
import './App.css'
import { useDropzone } from "react-dropzone";
import { calcSize } from "./utils/file-size";
import { Toaster } from "sonner";
import axios from "axios";
import { mailEndpoint } from "./constants";
import Modal from "./components/modal";
import { IoIosCloseCircleOutline } from "react-icons/io";
import useToken from "./hooks/use-token";
import loginUser from "./utils/user-login";
import { alert } from "./utils/toast";

function App() {
  const [ file, setFile ] = useState<File|null>(null);
  const token = useToken("token");
  const [ isOpen, setIsOpen ] = useState(token.value === "");

  const onLogin = async (username: string, password: string)=>{
    const token = await loginUser(username, password);
    if (!token || token === "") alert.warning("Failed to login !!!")
    else setIsOpen(false);
  }

  return (
    <div className='h-full min-h-screen w-full blue'>
      <Toaster position={"bottom-center"} />
      <section className="w-full py-5 flex flex-col items-center">
        <h1 className="text-dullWhite text-5xl font-bold">Mail Man</h1>
      </section>
      <section className="w-full flex flex-col items-center">
        <FileUpload file={file} setFile={setFile} openLoginModal={()=>setIsOpen(true)} />
      </section>
      {isOpen && <Modal isOpen={isOpen}>
        <Login handleClose={()=>setIsOpen(false)} handleSubmit={onLogin} />
      </Modal>}
    </div>
  )
}


const FileUpload = ({ file, setFile, openLoginModal }: {
  file: File|null,
  setFile: (file: File)=>void,
  openLoginModal: ()=>void,
})=>{
  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    alert.success("File has been selected.")
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  return (
  <div className="max-w-xl w-full flex flex-col items-center">
    <div {...getRootProps({ className: 'dropzone' })} className="w-full border border-dashed border-blue-200 min-h-32 text-dullWhite flex flex-col justify-center items-center dark cursor-pointer rounded-sm">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here...</p>
      ) : (
        <p>Drag & drop a CSV file here, or click to select a file</p>
      )}
    </div>
    {file && (
      <div className="w-full flex flex-col h-full gap-5">
        <div className="flex flex-col mt-5 px-2 py-2 text-dullWhite border rounded-xl violet">
          <div className="text-neutral-100 text-lg">{file.name}</div>
          <div className="text-neutral-400">{calcSize(file.size)}</div>
        </div>
        <DropMail file={file} openLoginModal={openLoginModal} />
      </div>
    )}
  </div>
  )
}


const DropMail = ({ file, openLoginModal }: { 
  file: File,
  openLoginModal: ()=>void
})=>{
  const token = useToken("token");
  const handleUpload = async ()=>{
    if (token.value === ""){
      alert.warning("Login to send mail !!!")
      openLoginModal();
      return;
    }
    if (!file){
      alert.warning("Please select or drop a file first !!!");
      return;
    } 
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(mailEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
  
      alert.success(response.data.message);
    } catch(error){
      alert.warning("Error uploading file. Please try again !!!")
      console.log(error);
    }
  }
  return (
    <button className="w-full p-2 dark font-poppins shadow-md active:shadow-none shadow-slate-800 border-2 border-slate-700 text-dullWhite transition-transform duration-150 active:scale-90 text-center rounded-md" onClick={handleUpload}>
      Send Mail
    </button>
  )
}

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
      <div className="text-slate-300 text-3xl font-medium border-b-[3px] pb-2 border-slate-600 flex justify-between items-center">
        <div>Login</div>
        <div onClick={handleClose}><IoIosCloseCircleOutline /></div>
      </div>
      <div className="flex flex-col mt-2 gap-1">
        <label htmlFor="username" className="text-slate-400">Username</label>
        <input type="text" id="username" className="bg-slate-900 focus:bg-slate-950 focus:outline-none focus:ring-2 caret-dullWhite focus:ring-slate-400 p-1 rounded-md text-slate-50 px-2 placeholder:text-slate-500 focus:placeholder:text-transparent" placeholder="garg" onChange = {(e)=>setUsername(e.target.value)} />
      </div>
      <div className="flex flex-col mb-4 gap-1">
        <label htmlFor="password" className="text-slate-400">Password</label>
        <input type="password" id="password" className="bg-slate-900 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-400 caret-dullWhite p-1 rounded-md text-slate-50 px-2 placeholder:text-slate-500 focus:placeholder:text-transparent" placeholder="secret" onChange = {(e)=>setPassword(e.target.value)} />
      </div>
      <button className="bg-slate-900 hover:bg-slate-950 text-slate-200 text-xl font-medium p-1 rounded-md active:scale-95 hover:text-slate-300" onClick={onSubmit}>Login</button>
    </div>
  )
}


export default App
