const intents = [
  { name: "Commercial", bgColor: "#d9b3f7" },
  { name: "Informational", bgColor: "#b3baf7" },
  { name: "Navigational", bgColor: "#b3f7c6" },
  { name: "Transactional", bgColor: "#f7c6b3" },
];

const Intent: React.FC<{ data: string[] }> = ({ data }) => {
  return (
    <p>
      {data.map((item, index) => (
        <span
          key={item}
          style={{ backgroundColor: intents[item]?.bgColor }}
          className="mx-1 px-2 py-0.5 rounded-full"
        >
          {intents[item]?.name}
        </span>
      ))}
    </p>
  );
};

export default Intent;
