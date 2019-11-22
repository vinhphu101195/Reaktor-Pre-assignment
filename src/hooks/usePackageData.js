import { useContext } from "react";

import { dataContext } from "./PackageDataProvider";

const usePackageData = () => {
  return useContext(dataContext);
};

export default usePackageData;
