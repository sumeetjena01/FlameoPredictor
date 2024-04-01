import React, { useState, useEffect } from 'react';
import './App.css';

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
    // Enhanced initialization of teamsData to include originalPoints
    const [teamsData, setTeamsData] = useState(teams.map(team => ({
        ...team,
        originalPoints: team.currentPoints, // Preserve the original points
        fixtures: team.fixtures.map(fixture => ({
            ...fixture,
            result: "" // Initialize all fixture results to an empty string
        })),
    })));

    const [winnerMessage, setWinnerMessage] = useState('');

    useEffect(() => {
        // This useEffect is used for determining the winner once all predictions are made
        const allPredicted = teamsData.every(team => team.fixtures.every(fixture => fixture.result));
        if (allPredicted) {
            const winner = teamsData.reduce((acc, team) => {
                const teamPoints = team.currentPoints + team.fixtures.reduce((acc, fixture) => {
                    if (fixture.result === 'win') return acc + 3;
                    if (fixture.result === 'draw') return acc + 1;
                    if (fixture.result === 'lose') return acc;
                    return acc;
                }, 0);
                return teamPoints > acc.totalPoints ? { name: team.name, totalPoints: teamPoints } : acc;
            }, { name: '', totalPoints: 0 });
            setWinnerMessage(`You have picked ${winner.name} to win the 2023/2024 Premier League title!`);
        }
    }, [teamsData]);

    const updatePointsAndResult = (teamName, fixtureIndex, newResult) => {
        setTeamsData(teamsData.map(team => {
            if (team.name === teamName) {
                const newFixtures = [...team.fixtures];
                newFixtures[fixtureIndex] = { ...newFixtures[fixtureIndex], result: newResult };

                // Recalculate only the points gained from predictions
                const pointsFromPredictions = newFixtures.reduce((acc, fixture) => {
                    if (fixture.result === 'win') return acc + 3;
                    if (fixture.result === 'draw') return acc + 1;
                    return acc;
                }, 0);

                // Do not add to originalPoints directly; keep currentPoints updated separately if needed
                return { ...team, fixtures: newFixtures, currentPoints: pointsFromPredictions + team.originalPoints };
            }
            return team;
        }));
    };

    const resetPredictions = () => {
        const resetTeamsData = teamsData.map(team => {
            // Reset each team's fixtures and points
            const resetFixtures = team.fixtures.map(fixture => ({
                ...fixture,
                result: "" // Clear the prediction result
            }));

            let resetPoints = team.currentPoints;
            // Hard-code reset of points tally
            if (team.name === "Manchester City") resetPoints = 64;
            else if (team.name === "Liverpool") resetPoints = 67;
            else if (team.name === "Arsenal") resetPoints = 65;

            return {
                ...team,
                fixtures: resetFixtures,
                currentPoints: resetPoints // Set to the original tally
            };
        });
        setTeamsData(resetTeamsData);
        setWinnerMessage(''); // Optionally clear the winner message
    };



    // Function to dynamically set button styles based on the prediction result
    const getButtonStyle = (isPredicted, result) => ({
        padding: '10px 20px',
        margin: '5px',
        borderRadius: '20px', // Makes buttons rounded
        cursor: 'pointer',
        backgroundColor: isPredicted ? {
            win: 'green',
            draw: 'yellow',
            lose: 'red',
        }[result] : 'lightgrey', // Default color if no prediction has been made
        color: 'black',
        border: 'none',
    });

    return (
        <div>
            <button
                onClick={resetPredictions}
                style={{ position: 'fixed', top: 50, left: 50, padding: '15px 30px', fontSize: '18px', cursor: 'pointer', borderRadius: '15px', zIndex: 1000,  backgroundColor: '#007bff', // Optional: Change background color
                    color: 'white', // Optional: Change text color
                    border: 'none', }}>
                Reset Predictions
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginTop: '20px' }}>
                {teamsData.map((team, index) => (
                    <div key={index} style={{ margin: 20 }}>
                        <h2>{team.name} (Points: {team.currentPoints})</h2>
                        {team.fixtures.map((fixture, fIndex) => (
                            <div key={fIndex} style={{ marginBottom: 10 }}>
                                <p>{fixture.opponent} ({fixture.venue})</p>
                                {['win', 'draw', 'lose'].map(result => (
                                    <button
                                        key={result}
                                        style={getButtonStyle(fixture.result === result, result)}
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
        </div>
    );

}

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
