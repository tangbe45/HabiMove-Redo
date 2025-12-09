"use client";

import { toast } from "sonner";

export const toastSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    duration: 4000,
  });
};

export const toastWarning = (message: string) => {
  toast.warning(message, {
    duration: 4000,
  });
};

export const toastInfo = (message: string) => {
  toast.info(message, {
    duration: 3000,
  });
};
