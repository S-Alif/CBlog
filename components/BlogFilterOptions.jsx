"use client"

import {usePathname, useRouter} from "next/navigation";
import {useIsMobile} from "@/hooks/use-mobile";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Button, buttonVariants} from "@/components/ui/button";
import {FilterIcon, SearchIcon, XIcon} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import useUpdateSearchParams from "@/hooks/useUpdateSearchParams";
import infoStore from "@/stores/infoStore";
import Link from "next/link";
import {infoToast} from "@/helpers/toasts/toastNofifications";


// filter option select box
function FilterSelectBox({
    onChange,
    name,
    placeholder = "Select Something",
    value,
    children,
}) {
    
    return (
        <div>
            <p className={"pb-2 capitalize text-sm font-medium"}>{name}</p>
            <Select
                value={value}
                onValueChange={(e) => {
                    onChange(name, e)
                }}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                
                <SelectContent>
                    {children}
                </SelectContent>
            </Select>
        </div>
    );
}


// blog filter options
export default function BlogFilterOptions() {
    
    const pathname = usePathname()
    const isDashboard = pathname.includes("/dashboard/blogs")
    const isMobile = useIsMobile()
    const router = useRouter()
    const {
        updateParams,
        params:{
            limit = "20",
            sort = "all",
            category = "all",
            tag = "all",
            published="all",
            blocked = "all",
            search = ""
        }
    } = useUpdateSearchParams()
    // console.log(limit, sort, category, tag)
    
    const {category: categoryList, tags} = infoStore()
    const [searchValue, setSearchValue] = useState(() => {
        if(search?.trim().length >= 10) return search
        return ""
    })
    
    // handle updating params
    const handleUpdateParams = (name, value) => {
        if(searchValue?.trim().length >= 10) return infoToast("Please clear the search field to apply other sorting factors")
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
                        placeholder={"search blogs by name"}
                    />
                </div>
                
                {/*controls*/}
                <div className={"flex gap-2"}>
                    <Button
                        size={"icon"}
                        title={"Search something"}
                        onClick={() => {
                            const searchTerm = searchValue.trim()
                            if(searchTerm.length < 10) return infoToast("Please put at least 10 characters!")
                            if(isDashboard){
                                return router.push(`/dashboard/blogs?search=${encodeURIComponent(searchValue)}`)
                                
                            }
                            // go to a search page for public
                        }}
                    >
                        <SearchIcon/>
                    </Button>
                    
                    {/*reset button*/}
                    <Link
                        href={{
                            pathname: "/dashboard/blogs",
                            query: {}
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
                
                {/*category select*/}
                <FilterSelectBox
                    onChange={handleUpdateParams}
                    name={"category"}
                    placeholder={"Select category"}
                    value={category}
                >
                    <SelectItem value={"all"}>ALL</SelectItem>
                    {
                        categoryList.map((item, index) => (
                            <SelectItem value={item?._id} key={index}>{item?.name}</SelectItem>
                        ))
                    }
                </FilterSelectBox>
                
                {/*tags select*/}
                <FilterSelectBox
                    onChange={handleUpdateParams}
                    name={"tag"}
                    placeholder={"Select tag"}
                    value={tag}
                >
                    <SelectItem value={"all"}>ALL</SelectItem>
                    {
                        tags.map((item, index) => (
                            <SelectItem value={item?._id} key={index}>#{item?.name}</SelectItem>
                        ))
                    }
                </FilterSelectBox>
                
                {/*sort options*/}
                <FilterSelectBox
                    onChange={handleUpdateParams}
                    name={"sort"}
                    placeholder={"Select Sort"}
                    value={sort}
                >
                    <SelectItem value={"all"}>ALL</SelectItem>
                    <SelectItem value={"recent"}>Recent</SelectItem>
                    <SelectItem value={"popular"}>Most popular</SelectItem>
                    <SelectItem value={"featured"}>Featured</SelectItem>
                </FilterSelectBox>
                
                {/*published options*/}
                <FilterSelectBox
                    onChange={handleUpdateParams}
                    name={"published"}
                    placeholder={"Select published options"}
                    value={published}
                >
                    <SelectItem value={"all"}>ALL</SelectItem>
                    <SelectItem value={"yes"}>Published</SelectItem>
                    <SelectItem value={"no"}>Not Published</SelectItem>
                </FilterSelectBox>
                
                {/*block options*/}
                <FilterSelectBox
                    onChange={handleUpdateParams}
                    name={"blocked"}
                    placeholder={"Select blocked options"}
                    value={blocked}
                >
                    <SelectItem value={"all"}>ALL</SelectItem>
                    <SelectItem value={"yes"}>Blocked</SelectItem>
                    <SelectItem value={"no"}>Not Blocked</SelectItem>
                </FilterSelectBox>
            </div>
        </div>
    );
}
