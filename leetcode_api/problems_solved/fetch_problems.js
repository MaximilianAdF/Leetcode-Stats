"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fetch_1 = require("../fetch");
//Define the graphql query
var problemsSolvedQuery = "\n    query userProblemsSolved($username: String!) {\n        allQuestionsCount {\n            difficulty\n            count\n        }\n        matchedUser(username: $username) {\n            problemsSolvedBeatsStats {\n                difficulty\n                percentage\n            }\n            submitStatsGlobal {\n                acSubmissionNum {\n                    difficulty\n                    count\n                }\n            }\n        }\n    }\n    ";
var problemsSolvedData = null;
//Make the request to GraphQL
(0, fetch_1.default)({
    operationName: 'userProblemsSolved',
    query: problemsSolvedQuery,
    variables: {
        username: 'Makimi'
    }
})
    .then(function (data) {
    var allQuestionsCount = data.data.allQuestionsCount;
    var problemsSolvedBeatsStats = data.data.matchedUser.problemsSolvedBeatsStats;
    var submitStatsGlobal = data.data.matchedUser.submitStatsGlobal.acSubmissionNum;
    problemsSolvedData = {
        allQuestionsCount: allQuestionsCount,
        problemsSolvedBeatsStats: problemsSolvedBeatsStats,
        submitStatsGlobal: submitStatsGlobal
    };
})
    .catch(function (error) {
    console.log(error);
});
exports.default = problemsSolvedData;
