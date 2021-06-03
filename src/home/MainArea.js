import React, { useState } from "react";
import Typer from "./Typer.js";

export default function MainArea(props) {
	const [typing, setTyping] = useState(true);
	const [WPM, setWPM] = useState(0);

	if (typing) {
		return (
			<Typer
				text="hi there"
				finished={(stateHistory) => {
					setWPM(calcWPM(stateHistory));
					setTyping(false);
				}}
			/>
		);
	} else {
		return <h1>WPM: {WPM}</h1>;
	}
}

function calcWPM(stateHistory) {
	return 8
}
