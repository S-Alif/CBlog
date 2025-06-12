import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const DisplayDropdown = ({ children, trigger, className="" }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            <DropdownMenuContent className={className}>
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DisplayDropdown