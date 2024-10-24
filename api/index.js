const fetchUserProfile = require('./fetch_profile');
const fetchProblemsData = require('./fetch_problems');
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  
// Serve static files from the misc directory
app.use('/misc', express.static(path.join(__dirname, 'misc')));

app.get('/', async (req, res) => {
  const username = req.query.username || 'Makimi';
  const showRank = req.query.ranking === 'true';
  var solvedPercentage = 0;
  var solvedCount = 0;

  var solvedEasy = 0;
  var solvedMedium = 0;
  var solvedHard = 0;

  var totalEasy = 0;
  var totalMedium = 0;
  var totalHard = 0;

  var beatsEasy = 0;
  var beatsMedium = 0;
  var beatsHard = 0;

  var userProfile = null;

  try {
    const data = await fetchProblemsData(username);
    const number = 100 * data.submitStatsGlobal[0].count / data.allQuestionsCount[0].count;
    solvedPercentage = parseFloat(number.toFixed(1));
    solvedCount = data.submitStatsGlobal[0].count;

    totalEasy = data.allQuestionsCount[1].count;
    totalMedium = data.allQuestionsCount[2].count;
    totalHard = data.allQuestionsCount[3].count;

    solvedEasy = data.submitStatsGlobal[1].count;
    solvedMedium = data.submitStatsGlobal[2].count;
    solvedHard = data.submitStatsGlobal[3].count;

    beatsEasy = data.problemsSolvedBeatsStats[0].percentage.toFixed(1);
    beatsMedium = data.problemsSolvedBeatsStats[1].percentage.toFixed(1);
    beatsHard = data.problemsSolvedBeatsStats[2].percentage.toFixed(1);

  } catch (error) {
    console.error(error);
  }

  if(showRank) {
    userProfile = await fetchUserProfile(username);
    if (!userProfile) {
        console.error('Error fetching profile');
    }
  }

  // Logic to generate SVG content dynamically based on username
  const svgString = `
    <svg width="410" height="186" viewBox="0 0 410 186" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" role="img">
    <title id="titleId">${username}'s Solved Problems Stats</title>
    <desc id="descId"/>
    
    <style>
        .header {
            font: 600 100% 'Segoe UI', Ubuntu, Sans-Serif;
            fill: #ffff;
            animation: fadeInAnimation 0.8s ease-in-out forwards; 
        }

        .large-text {
            font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: #ffff;
            animation: fadeInAnimation 0.8s ease-in-out forwards;
        }

        .bars text.small-text {
            font-size: 12px;
        }

        .stat {
            font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
            fill: gray;
            animation: fadeInAnimation 0.8s ease-in-out forwards;
        }

        .stat-dark {
            font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif;
            fill: #39424b;
            animation: fadeInAnimation 0.8s ease-in-out forwards;
        }

        .stagger {
            opacity: 0;
            animation: fadeInAnimation 0.3s ease-in-out forwards;
        }

        .total-solved {
            font: 600 24px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: #ffff;
            animation: scaleInAnimation 0.5s ease-in-out forwards;
        }

        .text1 {
            animation: animateText1 10s ease-in-out forwards infinite;
        }

        .text2 {
            animation: animateText2 10s ease-in-out forwards infinite;
        }

        .rank-percentile-header {
            font-size: 14px;
        }

        .rank-percentile-text {
            font-size: 16px;
        }

        .not_bold {
            font-weight: 400;
        }

        .bold {
            font-weight: 700;
        }

        .solved-circle-rim {
          z-index: 1;
          fill: transparent;
          stroke: #ffff;
          stroke-width: 3;
          stroke-linecap: round;
          opacity: 0.2;
        }

        .solved-circle {
          stroke: #FB8C00;
          stroke-dasharray: ${Math.PI * 2 * 60};
          stroke-dashoffset: ${Math.PI * 2 * 60};
          fill: none;
          stroke-width: 5;
          stroke-linecap: round;
          opacity: 0.8;
          transform-origin: 90px 55px;
          transform: rotate(-90deg);
          animation: solvedCircleAnimation 1s ease-in-out forwards;
        }

        .easy-bar {
            fill: #294D35;
        }

        .easy-fill {
            fill: #00B8A3;
        }

        .med-bar {
            fill: #5E4E25;
        }

        .med-fill {
            fill: #FFC01E;
        }
        
        .hard-bar {
            fill: #5A302F;
        }

        .hard-fill {
            fill: #EF4743;
        }
        
        @keyframes animateText1 {
            0% { opacity: 1; } /* Start fully opaque */
            49% { opacity: 1; } /* Maintain opacity for half duration */
            50% { opacity: 0; } /* Switch to transparent at midpoint */
            99% { opacity: 0; } /* Stay transparent for remaining duration */
            100% { opacity: 1; } /* Back to fully opaque at the end */
          }
          
          @keyframes animateText2 {
            0% { opacity: 0; } /* Start transparent */
            49% { opacity: 0; } /* Stay transparent for half duration */
            50% { opacity: 1; } /* Switch to opaque at midpoint */
            99% { opacity: 1; } /* Maintain opacity for remaining duration */
            100% { opacity: 0; } /* Back to transparent at the end */
          }

        @keyframes solvedCircleAnimation {
            from {
                stroke-dashoffset: ${Math.PI * 2 * 60};
            }
            to {
                stroke-dashoffset: ${(Math.PI * 2 * 60) * (1 - solvedPercentage / 100)};
            }
        }
        

        @keyframes scaleInAnimation {
            from {
                transform: translate(90px, 55px) scale(0);
            }
            to {
                transform: translate(0px, 0px) scale(1);
            }
        }

        @keyframes fadeInAnimation {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    </style>

    <rect data-testid="card-bg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="#E4E2E2" width="409" fill="#151515" stroke-opacity="1"/>
    <g data-testid="card-title" transform="translate(25, 35)">
        <g transform="translate(0, 0)">
            <text class="header" x="0" y="0" data-testid="header">${username}'s LeetCode Stats</text>
            ${showRank ? `<text class="stat-dark" x="365" text-anchor="end"><tspan fill="#FB9719">#</tspan> ${formatNumber(userProfile.ranking) || 'N/A'}</text>` : ''} <!-- Add ranking if parameter is true -->
        </g>
    </g>

    <g data-testid="main-card-body" transform="translate(0,55)">
          <a href="https://leetcode.com/${username}" target="_blank" transform="translate(0, 0)">
            <image href="./misc/leetcode_logo.webp" x="1" y="95" width="30" height="30" />
          </a>

          <circle class="solved-circle" cx="90" cy="55" r="60"/>
          <circle class="solved-circle-rim" cx="90" cy="55" r="60"/>
          <text x="90" y="55" id="total-solved" class="total-solved text1 not_bold" text-anchor="middle" alignment-baseline="middle">${solvedCount}</text>
          <text x="90" y="55" class="total-solved text2 not_bold" text-anchor="middle" alignment-baseline="middle" opacity="0">${solvedPercentage}%</text> 
          <text x="90" y="80" class="stat not_bold" text-anchor="middle" alignment-baseline="middle">Solved</text>

          <g class="bars" transform="translate(0, 0)">

                <text x="170" y="5" class="stat small-text not_bold" text-anchor="start" alignment-baseline="top">Easy</text>
                <text x="225" y="5" class="large-text not_bold" text-anchor="start" alignment-baseline="top">${solvedEasy}</text>
                <text x="260" y="5" class="stat-dark not_bold" text-anchor="start" alignment-baseline="top">/${totalEasy}</text>
                <text x="320" y="5" class="stat small-text not_bold" text-anchor="start" alignment-baseline="top">Beats ${beatsEasy}%</text>
                <rect class="easy-bar" x="170" y="10" width="220" height="8" rx="4" ry="4"/>
                <rect class="easy-fill" x="170" y="10" width="${220 * (solvedEasy/totalEasy)}" height="8" rx="4" ry="4"/>

                <text x="170" y="50" class="stat small-text not_bold" text-anchor="start" alignment-baseline="top">Medium</text>
                <text x="225" y="50" class="large-text not_bold" text-anchor="start" alignment-baseline="top">${solvedMedium}</text>
                <text x="260" y="50" class="stat-dark not_bold" text-anchor="start" alignment-baseline="top">/${totalMedium}</text>
                <text x="320" y="50" class="stat small-text not_bold" text-anchor="start" alignment-baseline="top">Beats ${beatsMedium}%</text>
                <rect class="med-bar" x="170" y="55" width="220" height="8" rx="4" ry="4"/>
                <rect class="med-fill" x="170" y="55" width="${220 * (solvedMedium/totalMedium)}" height="8" rx="4" ry="4"/>

                <text x="170" y="95" class="stat small-text not_bold" text-anchor="start" alignment-baseline="top">Hard</text>
                <text x="225" y="95" class="large-text not_bold" text-anchor="start" alignment-baseline="top">${solvedHard}</text>
                <text x="260" y="95" class="stat-dark not_bold" text-anchor="start" alignment-baseline="top">/${totalHard}</text>
                <text x="320" y="95" class="stat small-text not_bold" text-anchor="start" alignment-baseline="top">Beats ${beatsHard}%</text>
                <rect class="hard-bar" x="170" y="100" width="220" height="8" rx="4" ry="4"/>
                <rect class="hard-fill" x="170" y="100" width="${Math.max(220 * (solvedHard/totalHard),4)}" height="8" rx="4" ry="4"/>
          </g> 
    </g>
    </svg>
  `;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svgString);
});
app.listen(port, () => console.log(`Server listening on port ${port}`));
