import React from 'react';

interface ProductionData {
  produccion: string;
  perdidas: number;
  fecha: string;
}

interface LossesViewProps {
  data: ProductionData[];
}

const LossesView: React.FC<LossesViewProps> = ({ data }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Producto</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Pérdidas</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Fecha</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">{item.produccion}</td>
            <td className="border border-gray-300 px-4 py-2">{item.perdidas}</td>
            <td className="border border-gray-300 px-4 py-2">{item.fecha}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LossesView;