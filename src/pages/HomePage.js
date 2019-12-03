import React, { useEffect } from "react";

export default function HomePage(props) {
  useEffect(() => {
    // scrool to the current packages
    if (props.itemRef.current) {
      props.itemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  }, [props.displayPackage]);

  console.log(props.detailPackage);

  function showDetail(packages, name, depend) {
    if (packages && name) {
      return (
        <div className="packages__information">
          <h1>{name}</h1>
          <div>Status: {packages.Status}</div>
          <div>Priority: {packages.Priority ? packages.Priority : "n/a"}</div>
          <div>
            Architecture:{" "}
            {packages.Architecture ? (
              <span
                className="reverseDepen"
                onClick={() => {
                  props.setfilter(packages.Architecture);
                  props.inputRef.current.value = packages.Architecture;
                }}
              >
                {packages.Architecture}
              </span>
            ) : (
              "n/a"
            )}
          </div>
          <div>
            Source:{" "}
            {packages.Source ? (
              <span
                className="reverseDepen"
                onClick={() => {
                  props.setfilter(packages.Source);
                  props.inputRef.current.value = packages.Source;
                }}
              >
                {packages.Source}
              </span>
            ) : (
              "n/a"
            )}
          </div>

          <div>Depends: {depend}</div>
          <pre className="description">Description: {packages.Description}</pre>
        </div>
      );
    }
  }

  return (
    <div className="container">
      <div className="navbar">
        <input
          ref={props.inputRef}
          className="navbar__input"
          type="text"
          placeholder="input name of package"
          onChange={e => {
            props.setfilter(e.target.value);
          }}
        ></input>
      </div>
      <div className="leftside">
        <div className="packages__name">
          <div className="packages__name__container">
            <h2>The Package Name</h2>
            {props.namePackages.length >= 1 ? (
              props.namePackages.map(name => {
                return (
                  <div
                    ref={props.displayPackage === name ? props.itemRef : null}
                    key={name}
                    className={
                      props.displayPackage === name
                        ? "packages-Name-List active"
                        : "packages-Name-List"
                    }
                    onClick={() => props.setDisplayPackage(name)}
                  >
                    {name}
                  </div>
                );
              })
            ) : (
              <div>don't have package: {props.filter}</div>
            )}
          </div>
        </div>
      </div>

      <div className="rightside">
        {showDetail(
          props.detailPackage,
          props.displayPackage,
          props.detailPackageDepend
        )}
      </div>
    </div>
  );
}
