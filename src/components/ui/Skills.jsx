export default function Skills({ data }) {
  return (
    <div className="space-y-6">
      {Object.entries(data).map(([category, list]) => (
        <div key={category}>
          <h3 className="capitalize mb-2">{category}</h3>

          <div className="flex flex-wrap gap-2">
            {list.map((skill, i) => (
              <span key={i} className="tag">{skill}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}