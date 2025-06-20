// used in dashboards to show quick data summary
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export function DataCards ({item}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{item?.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <h3 className={"text-3xl"}>{item?.data}</h3>
            </CardContent>
        </Card>
    )
}

// used in dashboards show data cards with the same layout all across the app
export function DisplayDataCards ({items = []}) {
    return (
        <div className={"w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"}>
            {
                items.map((item, index) => (
                    <DataCards item={item} key={index} />
                ))
            }
            {
                items.length === 0 && <h3 className={"font-bold text-2xl text-center"}>No Cards to show</h3>
            }
        </div>
    )
}