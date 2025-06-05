"use client";
import React, { useState } from 'react';

const VentasList: React.FC = () => {
	const [ventas] = useState<string[]>([]);

	return (
		<div>
			<h1>Ventas List</h1>
			<ul>
				{ventas.map((venta, index) => (
					<li key={index}>{venta}</li>
				))}
			</ul>
		</div>
	);
};

export default VentasList;