import { Dispatch, SetStateAction } from "react";
import { SemrushSearchOutput } from "../../../../api/semrush";
import ColumnContent from "./columnContent";

const TableHeader: React.FC<{
  data: SemrushSearchOutput;
  filterColumnIndex: number;
  setFilterColumnIndex: (value: SetStateAction<number>) => void;
  isAscending: boolean;
  setIsAscending: Dispatch<SetStateAction<boolean>>;
}> = ({
  data,
  filterColumnIndex,
  setFilterColumnIndex,
  isAscending,
  setIsAscending,
}) => {
  const columnClasses = (index: number) => {
    let classes =
      "text-left text-xs font-medium text-gray-500 capitalize tracking-wider";
    if (index === 2 || index === 3 || index === 4 || index === 5) {
      classes += " cursor-pointer select-none";
    }
    if (index === filterColumnIndex) {
      classes += " bg-gray-200";
    }

    return classes;
  };

  return (
    <tr>
      {data?.columnNames?.map((columnName, index) => (
        <th key={index} scope="col" className={columnClasses(index)}>
          <ColumnContent
            index={index}
            columnName={columnName}
            filterColumnIndex={filterColumnIndex}
            setFilterColumnIndex={setFilterColumnIndex}
            isAscending={isAscending}
            setIsAscending={setIsAscending}
          />
        </th>
      ))}
      <th scope="col" className="relative">
        <span className="sr-only px-6 py-3 text-center">Edit</span>
      </th>
    </tr>
  );
};

export default TableHeader;
