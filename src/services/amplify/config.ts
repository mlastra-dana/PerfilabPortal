import { Amplify } from "aws-amplify";

export function configureAmplify() {
  const region = import.meta.env.VITE_AWS_REGION;
  const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
  const userPoolClientId = import.meta.env.VITE_COGNITO_APP_CLIENT_ID;

  if (!region || !userPoolId || !userPoolClientId) {
    return;
  }

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
      },
    },
  });
}

export function isAmplifyConfigured() {
  return Boolean(
    import.meta.env.VITE_AWS_REGION &&
      import.meta.env.VITE_COGNITO_USER_POOL_ID &&
      import.meta.env.VITE_COGNITO_APP_CLIENT_ID,
  );
}
