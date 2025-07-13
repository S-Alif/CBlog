"use client"

import {usePathname, useRouter} from "next/navigation";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import {useState} from "react";
import {infoToast} from "@/helpers/toasts/toastNofifications";
import {Input} from "@/components/ui/input";
import {Button, buttonVariants} from "@/components/ui/button";
import {SearchIcon, XIcon} from "lucide-react";
import Link from "next/link";
import {SelectItem} from "@/components/ui/select";
import {FilterSelectBox} from "@/components/BlogFilterOptions";

export default function UserFilterOptions() {
    
    const pathname = usePathname()
    const isDashboard = pathname.includes("/dashboard/users")
    const router = useRouter()
    
    const {
        updateParams,
        params:{
            page = "1",
            limit = "20",
            role = "all",
            gender = "all",
            verified = "all",
            approved = "all",
            blocked = "all",
            search = ""
        }
    } = useUpdateSearchParams()
    
    const [searchValue, setSearchValue] = useState(() => {
        if(search?.trim().length >= 5) return search
        return ""
    })
    
    // handle updating params
    const handleUpdateParams = (name, value) => {
        if(searchValue?.trim().length >= 5) return infoToast("Please clear the search field to apply other sorting factors")
        updateParams(name, value)
    }
    
    return (
        <div className={"pb-10"}>
            {/*search field and controls*/}
            <div className={"flex gap-2"}>
                <div className={"pb-5 flex-grow"}>
                    <Input
                        type={"text"}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder={"search users by name"}
                    />
                </div>
                
                {/*controls*/}
                <div className={"flex gap-2"}>
                    <Button
                        size={"icon"}
                        title={"Search something"}
                        onClick={() => {
                            const searchTerm = searchValue.trim()
                            if (searchTerm.length < 5) return infoToast("Please put at least 5 characters!")
                            if (isDashboard) {
                                return router.push(`/dashboard/users?search=${encodeURIComponent(searchValue)}`)
                                
                            }
                        }}
                    >
                        <SearchIcon/>
                    </Button>
                    
                    {/*reset button*/}
                    <Link
                        href={{
                            pathname: "/dashboard/users", query: {}
                        }}
                        title={"Reset all filters"}
                        onClick={() => {
                            setSearchValue("")
                        }}
                        className={buttonVariants({size: "icon", variant: "destructive"})}
                    >
                        <XIcon/>
                    </Link>
                
                </div>
            </div>
            
            {/*filter options*/}
            <div className="pt-3 gap-3 grid grid-cols-1 md:grid-cols-2">
                <FilterSelectBox
                    onChange={handleUpdateParams}
                    name={"limit"}
                    placeholder={"Select limit"}
                    value={limit}
                >
                    <SelectItem value={"20"}>20</SelectItem>
                    <SelectItem value={"40"}>40</SelectItem>
                    <SelectItem value={"60"}>60</SelectItem>
                </FilterSelectBox>
                
                {/*gender*/}
                <FilterSelectBox
                    onChange={handleUpdateParams}
                    name={"gender"}
                    placeholder={"Select gender"}
                    value={gender}
                >
                    <SelectItem value={"all"}>ALL</SelectItem>
                    <SelectItem value={"male"}>MALE</SelectItem>
                    <SelectItem value={"female"}>FEMALE</SelectItem>
                    <SelectItem value={"others"}>OTHERS</SelectItem>
                </FilterSelectBox>
                
                {/*user roles*/}
                <FilterSelectBox
                    onChange={handleUpdateParams}
                    name={"role"}
                    placeholder={"Select user role"}
                    value={role}
                >
                    <SelectItem value={"all"}>ALL</SelectItem>
                    <SelectItem value={"admin"}>Admins</SelectItem>
                    <SelectItem value={"moderators"}>Moderators</SelectItem>
                    <SelectItem value={"users"}>Users</SelectItem>
                </FilterSelectBox>
                
                {/*verified options*/}
                <FilterSelectBox
                    onChange={handleUpdateParams}
                    name={"verified"}
                    placeholder={"Select verified"}
                    value={verified}
                >
                    <SelectItem value={"all"}>ALL</SelectItem>
                    <SelectItem value={"true"}>Verified</SelectItem>
                    <SelectItem value={"false"}>Not Verified</SelectItem>
                </FilterSelectBox>
                
                {/*approved options*/}
                <FilterSelectBox
                    onChange={handleUpdateParams}
                    name={"approved"}
                    placeholder={"Select approved"}
                    value={approved}
                >
                    <SelectItem value={"all"}>ALL</SelectItem>
                    <SelectItem value={"true"}>Approved</SelectItem>
                    <SelectItem value={"false"}>Not Approved</SelectItem>
                </FilterSelectBox>
                
                {/*block options*/}
                <FilterSelectBox
                    onChange={handleUpdateParams}
                    name={"blocked"}
                    placeholder={"Select blocked options"}
                    value={blocked}
                >
                    <SelectItem value={"all"}>ALL</SelectItem>
                    <SelectItem value={"true"}>Blocked</SelectItem>
                    <SelectItem value={"false"}>Not Blocked</SelectItem>
                </FilterSelectBox>
            </div>
        </div>
    )
}
