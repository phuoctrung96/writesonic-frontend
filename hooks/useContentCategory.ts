import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Category } from "../api/category";

const useContentCategory = (): [Category] => {
  const router = useRouter();
  const { contentCategory } = router.query;
  const categories = useSelector((state: any) => state.main.categories);
  const [category, setCategory] = useState<Category>(null);
  useEffect(() => {
    setCategory(
      categories?.find(({ package_name }) => package_name === contentCategory)
    );
  }, [categories, contentCategory]);

  return [category];
};

export default useContentCategory;
