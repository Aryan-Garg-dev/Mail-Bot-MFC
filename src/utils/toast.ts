import { toast } from "sonner";

export const alert  = {
  success: (message: string)=>toast(message, {
    className: "violet font-poppins text-dullWhite border-slate-800",
  }),
  warning: (message: string)=>toast(message, {
    className: "alert font-poppins border-red-800"
  })
}