import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  Component,
} from "react";
import { styled } from "../stitches.config";

// Next
import useSWRImmutable from "swr/immutable";

// Utils
import _ from "lodash";

// Components
import * as Tabs from "@radix-ui/react-tabs";
import { EmptyState } from "./primitives/EmptyState";
import Spinner from "./Spinner";
import { useProfileStore } from "../context/ProfileContext";
import { Flex } from "./primitives/structure";
import { H4 } from "./primitives/Text";

const ComponentFigmaProps = ({ designSystem }: any) => {
  const [variantData, setVariantData] = useState<any[]>([]);

  const { data: figmaToken }: any = useProfileStore();

  const { data: figmaData, error } = useSWRImmutable([
    "https://api.figma.com/v1/files/" + designSystem.figma_file_key,
    {
      method: "GET",
      headers: {
        "X-Figma-Token": figmaToken?.figma_token,
      },
    },
  ]);

  useEffect(() => {
    if (figmaData) {
      let filterComponentVariant = _.flatten(
        _.toPairs(figmaData.components).map((variant) => {
          return _.filter(variant, {
            componentSetId: designSystem.component[0].nodeId,
          });
        })
      );

      let getProperties = filterComponentVariant.map((component: any) => {
        let properties = _.split(component.name, ",");
        let removeEquals = properties.map((prop) => {
          return _.split(_.trim(prop), "=");
        });

        let turnToObject = _.fromPairs(removeEquals);

        let keys = _.keys(turnToObject);

        return keys;
      });

      let getValues = filterComponentVariant.map((component: any) => {
        let properties = _.split(component.name, ",");
        let removeEquals = properties.map((prop) => {
          return _.split(_.trim(prop), "=");
        });

        let turnToObject = _.fromPairs(removeEquals);

        let values = _.values(turnToObject);

        return values;
      });

      let props = _.uniq(_.flatten(getProperties));
      let values = getValues;

      // Create a new object where props is the index and values gets added to its respective index
      let propsAndValues = props.map((prop, index) => {
        return {
          [prop]: _.uniq(
            values.map((value) => {
              return value[index];
            })
          ),
        };
      });

      setVariantData(propsAndValues);
    }
  }, [figmaData, designSystem]);

  if (error) {
    return <p>Couldn&apos;t get component props from figma</p>;
  }

  if (!figmaData)
    return (
      <Flex alignItemsCenter style={{ justifyContent: "center" }}>
        <Spinner color="black" />
      </Flex>
    );

  return (
    <>
      {variantData.length === 0 ? null : (
        <>
          <H4 css={{ marginBottom: 12, fontWeight: 500, fontSize: 18 }}>
            Component Props
          </H4>
          <PropTable>
            <PropTableHeader>
              <PropTableHeaderCell>Property</PropTableHeaderCell>
              <PropTableHeaderCell>Value</PropTableHeaderCell>
              <PropTableHeaderCell>Type</PropTableHeaderCell>
            </PropTableHeader>
            <PropTableBody>
              {variantData?.map((variant) => {
                return (
                  // eslint-disable-next-line react/jsx-key
                  <PropTableRow>
                    <PropTableCell>{_.keys(variant)}</PropTableCell>
                    <PropTableCell>
                      {_.values(variant).map((value) => {
                        let a = _.split(value, ",");
                        return a.map((v, id) => <span key={id}>{v}</span>);
                      })}
                    </PropTableCell>
                    <PropTableCell>
                      {_.values(variant).map((value) => {
                        let a = _.split(value, ",");
                        return a.map((v, id) => (
                          <>
                            {v === "True" || v === "False" ? (
                              <span className="type" key={id}>
                                Boolean
                              </span>
                            ) : (
                              <span className="type" key={id}>
                                String
                              </span>
                            )}
                          </>
                        ));
                      })}
                    </PropTableCell>
                  </PropTableRow>
                );
              })}
            </PropTableBody>
          </PropTable>
          <Divider />
        </>
      )}
    </>
  );
};

export default ComponentFigmaProps;

const Divider = styled("div", {
  height: 1,
  backgroundColor: "$gray3",
  margin: "32px 0",
});

const PropTable = styled("div", {
  fontFamily: "SF Mono, Menlo, monospace",
  border: "1px solid $gray5",
  borderRadius: 6,
});

const PropTableHeader = styled("div", {
  height: 40,
  padding: "0px 16px",
  background: "$gray2",
  display: "flex",
  alignItems: "center",
  fontSize: 13,
  color: "$gray11",
  borderRadius: "6px 6px 0 0",
});

const PropTableHeaderCell = styled("div", {
  flex: 1,
});

const PropTableBody = styled("div", {});

const PropTableRow = styled("div", {
  display: "flex",
  padding: "16px 16px",
  borderBottom: "1px solid $gray5",
});

const PropTableCell = styled("div", {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  fontSize: 13,
  color: "$gray12",
  div: {
    display: "flex",
    flexDirection: "column",
    width: 90,
  },

  ".type": {
    display: "none",
    color: "$pink11",
  },

  ".type:first-child": {
    display: "block",
  },
});
