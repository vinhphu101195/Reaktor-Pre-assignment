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
  const debouncedSearchTerm = useDebounce(filter, 500);

  useEffect(() => {
    onFilter(filter);
  }, [debouncedSearchTerm]);

  function showDepends(data) {
    // to check the depends is in the packages list
    if (data) {
      return data
        .split(", ")
        .map(element => {
          return element.split(" ");
        })
        .map((item, index) => {
          if (Object.keys(packageData).includes(item[0])) {
            // 1 package don't have alternates
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
                  {`${item.join(" ")}`}
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
                  <div>                   
                    &nbsp; {item[1]}  &nbsp;
                    {/* check the list includes alternates */} 
                    {Object.keys(packageData).includes(item[2]) ? (
                      <span
                        key={index}
                        className="depend"
                        onClick={() => {
                          setDisplayPackage(item[2]);
                          inputRef.current.value = "";
                          setfilter();
                        }}
                      >
                        {item[2]}
                      </span>
                    ) : (
                      item[2]
                    )}
                  </div>
                </div>
              );
            }
          } else {
            return <div key={item[0]}> {item}</div>;
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
      itemRef={itemRef}
      setfilter={setfilter}
      filter={filter}
      namePackages={namePackages}
      setDisplayPackage={setDisplayPackage}
      displayPackage={displayPackage}
      detailPackage={packageData[displayPackage]}
      detailPackageDepend={
        displayPackage
          ? showDepends(packageData[displayPackage].Depends)
          : "n/a"
      }
    ></HomePage>
  );
}
