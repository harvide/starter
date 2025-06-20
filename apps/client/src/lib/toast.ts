import { toast } from "sonner"
import { config } from "@repo/config"

const canShow = (type: keyof typeof config.preferences.showToasts): boolean => {
  if (type === "debug" && process.env.NODE_ENV !== "development") return false
  return config.preferences.showToasts[type] === true
}

export const showToast = {
  success: (message: string, options?: Parameters<typeof toast.success>[1]) => {
    if (canShow("success")) toast.success(message, options)
  },
  error: (message: string, options?: Parameters<typeof toast.error>[1]) => {
    if (canShow("error")) toast.error(message, options)
  },
  info: (message: string, options?: Parameters<typeof toast.info>[1]) => {
    if (canShow("info")) toast.info(message, options)
  },
  warning: (message: string, options?: Parameters<typeof toast.warning>[1]) => {
    if (canShow("warning")) toast.warning(message, options)
  },
  debug: (message: string, options?: Parameters<typeof toast>[1]) => {
    if (canShow("debug")) toast(`DEBUG: ${message}`, options)
  },
}
