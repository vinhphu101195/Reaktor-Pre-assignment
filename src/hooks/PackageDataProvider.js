import React, { createContext, useMemo } from "react";
import text from "../status.txt";

export const dataContext = createContext();

const readTextFile = file => {
  let allText = null;
  const rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status === 0) {
        allText = rawFile.responseText;
      }
    }
  };
  rawFile.send(null);
  return allText;
};

const convertToObject = file =>
  readTextFile(file)
    .split(/Package: /)
    .map(text => text.split(/\n/))
    .reduce((acc, val) => {
      const [name, ...restOfData] = val;

      if (!name) {
        return acc;
      }

      const formatetdRestOfData = restOfData.map(data => {
        if (data.match(/^[A-Z]/)) {
          return data.split(": ");
        }
        return ["", data.trim()];
      }, {});

      return {
        ...acc,
        [name]: formatetdRestOfData
      };
    }, {});

export default function PackageDataProvider(props) {
  const packageData = useMemo(() => convertToObject(text), []);
  const packageNames = useMemo(() => Object.keys(packageData).sort(), [
    packageData
  ]);

  return (
    <dataContext.Provider value={{ packageNames, packageData }}>
      {props.children}
    </dataContext.Provider>
  );
}
