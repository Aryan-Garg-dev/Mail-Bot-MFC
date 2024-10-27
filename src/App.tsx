import { useState } from "react";
import './App.css'
import { useDropzone } from "react-dropzone";
import { calcSize } from "./utils/file-size";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { mailEndpoint } from "./constants";

function App() {
  const [ file, setFile ] = useState<File|null>(null);
  return (
    <div className='h-full min-h-screen w-full blue'>
      <Toaster position={"bottom-center"} />
      <section className="w-full py-5 flex flex-col items-center">
        <h1 className="text-dullWhite text-5xl font-bold">Mail Man</h1>
      </section>
      <section className="w-full flex flex-col items-center">
        <FileUpload file={file} setFile={setFile} />
      </section>
    </div>
  )
}


const FileUpload = ({ file, setFile }: {
  file: File|null,
  setFile: (file: File)=>void
})=>{
  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    toast("File has been selected", {
      className: "violet font-poppins text-dullWhite border-slate-800",
    })
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  return (
  <div className="max-w-xl w-full flex flex-col items-center">
    <div {...getRootProps({ className: 'dropzone' })} className="w-full border border-dashed min-h-32 text-dullWhite flex flex-col justify-center items-center dark cursor-pointer rounded-sm">
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
        <DropMail file={file} />
      </div>
    )}
  </div>
  )
}


const DropMail = ({ file }: { file: File })=>{
  const handleUpload = async ()=>{
    if (!file){
      toast("Please select or drop a file first.", {
        className: "alert font-poppins border-red-800"
      })
      return;
    } 
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post(mailEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
  
      toast(`${response.status}`, {
        className: "violet font-poppins text-dullWhite border-slate-800",
      })
    } catch(error){
      toast("Error uploading file. Please try again.", {
        className: "alert font-poppins border-red-700"
      })
      console.log(error);
    }
  }
  return (
    <button className="w-full p-2 dark font-poppins shadow-md active:shadow-none shadow-slate-800 border-2 border-slate-700 text-dullWhite transition-transform duration-150 active:scale-90 text-center rounded-md" onClick={handleUpload}>
      Send Mail
    </button>
  )
}


export default App
