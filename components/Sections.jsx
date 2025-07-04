import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {Fragment} from "react";
import {Loader} from "./Loader"

// breadcrumb
export function DisplayBreadcrumb ({breadcrumbs = []}) {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                    <Fragment key={index}>
                        <BreadcrumbItem>
                            <p className="text-sm">{item}</p>
                        </BreadcrumbItem>
                        {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

// page section
export function PageSection({children, id = "page", className = "", breadcrumbs = []}) {
    return (
        <section className={className} id={id}>
            {
                breadcrumbs.length > 0 &&
                <div className="container mb-10">
                    <DisplayBreadcrumb breadcrumbs={breadcrumbs} />
                </div>
            }
            <div>
                {children}
            </div>
        </section>
    )
}

// section title
export function SectionTitle({children}) {
    return (
        <h2 className="section-title">
            {children}
        </h2>
    )
}

// individual sections
export function IndividualSection({
    children,
    className = "",
    sectionId = "individual",
    sectionTitle = null,
    containerClassName = "",
    loading= false,
    sectionSideComponents = null
}) {
    return (
        <section className={className} id={sectionId}>
            <div className="container">
                {
                    sectionTitle &&
                    <div className={"flex justify-between w-full"}>
                        <SectionTitle>{sectionTitle}</SectionTitle>
                        {
                            sectionSideComponents &&
                            <div>
                                {sectionSideComponents}
                            </div>
                        }
                    </div>
                }
                
                {
                    (!sectionTitle && sectionSideComponents) &&
                    <div className={"mb-12"}>
                        {sectionSideComponents}
                    </div>
                }
                
                {
                    loading ?
                        <Loader/> :
                        <div className={containerClassName}>
                            {children}
                        </div>
                }
            </div>
        </section>
    )
}