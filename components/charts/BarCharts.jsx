import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";


// label renderer
const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
    return (
        <text
            x={x + width / 2}
            y={y}
            textAnchor="middle"
            className={"text-primary-foreground text-sm"}
            dy={-6}
        >
            {`${value}`}
        </text>
    );
};

// Bar chart
export default function BarCharts({
    data = null,
    chartCaption = "Enter a caption",
    chartFillColor="#5404b4",
    nameKey = "name",
    dataKey = "count"
}) {
    
    if(!data) {
        return (
            <Card className={"p-3"}>
                <p>Please enter data</p>
            </Card>
        )
    }
    // console.log(data)
    
    return (
        <Card>
            <CardContent className="h-[300px] overflow-auto">
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <BarChart
                        data={data}
                        margin={{ top: 30, right: 20, left: 20, bottom: 20 }}
                    >
                        <XAxis dataKey={nameKey} />
                        <YAxis domain={[0, 'dataMax + 2']} />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <Tooltip
                            wrapperStyle={{
                                backgroundColor: "transparent",
                            }}
                            contentStyle={{
                                borderRadius: "var(--radius-sm)",
                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.25)",
                            }}
                        />
                        <Bar
                            dataKey={dataKey}
                            barSize={30}
                            fill={chartFillColor}
                            label={renderCustomBarLabel}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
            <CardFooter>
                <p className={"text-center mt-5 py-2 px-3 rounded-md w-full font-medium bg-gray-200"}>{chartCaption}</p>
            </CardFooter>
        </Card>
    )
}