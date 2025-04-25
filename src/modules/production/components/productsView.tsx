import React from 'react';

interface ProductionData {
  produccion: string;
  descripcion: string;
}

interface ProductsViewProps {
  data: ProductionData[];
}

const ProductsView: React.FC<ProductsViewProps> = ({ data }) => {
  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Productos</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Descripción</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">{item.produccion}</td>
            <td className="border border-gray-300 px-4 py-2">{item.descripcion}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductsView;