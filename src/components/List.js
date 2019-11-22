import React, { useContext } from "react";
import { dataContext } from "../context/Context";

export default function List(props) {
  const { nameList, getDetailFunction, packageDetail } = useContext(
    dataContext
  );

  function showPackagenameList(names) {
    return names.map((name, index) => {
      return (
        <div
          key={index}
          className={
            packageDetail.name === name
              ? "packages-Name-List active"
              : "packages-Name-List"
          }
          onClick={() => {
            getDetailFunction(name);
          }}
        >
          {name}
        </div>
      );
    });
  }

  return (
    <div className="leftside">
      <div className="packages__name">
        <div className="packages__name__container">
          <h2>The Package Name</h2>
          {showPackagenameList(nameList)}
        </div>
      </div>
    </div>
  );
}
