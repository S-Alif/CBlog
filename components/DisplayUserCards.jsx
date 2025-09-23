import {Card} from "@/components/ui/card";


// user profile card
export function UserCards({item}) {
    return (
        <Card>
            {/*bg and profile image*/}
            <div className="w-full aspect-video relative">
                <img
                    src={item?.bannerImg || "https://tinyurl.com/5cs82b8b"}
                    alt={"User banner"}
                    className={"object-cover object-center w-full h-full block"}
                />
                
                {/*user avatar*/}
                <div className={"absolute bottom-0 left-1/2"}>
                    <div className={"w-[200px] h-[200px] rounded-full mx-auto"}>
                        <img
                            src={item?.image || "https://tinyurl.com/y38vjz7u"}
                            alt={item?.name || "User profile avatar"}
                            className={"object-cover object-center w-full h-full block"}
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}

// display cards
export default function DisplayUserCards({items = []}) {
    return (
        <div className={"w-full h-auto"}>
            <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}>
                {
                    items.map((item, index) => (
                        <UserCards item={item} key={index} />
                    ))
                }
                
            </div>
            {
                items.length === 0 &&
                <h3 className={"font-bold text-2xl text-center"}>No users to show</h3>
            }
        </div>
    );
}
