import React, { useContext, useState, useRef, useEffect } from "react";
import { dataContext } from "../context/Context";
import useDebounce from "./Debounce";

export default function Home() {
  const { nameList, packageData } = useContext(dataContext);
  const [namePackages, setNamePackages] = useState(nameList);
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

  function splitDepend(depends) {
    if (depends) {
      const depend = depends.split(", ").map(element => {
        return element.split(" ");
      });
      return depend;
    }
    return [];
  }

  function showDepends(data) {
    return data.map((item, index) => {
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
  }

  function showDetail(packages, name) {
    if (packages && name) {
      return (
        <div className="packages__information">
          <h1>{name}</h1>
          <div>Status: {packages[name].Status}</div>
          <div>
            Priority:{" "}
            {packages[name].Priority ? packages[name].Priority : "n/a"}
          </div>
          <div>
            Architecture:{" "}
            {packages[name].Architecture ? packages[name].Architecture : "n/a"}
          </div>
          <div>
            Source: {packages[name].Source ? packages[name].Source : "n/a"}
          </div>

          <div>
            Depends:{" "}
            {packages[name].Depends
              ? showDepends(splitDepend(packages[name].Depends))
              : "n/a"}
          </div>
          <div className="description">
            Description: {packages[name].Description}
          </div>
        </div>
      );
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
    <div className="container">
      <div className="navbar">
        <input
          ref={inputRef}
          className="navbar__input"
          type="text"
          placeholder="input name of package"
          onChange={e => {
            setfilter(e.target.value);
          }}
        ></input>
      </div>
      <div className="leftside">
        <div className="packages__name">
          <div className="packages__name__container">
            <h2>The Package Name</h2>
            {namePackages.length >= 1 ? (
              namePackages.map(name => {
                return (
                  <div
                    ref={displayPackage === name ? itemRef : null}
                    key={name}
                    className={
                      displayPackage === name
                        ? "packages-Name-List active"
                        : "packages-Name-List"
                    }
                    onClick={() => setDisplayPackage(name)}
                  >
                    {name}
                  </div>
                );
              })
            ) : (
              <div>don't have package: {filter}</div>
            )}
          </div>
        </div>
      </div>

      <div className="rightside">{showDetail(packageData, displayPackage)}</div>
    </div>
  );
}
