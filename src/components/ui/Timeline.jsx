export default function Timeline({ items }) {
  return (
    <div className="border-l border-gray-700 pl-6 space-y-8">
      {items.map((item, i) => (
        <div key={i}>
          <h3>{item.role}</h3>
          <p className="text-gray-400">{item.company}</p>
          <p className="text-sm text-gray-500">{item.duration}</p>

          <ul className="mt-2 list-disc list-inside text-gray-400">
            {item.highlights.map((h, idx) => (
              <li key={idx}>{h}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}