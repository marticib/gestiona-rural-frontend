import { toast } from "sonner"

export const useToast = () => {
  return {
    // Toast de success
    success: (message, description) => {
      if (description) {
        toast.success(message, { description })
      } else {
        toast.success(message)
      }
    },

    // Toast d'error
    error: (message, description) => {
      if (description) {
        toast.error(message, { description })
      } else {
        toast.error(message)
      }
    },

    // Toast d'informació
    info: (message, description) => {
      if (description) {
        toast.info(message, { description })
      } else {
        toast.info(message)
      }
    },

    // Toast d'advertència
    warning: (message, description) => {
      if (description) {
        toast.warning(message, { description })
      } else {
        toast.warning(message)
      }
    },

    // Toast de loading
    loading: (message) => {
      return toast.loading(message)
    },

    // Toast personalitzat
    custom: (message, options = {}) => {
      toast(message, options)
    },

    // Promesa amb toast automàtic
    promise: (promise, messages) => {
      return toast.promise(promise, {
        loading: messages.loading || 'Carregant...',
        success: messages.success || 'Completat!',
        error: messages.error || 'Error!'
      })
    },

    // Dismiss tots els toasts
    dismiss: (toastId) => {
      if (toastId) {
        toast.dismiss(toastId)
      } else {
        toast.dismiss()
      }
    }
  }
}
