"use client"

import infoStore from "@/stores/infoStore";
import {useEffect} from "react";

export default function Home() {

	const {getInitialData} = infoStore()

	useEffect(() => {
		if(typeof window !== "undefined") {
			(async () => {await getInitialData()})()
		}
	}, [])

	return (
		<div className="">
			<p className="text-xl">git push -u origin main</p>
		</div>
	);
}
