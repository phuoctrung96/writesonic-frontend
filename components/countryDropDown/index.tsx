import countries from "./semrushDatabases";

const CountryDropDown: React.FC<{
  value: string;
  onChange: (databaseCode: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div>
      <select
        id="location"
        name="location"
        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-pink-400 focus:border-transparent text-base"
        defaultValue="us"
        onChange={(e) => onChange(e.target.value)}
      >
        {countries.map(({ code, region }) => (
          <option key={code} value={code}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CountryDropDown;
