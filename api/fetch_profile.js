const { default: graphqlRequest } = require("./fetch.js");

const userProfileQuery = `
  query userProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        userAvatar
        aboutMe
        countryName
        ranking
        reputation
      }
    }
  }
`;

module.exports = async function (username) {
    try {
        const request = {
            operationName: "userProfile",
            variables: { username },
            query: userProfileQuery,
        };

        const data = await graphqlRequest(request);
        const profile = data.data.matchedUser.profile;

        //console.log('User Profile:', profile);
        return profile;
    } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
};
