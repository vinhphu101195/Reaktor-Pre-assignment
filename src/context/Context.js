import React, { createContext, useState } from "react";
import text from "../status.txt";

export const dataContext = createContext();

export default function Context(props) {
  const [packageData, setPackageData] = useState(convertToObject(text));
  const [nameList, setNameList] = useState(Object.keys(packageData).sort());
  const [filterList, setFilterList] = useState(Object.keys(packageData).sort());
  const [packageDetail, setPackageDetail] = useState({
    name: nameList[1],
    description: packageData[nameList[1]].Description,
    status: packageData[nameList[1]].Status,
    depends: splitDepend([nameList[1]]),
    source: packageData[nameList[1]].Source,
    architecture: packageData[nameList[1]].Architecture,
    priority: packageData[nameList[1]].Priority
  });

  // read file function
  function readTextFile(file) {
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
  }
  //convert string to JSON
  function convertToObject(file) {
    // split function to object array for using.
    const outputData = readTextFile(file)
      .split(/Package: /)
      .map(text => text.split(/\n/))
      .reduce((acc, val) => {
        const [name, ...restOfData] = val;
        let descriptionstring = "";
        // slipt data from [status: install ok installed] to ["status" , "install ok installed"]
        const formateData = restOfData
          .map(data => {
            const newdata = data.replace(": ", "#").split("#");
            return newdata;
          })
          .reduce((accumulator, value) => {
            // value = ["status","install ok installed"]
            const [key, valueOfObject] = value;
            // key = "status", valueOfObject= install ok installed

            // to get the description value
            if (key[0] === " " && key[1] !== "/") {
              descriptionstring = `${descriptionstring}\n${key}`;
            } else if (key === "Description") {
              //get the value of Description
              descriptionstring += valueOfObject;
            }

            // convert array to object and remove undefined value
            if (valueOfObject === undefined) {
              return {
                ...accumulator
              };
            }
            return {
              ...accumulator,
              [key]: valueOfObject
            };
          }, {});
        // edit the Description with full data
        formateData.Description = descriptionstring;
        // convert to the object with the package name is the key.
        return {
          ...acc,
          [name]: formateData
        };
      }, {});
    return outputData;
  }

  function splitDepend(name) {
    if (packageData[name].Depends) {
      const depend = packageData[name].Depends.split(", ").map(element => {
        return element.split(" ");
      });
      return depend;
    }
    return "";
  }

  function Onfilter(filter) {
    console.log("dc goi");
    if (filter) {
      setFilterList(
        filterList.filter(name => {
          return name.startsWith(filter);
        })
      );

      setNameList(filterList);
    } else {
      setNameList(Object.keys(packageData).sort());
    }
  }

  const getDetailFunction = packageName => {
    const depend = splitDepend(packageName);

    setPackageDetail({
      name: packageName,
      description: packageData[packageName].Description,
      status: packageData[packageName].Status,
      depends: depend,
      source: packageData[packageName].Source,
      architecture: packageData[packageName].Architecture,
      priority: packageData[packageName].Priority
    });
  };

  

  return (
    <dataContext.Provider
      value={{ nameList, getDetailFunction, packageDetail, Onfilter }}
    >
      {props.children}
    </dataContext.Provider>
  );
}
