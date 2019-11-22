import React, { useContext, useState, useEffect } from "react";
import { dataContext } from "../context/Context";

export default function Home() {
  const { nameList, packageData } = useContext(dataContext);
  const [displayPackage, setDisplayPackage] = useState();
  const [filter, setfilter] = useState();

  console.log(packageData);

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
          if (nameList.includes(item[2])) {
            // there are two packages (alternative) in the list
            return (
              <div className="flex">
                <div
                  className="depend"
                  onClick={() => {
                    setDisplayPackage(item[0]);
                  }}
                >
                  {item[0]}
                </div>
                <div> &nbsp; {item[1]} &nbsp;</div>
                <div
                  className="depend"
                  onClick={() => {
                    setDisplayPackage(item[1]);
                  }}
                >
                  {item[2]}
                </div>
              </div>
            );
          } else {
            // alternative not in the list
            return (
              <div className="flex">
                <div
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
        return <div key={index}> {item[0]}</div>;
      }
    });
  }

  function showDetail(packages, name) {
    if (packages && name) {
      console.log(packages[name]);

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
                  key={index}
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
