import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure your CSS file is correctly linked

const teams = [
    {
        name: "Manchester City",
        currentPoints: 64,
        fixtures: [
            { opponent: "Aston Villa", venue: "Home", result: "" },
            { opponent: "Crystal Palace", venue: "Away", result: "" },
            { opponent: "Luton Town", venue: "Home", result: "" },
            { opponent: "Tottenham Hotspur", venue: "Away", result: "" },
            { opponent: "Nottingham Forest", venue: "Away", result: "" },
            { opponent: "Wolverhampton Wanderers", venue: "Home", result: "" },
            { opponent: "Fulham", venue: "Away", result: "" },
            { opponent: "West Ham United", venue: "Home", result: "" },
        ],
    },
    {
        name: "Liverpool",
        currentPoints: 67,
        fixtures: [
            { opponent: "Sheffield United", venue: "Home", result: "" },
            { opponent: "Manchester United", venue: "Away", result: "" },
            { opponent: "Crystal Palace", venue: "Home", result: "" },
            { opponent: "Fulham", venue: "Away", result: "" },
            { opponent: "West Ham United", venue: "Away", result: "" },
            { opponent: "Tottenham Hotspur", venue: "Home", result: "" },
            { opponent: "Aston Villa", venue: "Away", result: "" },
            { opponent: "Wolverhampton Wanderers", venue: "Home", result: "" },
        ],
    },
    {
        name: "Arsenal",
        currentPoints: 65,
        fixtures: [
            { opponent: "Luton Town", venue: "Home", result: "" },
            { opponent: "Brighton and Hove Albion", venue: "Away", result: "" },
            { opponent: "Aston Villa", venue: "Home", result: "" },
            { opponent: "Wolverhampton Wanderers", venue: "Away", result: "" },
            { opponent: "Tottenham Hotspur", venue: "Away", result: "" },
            { opponent: "AFC Bournemouth", venue: "Home", result: "" },
            { opponent: "Manchester United", venue: "Away", result: "" },
            { opponent: "Everton", venue: "Home", result: "" },
        ],
    },
];

const FixturePrediction = () => {
    const [teamsData, setTeamsData] = useState(teams);
    const [winnerMessage, setWinnerMessage] = useState('');

    // This function updates the result for a fixture and recalculates the points
    const updatePointsAndResult = (teamName, fixtureIndex, newResult) => {
        const newTeamsData = teamsData.map(team => {
            if (team.name === teamName) {
                const newFixtures = [...team.fixtures];
                newFixtures[fixtureIndex] = { ...newFixtures[fixtureIndex], result: newResult };

                // Calculate points from results
                const additionalPoints = newFixtures.reduce((acc, fixture) => {
                    if (fixture.result === 'win') return acc + 3;
                    if (fixture.result === 'draw') return acc + 1;
                    return acc;
                }, 0);

                return { ...team, fixtures: newFixtures, currentPoints: team.originalPoints + additionalPoints };
            }
            return team;
        });

        setTeamsData(newTeamsData);
        checkAndUpdateWinner(newTeamsData);
    };

    // Dynamically check and update the winner after each prediction change
    const checkAndUpdateWinner = (teamsData) => {
        const allPredicted = teamsData.every(team => team.fixtures.every(fixture => fixture.result));
        if (allPredicted) {
            const winner = teamsData.reduce((acc, team) => team.currentPoints > acc.currentPoints ? team : acc, teamsData[0]);
            setWinnerMessage(`You have picked ${winner.name} to win the Premier League title!`);
        }
    };

    useEffect(() => {
        // Initialize originalPoints for accurate recalculations
        setTeamsData(teamsData.map(team => ({
            ...team,
            originalPoints: team.currentPoints
        })));
    }, []);

// Define buttonStyle function here
    const buttonStyle = (predictedResult, currentResult) => ({
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '20px',
        cursor: 'pointer',
        margin: '5px',
        backgroundColor: predictedResult === currentResult ? {
            'win': 'green',
            'draw': 'yellow',
            'lose': 'red'
        }[predictedResult] : '#f0f0f0', // Default background color if no result is matched
        color: predictedResult === currentResult ? 'white' : 'black',
    });

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            {teamsData.map((team, index) => (
                <div key={index} style={{ margin: 20 }}>
                    <h2>{team.name} (Points: {team.currentPoints + team.additionalPoints})</h2>
                    {team.fixtures.map((fixture, fIndex) => (
                        <div key={fIndex} style={{ marginBottom: 10 }}>
                            <p>{fixture.opponent} ({fixture.venue})</p>
                            {['win', 'draw', 'lose'].map(result => (
                                <button
                                    key={result}
                                    style={buttonStyle(fixture.result, result)}
                                    onClick={() => updatePointsAndResult(team.name, fIndex, result)}
                                >
                                    {result.charAt(0).toUpperCase() + result.slice(1)}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
            {winnerMessage && <div style={{ marginTop: '20px', fontSize: '24px', color: 'green' }}>{winnerMessage}</div>}
        </div>
    );
};

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Flameo Predictor</h1>
            </header>
            <FixturePrediction />
        </div>
    );
}

export default App;

