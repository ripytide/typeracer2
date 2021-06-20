import React from 'react'

export default function Picker({ items, callback }) {
	return (
		<div>
			{items.map((item) => (
				<button key={item} onClick={() => callback(item)}>
					{item}
				</button>
			))}
		</div>
	)
}
