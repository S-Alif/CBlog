/**
 * DisplaySheets is a reusable slide-over panel (sheet) component using ShadCN's UI `Sheet`.
 * It provides a customizable trigger element, title, description, side placement, and content area.
 *
 * This is useful for displaying side-drawers that show forms, settings, or contextual information.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.trigger - The element that triggers opening the sheet (e.g., a button or icon).
 * @param {string|null} [props.title=null] - Optional title displayed at the top of the sheet.
 * @param {string|null} [props.description=null] - Optional description shown under the title.
 * @param {string} [props.side="right"] - Side from which the sheet appears. Can be `"top"`, `"right"`, `"bottom"`, or `"left"`.
 * @param {string} [props.className=""] - Additional CSS classes to apply to the sheet content.
 * @param {React.ReactNode} props.children - The main content to render inside the sheet.
 *
 * @returns {JSX.Element} A customizable slide-over sheet component.
 *
 * @example
 * <DisplaySheets
 *   trigger={<Button>Open Settings</Button>}
 *   title="Settings"
 *   description="Manage your preferences"
 *   side="left"
 * >
 *   <SettingsForm />
 * </DisplaySheets>
 */



import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {useState} from "react";

export default function DisplaySheets({
    trigger,
    title = null,
    description = null,
    side="right",
    className = "",
    open = null,
    setOpen = null,
    children
}) {
    
    const [sheetOpen, setSheetOpen] = useState(false)
    
    return (
        <Sheet
            open={open || sheetOpen}
            onOpenChange={() => {
                setOpen ? setOpen(prev => !prev) : setSheetOpen(prev => !prev)
            }}
        >
            <SheetTrigger asChild>
                {trigger}
            </SheetTrigger>
            <SheetContent side={side} className={`overflow-y-auto pb-4 ${className}`}>
                <SheetHeader>
                    {title && <SheetTitle>{title}</SheetTitle>}
                    {description && <SheetDescription>{description}</SheetDescription>}
                </SheetHeader>
                
                <div className={"px-3"}>
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    )
}