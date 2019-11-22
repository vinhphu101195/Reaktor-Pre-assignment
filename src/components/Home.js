import React, { useContext,useState,useEffect } from "react";
import { dataContext } from "../context/Context";
import List from "./List";

export default function Home() {
  const { nameList, getDetailFunction, packageDetail,Onfilter } = useContext(
    dataContext
  );
  const [filter,setfilter] = useState();
  useEffect(()=>{
    Onfilter(filter);
  },[filter]);
  
  console.log(packageDetail);
  
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
                getDetailFunction(item[0]);
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
                    getDetailFunction(item[0]);
                  }}
                >
                  {item[0]}
                </div>
                <div> &nbsp; {item[1]} &nbsp;</div>
                <div
                  className="depend"
                  onClick={() => {
                    getDetailFunction(item[1]);
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
                    getDetailFunction(item[0]);
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

  return (
    <div className="container">
      <div className="navbar">
        <input
          className="navbar__input"
          type="text"
          placeholder="input name of package"
          onChange={e =>{ setfilter(e.target.value)}}
        ></input>
      </div>
      <List></List>


      {/* check ton tai package hay ko */}
      <div className="rightside">
        <div className="packages__information">
          <h1>{packageDetail.name}</h1>
          <div>Status: {packageDetail.status}</div>
          <div>
            Priority: {packageDetail.priority ? packageDetail.priority : "n/a"}
          </div>
          <div>
            Architecture:{" "}
            {packageDetail.architecture ? packageDetail.architecture : "n/a"}
          </div>
          <div>
            Source: {packageDetail.source ? packageDetail.source : "n/a"}
          </div>

          <div>
            Depends:{" "}
            {packageDetail.depends ? showDepends(packageDetail.depends) : "n/a"}
          </div>
          <div className="description">
            Description: {packageDetail.description}
          </div>
        </div>
      </div>
    </div>
  );
}
