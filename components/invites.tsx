import { styled } from "@stitches/react";
import { Mail, MailIn } from "iconoir-react";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { Button } from "./FDButton";
import CreateNewDesignSystemDialog from "./Modals/CreateDesignSystem";
import ViewInvitesDialog from "./Modals/ViewInvites";

const Invites = () => {
  const router = useRouter();
  const path = router.asPath;
  const { system } = router.query;

  const { data, error } = useSWR(`http://localhost:3000/api/checkInvites`);

  if (error) {
    return <p>404</p>;
  }

  if (!data) return null;

  return (
    <>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      {data.length === 0 ? null : (
        <ViewInvitesDialog data={data}>
          <Button css={{ position: "relative" }} apperance={"secondary"}>
            <Mail />
            <Badge />
          </Button>
        </ViewInvitesDialog>
      )}
    </>
  );
};

export default Invites;

const Badge = styled("div", {
  background: "$red9",
  height: 8,
  width: 8,
  borderRadius: "100%",
  position: "absolute",
  top: 6,
  right: 6,
});
