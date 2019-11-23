import React, { useContext, useState, useRef, useEffect } from "react";
import { dataContext } from "../context/Context";

// debounce Hook
function useDebounce(value, delay) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

export default function Home() {
  const { nameList, packageData } = useContext(dataContext);
  const [displayPackage, setDisplayPackage] = useState();
  const [filter, setfilter] = useState();
  const itemRef = useRef();

  const debouncedSearchTerm = useDebounce(filter, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log(filter);
    }
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
      if (nameList.includes(item[0])) {
        // 1 package
        //data [libacl1,(=,2.2.52-3build1)]
        if (item[1] !== "|") {
          return (
            <div
              key={index}
              className="depend"
              onClick={() => {
                setDisplayPackage(item[0]);
              }}
            >
              {`${item[0]} ${item[1] ? `${item[1]} ${item[2]}` : ""}`}
            </div>
          );
        } else {
          // 2 packages
          // data [ubuntu-mono,|,adwaita-icon-theme-full]
          // case adwaita-icon-theme-full in list
          if (nameList.includes(item[2])) {
            // there are two packages (alternative) in the list
            return (
              <div className="flex">
                <div
                  key={index}
                  className="depend"
                  onClick={() => {
                    setDisplayPackage(item[0]);
                  }}
                >
                  {item[0]}
                </div>
                <div> &nbsp; {item[1]} &nbsp;</div>
                <div
                  key={index}
                  className="depend"
                  onClick={() => {
                    setDisplayPackage(item[2]);
                  }}
                >
                  {item[2]}
                </div>
              </div>
            );
          } else {
            // alternative not in the list
            // case adwaita-icon-theme-full not in list
            return (
              <div className="flex" key={index}>
                <div
                  key={index}
                  className="depend"
                  onClick={() => {
                    setDisplayPackage(item[0]);
                  }}
                >
                  {item[0]}
                </div>
                <div> &nbsp; {` ${item[1]} ${item[2]}`}</div>
              </div>
            );
          }
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

  return (
    <div className="container">
      <div className="navbar">
        <input
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
            {nameList.map((name, index) => {
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
            })}
          </div>
        </div>
      </div>

      <div className="rightside">{showDetail(packageData, displayPackage)}</div>
    </div>
  );
}
