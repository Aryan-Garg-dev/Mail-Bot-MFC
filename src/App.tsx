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
import { ImSpinner8 } from "react-icons/im";
import Input from "./components/input";
import Login from "./components/login";

function App() {
  const [ file, setFile ] = useState<File|null>(null);
  const token = useToken("token");
  const [ isOpen, setIsOpen ] = useState(token.value === "");

  const onLogin = async (username: string, password: string)=>{
    const _token = await loginUser(username, password);
    if (!_token || _token === "") alert.warning("Failed to login !!!")
    else {
      token.set(_token);
      setIsOpen(false);
    }
  }

  return (
    <div className='h-full min-h-screen w-full blue px-5'>
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
  setFile: (file: File|null)=>void,
  openLoginModal: ()=>void,
})=>{
  const [ subject, setSubject ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

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
        <p className="mx-5">Drop the file here...</p>
      ) : (
        <p className="mx-5">Drag & drop a CSV file here, or click to select a file</p>
      )}
    </div>
    {file && (
      <div className="w-full flex flex-col h-full gap-5">
        <div className="flex justify-between items-center mt-5 px-3 py-2 text-dullWhite border rounded-xl violet">
          <div className="flex flex-col">
            <div className="text-neutral-100 text-lg">{file.name}</div>
            <div className="text-neutral-400">{calcSize(file.size)}</div>
          </div>
          <div onClick={()=>setFile(null)}><IoIosCloseCircleOutline className="size-7 text-slate-300" /></div>
        </div>
        <div className="flex flex-col gap-4">
          <Input label="Sender Mail" id="sender" setValue={setEmail} placeholder="Sender Mail" />
          <Input label="App Password" id="app-password" setValue={setPassword} placeholder="App Password" />
          <Input label="Subject" id="subject" setValue={setSubject} placeholder="Subject" />
        </div>
        <DropMail 
          file={file} 
          openLoginModal={openLoginModal} 
          subject={subject} 
          email={email} 
          password={password} 
        />
      </div>
    )}
  </div>
  )
}

const DropMail = ({ 
  file, 
  openLoginModal, 
  subject,
  email,
  password 
}: { 
  file: File,
  subject: string
  email: string,
  password: string,
  openLoginModal: ()=>void
})=>{
  const token = useToken("token");
  const [ loading, setLoading ] = useState(false);

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

    if (!email || !subject || !password){
      alert.warning("Fill all the fields correctly.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append("subject", subject);
    formData.append("email", email.trim());
    formData.append("password", password.trim());
    try {
      const response = await axios.post(mailEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': 'Bearer ' + token.value
        }
      })
      setLoading(false);
      alert.success(response.data.message);
    } catch(error){
      alert.warning("Error uploading file. Please try again !!!")
      setLoading(false);
      console.log(error);
    }
  }
  return (
    <button className="w-full p-2 dark font-poppins shadow-md active:shadow-none shadow-slate-800 border-2 border-slate-700 text-dullWhite transition-transform duration-150 active:scale-90 text-center rounded-md" onClick={handleUpload}>
      {!loading ? "Send Mail" : <div className="flex justify-center"><ImSpinner8 className="animate-spin text-slate-200 size-7" /></div>}
    </button>
  )
}

export default App
