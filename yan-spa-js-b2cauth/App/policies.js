/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 
{
  "AzureAdB2C": {
    "Instance": "https://happyDogTreats.b2clogin.com/",
    "ClientId": "2a5f1350-caef-4aed-b7df-0f4e1d8ba42b",
    "Domain": "happyDogTreats.onmicrosoft.com",
    "Scopes": "access_as_user",
    "SignUpSignInPolicyId": "B2C_1_SUSHI",
    "SignedOutCallbackPath": "/signout/B2C_1_SUSHI"
  }, 
*/
const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1_SUSHI",
        editProfile: "B2C_1_edit_profile_v2"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://happyDogTreats.b2clogin.com/happyDogTreats.onmicrosoft.com/B2C_1_SUSHI",
        },
        editProfile: {
            authority: "https://happyDogTreats.b2clogin.com/happyDogTreats.onmicrosoft.com/B2C_1_edit_profile_v2"
        }
    },
    authorityDomain: "happyDogTreats.b2clogin.com"
}