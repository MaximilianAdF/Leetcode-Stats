import { read } from "fs";
import graphqlRequest from "../fetch";

//Define the graphql query
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

let problemsSolvedData: any = null; 

//Make the request to GraphQL
graphqlRequest<any>({
    operationName: 'userProblemsSolved',
    query: problemsSolvedQuery,
    variables: {
        username: 'Makimi'
    }
})
    .then((data) => {
        const allQuestionsCount = data.data.allQuestionsCount;
        const problemsSolvedBeatsStats = data.data.matchedUser.problemsSolvedBeatsStats;
        const submitStatsGlobal = data.data.matchedUser.submitStatsGlobal.acSubmissionNum

        const problemsSolvedData = {
            allQuestionsCount,
            problemsSolvedBeatsStats,
            submitStatsGlobal
        };
    })
    .catch((error) => {
        console.log(error);
    });

export default problemsSolvedData;