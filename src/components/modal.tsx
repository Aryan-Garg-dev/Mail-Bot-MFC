const Modal = ({ isOpen, children }: {
  isOpen: boolean,
  children: React.ReactNode
}) => {
  return (  
    <div className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full bg-slate-200 bg-opacity-40 ${isOpen ? 'flex': 'hidden'}`}>
      {children}
    </div>
  );
}
 
export default Modal;