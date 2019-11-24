import React, { createContext, useState } from "react";
import text from "../status.txt";

export const dataContext = createContext();

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

export default function Context(props) {
  const packageData = convertToObject(text);
  const [nameList,setNameList] = useState(Object.keys(packageData).sort())
  const sortObject = Object.keys(packageData).sort().reduce((acc, value) => {
    return {
      ...acc,
      [value[0]]: (acc[value[0]] === undefined ? [] : acc[value[0]]).concat(value)
    };
  }, {});

  function onFilter(filter){
    if(filter.length>=1){

      setNameList(sortObject[filter[0]].filter(element=>{
        return(element.startsWith(filter))
      }));
    }else{
      setNameList(Object.keys(packageData).sort());
    }
  }
  
  return (
    <dataContext.Provider value={{ nameList, packageData,onFilter }}>
      {props.children}
    </dataContext.Provider>
  );
}
