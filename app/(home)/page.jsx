"use client"

import infoStore from "@/stores/infoStore";
import {useEffect} from "react";
import actorStore from "@/stores/actorStore";

export default function Home() {

	const {getInitialData} = infoStore()
	const {setUser} = actorStore()

	useEffect(() => {
		if(typeof window !== "undefined") {
			getInitialData()
			setUser()
		}
	}, [])

	return (
		<div className="">
			<p className="text-xl">git push -u origin main</p>
		</div>
	);
}
