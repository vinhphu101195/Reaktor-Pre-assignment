import React, { useContext, useState, useRef, useEffect } from "react";
import { dataContext } from "../context/Context";
import useDebounce from "./Debounce";
import HomePage from "../pages/HomePage";

export default function Home() {
  const { nameList, packageData } = useContext(dataContext);
  const [namePackages, setNamePackages] = useState(nameList);
  //data: {alphabet: [],alphabet:[]};
  const sortObject = Object.keys(packageData)
    .sort()
    .reduce((acc, value) => {
      return {
        ...acc,
        [value[0]]: (acc[value[0]] === undefined ? [] : acc[value[0]]).concat(
          value
        )
      };
    }, {});
  const [displayPackage, setDisplayPackage] = useState();
  const [filter, setfilter] = useState();
  const itemRef = useRef();
  const inputRef = useRef();
  const debouncedSearchTerm = useDebounce(filter, 1000);

  useEffect(() => {
    onFilter(filter);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    // scrool to the current packages
    if (itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [displayPackage]);

  function showDepends(data) {
    if (data) {
      return data
        .split(", ")
        .map(element => {
          return element.split(" ");
        })
        .map((item, index) => {
          if (Object.keys(packageData).includes(item[0])) {
            // 1 package
            //data [string,string,string]
            if (item[1] !== "|") {
              return (
                <div
                  key={index}
                  className="depend"
                  onClick={() => {
                    setDisplayPackage(item[0]);
                    inputRef.current.value = "";
                    setfilter();
                  }}
                >
                  {`${item[0]} ${item[1] ? `${item[1]} ${item[2]}` : ""}`}
                </div>
              );
            } else {
              // there are alternates
              return (
                <div className="flex" key={index}>
                  <div
                    key={index}
                    className="depend"
                    onClick={() => {
                      setDisplayPackage(item[0]);
                      inputRef.current.value = "";
                      setfilter();
                    }}
                  >
                    {item[0]}
                  </div>
                  <div> &nbsp; {` ${item[1]} ${item[2]}`}</div>
                </div>
              );
            }
          } else {
            return <div key={item[0]}> {item[0]}</div>;
          }
        });
    } else {
      return "n/a";
    }
  }

  function onFilter(filter) {
    if (filter) {
      setNamePackages(
        sortObject[filter[0]].filter(element => {
          return element.startsWith(filter);
        })
      );
    } else {
      setNamePackages(Object.keys(packageData).sort());
    }
  }

  return (
    <HomePage
      inputRef={inputRef}
      setfilter={setfilter}
      itemRef={itemRef}
      filter={filter}
      namePackages={namePackages}
      setDisplayPackage={setDisplayPackage}
      displayPackage={displayPackage}
      detailPackage={packageData[displayPackage]}
      detailPackageDepend={displayPackage?showDepends(packageData[displayPackage].Depends):"n/a"}
    ></HomePage>
  );
}
