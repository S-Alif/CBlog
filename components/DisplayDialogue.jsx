import {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function DisplayDialogue({
    trigger,
    title = "Enter a title",
    description = null,
    open = null,
    setOpen = null,
    children,
}) {
    const [dialogueOpen, setDialogueOpen] = useState(false)
    
    return (
        <Dialog
            open={setOpen ? open : dialogueOpen}
            onOpenChange={() => {
                setOpen ? setOpen(prev => !prev) : setDialogueOpen(prev => !prev)
            }}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {
                        description &&
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    }
                </DialogHeader>
                
                {children}
            </DialogContent>
        </Dialog>
    );
}

