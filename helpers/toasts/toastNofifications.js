import {toast} from "sonner";

export function successToast (msg) {
    toast.success(msg)
}

export function errorToast (msg) {
    toast.error(msg)
}

export function infoToast (msg) {
    toast.info(msg)
}