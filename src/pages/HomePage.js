import React from "react";

export default function HomePage(props) {
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

function showDetail(packages, name, depend) {
  if (packages && name) {
    return (
      <div className="packages__information">
        <h1>{name}</h1>
        <div>Status: {packages.Status}</div>
        <div>Priority: {packages.Priority ? packages.Priority : "n/a"}</div>
        <div>
          Architecture: {packages.Architecture ? packages.Architecture : "n/a"}
        </div>
        <div>Source: {packages.Source ? packages.Source : "n/a"}</div>

        <div>Depends: {depend}</div>
        <pre className="description">Description: {packages.Description}</pre>
      </div>
    );
  }
}
