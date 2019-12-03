import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";

import usePackageData from "../hooks/usePackageData";

const Root = styled.div`
  display: flex;
`;

const Input = styled.input`
  height: 20px;
  padding: 8px;
  margin: 10px;
`;

const Items = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: scroll;
`;

const Contents = styled.div`
  padding-left: 40px;
  width: 100%;
  height: 100vh;
  overflow: scroll;
`;

const Item = styled.div`
  color: #fff;
  padding-top: 8px;
`;

const Link = styled(Item)`
  padding: 8px;
  text-decoration: underline;
  cursor: pointer;

  ${({ active }) =>
    active &&
    css`
      background-color: #fff;
      color: black;
    `}
`;

const SmallLink = styled(Item)`
  text-decoration: underline;
  cursor: pointer;
  padding: 2px;
`;

const RichText = styled.div`
  padding-left: 16px;
  white-space: pre-line;
`;

const Text = styled.div`
  margin-top: 2px;
  padding-left: 16px;
  white-space: pre-line;
`;

const Field = styled.div`
  font-weight: 700;
`;

export default function Home() {
  const [search, setSearch] = useState("");
  const { packageData, packageNames } = usePackageData();
  const [displayPackage, setDisplayPackage] = useState();
  const itemRef = useRef();

  const getPackageName = nameWithVersion => {
    return nameWithVersion.split(" ")[0];
  };

  const getPackagePreDepends = () => {
    if (displayPackage && packageData[displayPackage]) {
      const preDependenciesContent =
        packageData[displayPackage].find(
          ([field]) => field === "Pre-Depends"
        ) || [];

      return (preDependenciesContent[1] || "")
        .split(/[,||]/)
        .map(depend => depend.trim());
    }

    return [];
  };

  const getPackageDepends = () => {
    if (displayPackage && packageData[displayPackage]) {
      const dependenciesContent =
        packageData[displayPackage].find(([field]) => field === "Depends") ||
        [];

      return (dependenciesContent[1] || "")
        .split(/[,||]/)
        .map(depend => depend.trim());
    }

    return [];
  };

  return (
    <Root>
      <Items>
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
        />

        {packageNames
          .filter(name => name.includes(search))
          .map(name => (
            <Link
              ref={itemRef}
              active={name === displayPackage}
              onClick={() => setDisplayPackage(name)}
              key={name}
            >
              {name}
            </Link>
          ))}
      </Items>

      <Contents>
        {displayPackage && (
          <>
            <Item>
              <Field>Package :</Field>
              <RichText>{displayPackage}</RichText>
            </Item>

            {packageData[displayPackage].map(([field, content], index) => {
              if (!field) {
                return <Text key={index}>{content} </Text>;
              }

              if (field === "Pre-Depends")
                return (
                  <Item key={index}>
                    <Field>{field} :</Field>
                    <RichText>
                      {getPackagePreDepends().map((depend, index) => (
                        <SmallLink
                          onClick={() => {
                            setDisplayPackage(getPackageName(depend));
                          }}
                          key={index}
                        >
                          {depend}
                        </SmallLink>
                      ))}
                    </RichText>
                  </Item>
                );

              if (field === "Depends")
                return (
                  <Item key={index}>
                    <Field>{field} :</Field>
                    <RichText>
                      {getPackageDepends().map((depend, index) => (
                        <SmallLink
                          onClick={() => {
                            setDisplayPackage(getPackageName(depend));
                          }}
                          key={index}
                        >
                          {depend}
                        </SmallLink>
                      ))}
                    </RichText>
                  </Item>
                );

              return (
                <Item key={index}>
                  <Field>{field} :</Field>
                  <RichText>{content}</RichText>
                </Item>
              );
            })}
          </>
        )}
      </Contents>
    </Root>
  );
}
