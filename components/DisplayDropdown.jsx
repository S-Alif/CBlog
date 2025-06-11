import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"

const DisplayDropdown = ({ children, trigger }) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            <DropdownMenuContent>
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DisplayDropdown