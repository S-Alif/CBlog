"use client"

import {IndividualSection, PageSection} from "@/components/Sections";
import DisplayDialogue from "@/components/DisplayDialogue";
import CategoryForm from "@/app/(dashboard)/dashboard/category/CategoryForm";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import infoStore from "@/stores/infoStore";
import {DisplayCategory} from "@/components/DisplayCategory";


export default function CategoryDashboardPage() {
    
    const {category, setInfo} = infoStore()
    
    return (
        <PageSection
            id={"category-dashboard-page"}
            className={"page-section !pt-10"}
        >
            <IndividualSection
                sectionId={"display-category-list"}
                sectionTitle={"All categories"}
                sectionSideComponents={
                    <DisplayDialogue
                        trigger={<Button size={"icon"}><PlusIcon /></Button>}
                        title={"Add new category"}
                        description={"Add new categories from here"}
                    >
                        <CategoryForm />
                    </DisplayDialogue>
                }
            >
                <DisplayCategory items={category} />
            
            </IndividualSection>
        
        </PageSection>
    );
 }
