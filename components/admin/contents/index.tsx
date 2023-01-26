import { useRouter } from "next/router";
import { navData } from "../navData";

export default function Contents() {
  const router = useRouter();
  return (
    <div className="p-3 sm:p-8 h-full relative overflow-y-auto">
      {Object.keys(navData)?.map((key) => {
        const items = navData[key];
        return (
          <div key={key}>
            {items?.map(({ routeName, Component }) => {
              if (routeName === router?.query?.category && Component) {
                return (
                  <div key={routeName}>
                    <Component />
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
