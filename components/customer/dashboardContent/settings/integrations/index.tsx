import Semrush from "./semrush";
import Wordpress from "./wordpress";

const Integrations: React.FC = () => {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-75">
      <li>
        <Semrush />
      </li>
      <li>
        <Wordpress />
      </li>
    </ul>
  );
};

export default Integrations;
