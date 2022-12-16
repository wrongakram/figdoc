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

const ComponentFigmaProps = ({ designSystem }) => {
  const [variantData, setVariantData] = useState([]);

  const { data: figmaToken } = useProfileStore();

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

      let getProperties = filterComponentVariant.map((component) => {
        let properties = _.split(component.name, ",");
        let removeEquals = properties.map((prop) => {
          return _.split(_.trim(prop), "=");
        });

        let turnToObject = _.fromPairs(removeEquals);

        let keys = _.keys(turnToObject);

        return keys;
      });

      let getValues = filterComponentVariant.map((component) => {
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
    return <p>Couldn't get component props from figma</p>;
  }
  if (!figmaData)
    return (
      <EmptyState
        css={{
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 12,
        }}
      >
        <Spinner color="black" />

        <span>
          Fetching {designSystem.component[0].title} props from figma...
        </span>

        <span
          style={{
            position: "absolute",
            display: "block",
            fontSize: 12,
            color: "#999",
            margin: "0 auto",
            marginTop: 60,
          }}
        >
          The Figma file is quite large, so this might take a few seconds.
        </span>
      </EmptyState>
    );

  return (
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
  );
};

export default ComponentFigmaProps;

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
