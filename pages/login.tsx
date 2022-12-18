import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { styled } from "../stitches.config";
import { useEffect } from "react";

const Login = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  return (
    <LoginPage>
      <LoginContainer>
        <Title>.fd</Title>
        <Subtitle>Document your figma component with ease.</Subtitle>
        <Auth
          appearance={{ theme: ThemeSupa }}
          supabaseClient={supabaseClient}
          providers={["google"]}
          magicLink
          redirectTo="/home"
          onlyThirdPartyProviders
        />
      </LoginContainer>
    </LoginPage>
  );
};

const LoginPage = styled("div", {
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "$gray2",
});

const LoginContainer = styled("div", {
  backgroundColor: "$gray1",
  border: "1px solid $gray6",
  borderRadius: 12,
  padding: 32,
  width: 360,
  button: {
    boxSizing: "border-box",
  },
});

const Title = styled("h3", {
  fontSize: 20,
  fontWeight: "500",
});

const Subtitle = styled("p", {
  fontSize: 16,
  color: "$gray11",
  lineHeight: 1.25,
  marginTop: 8,
});

export default Login;
