import React from 'react';

// 1. Define the "shape" of a single item
type Item = {
  id: string | number; // React keys should be a string or number
  title: string;
  image: string;
  subtitle?: string; // The '?' makes this property optional
};

// 2. Define the "shape" of the component's props
type ListPageProps = {
  title: string;
  description: string;
  items: Item[]; // 'items' is an array of 'Item' objects
};

// 3. Apply the type to the component's props
export default function ListPage({ title, description, items }: ListPageProps) {
  return (
    <main className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600 text-lg">{description}</p>
      </div>

      {/* Grid of items */}
      <div className="grid grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-60 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              {item.subtitle && (
                <p className="text-gray-500 text-sm">{item.subtitle}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}