const { default: graphqlRequest } = require("./fetch.js");

const problemsSolvedQuery = `
  query userProblemsSolved($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      problemsSolvedBeatsStats {
        difficulty
        percentage
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

module.exports = async function (username) {
    try {
        const request = {
            operationName: "userProblemsSolved",
            variables: { username },
            query: problemsSolvedQuery,
        };

        const data = await graphqlRequest(request);
        const allQuestionsCount = data.data.allQuestionsCount;
        const problemsSolvedBeatsStats = data.data.matchedUser.problemsSolvedBeatsStats;
        const submitStatsGlobal = data.data.matchedUser.submitStatsGlobal.acSubmissionNum

        return {
            allQuestionsCount,
            problemsSolvedBeatsStats,
            submitStatsGlobal,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}
