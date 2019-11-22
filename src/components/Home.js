import React, { useState } from "react";
import styled from "styled-components";

import usePackageData from "../hooks/usePackageData";

const Root = styled.div`
  display: flex;
`;

const Items = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
`;

const Contents = styled.div`
  width: 60%;
`;

const Dependencies = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  color: #fff;
  text-decoration: underline;
  padding: 10px;
  cursor: pointer;
`;

export default function Home() {
  const { packageData, packageNames } = usePackageData();
  const [displayPackage, setDisplayPackage] = useState();

  const getPackageDepends = name => {
    if (name && packageData[name]) {
      const dependencies = (packageData[name].Depends || "")
        .split(/[,|\s]/)
        .filter(name => !!packageData[name]);

      const predependencies = (packageData[name]["Pre-Depends"] || "")
        .split(/[,|\s]/)
        .filter(name => !!packageData[name]);

      return [...dependencies, predependencies];
    }

    return [];
  };

  return (
    <Root>
      <Items>
        {packageNames.map(name => {
          return (
            <Item onClick={() => setDisplayPackage(name)} key={name}>
              {name}
            </Item>
          );
        })}
      </Items>
      <Contents>
        <h1>Dependencies and pre-dependencies</h1>
        <Dependencies>
          {getPackageDepends(displayPackage).map((dependName, index) => {
            return (
              <Item key={index} onClick={() => setDisplayPackage(dependName)}>
                {dependName}
              </Item>
            );
          })}
        </Dependencies>
      </Contents>
    </Root>
  );
}
