"use client"

import {IndividualSection, PageSection} from "@/components/Sections";
import DisplayDialogue from "@/components/DisplayDialogue";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import infoStore from "@/stores/infoStore";
import {DisplayTags} from "@/components/DisplayTags";
import TagsForm from "@/app/(dashboard)/dashboard/tags/TagsForm";

export default function TagsDashboardPage() {
    
    const {tags} = infoStore()
    
    return (
        <PageSection
            id={"tags-dashboard-page"}
            className={"page-section !pt-10"}
        >
            <IndividualSection
                sectionId={"display-category-list"}
                sectionTitle={"All Tags"}
                sectionSideComponents={
                    <DisplayDialogue
                        trigger={<Button size={"icon"}><PlusIcon /></Button>}
                        title={"Add new tags"}
                        description={"Add new tags from here (ONLY FOR ADMIN)"}
                    >
                        <TagsForm />
                    </DisplayDialogue>
                }
            >
                <DisplayTags items={tags} />
            </IndividualSection>
        </PageSection>
    );
 }
