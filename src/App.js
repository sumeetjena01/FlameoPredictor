import React, { useState, useEffect } from 'react';
import './App.css';



const teams = [
    {
        name: "Liverpool",
        currentPoints: 61,
        goalDifference: 36,
        fixtures: [
            { opponent: "February 23rd: Manchester City", venue: "Away", result: "" },
            { opponent: "February 26th: Newcastle", venue: "Home", result: "" },
            { opponent: "March 8th: Southampton", venue: "Home", result: "" },
            { opponent: "April 2nd: Everton", venue: "Home", result: "" },
            { opponent: "April 5th: Fulham", venue: "Away", result: "" },
            { opponent: "April 12th: West Ham United", venue: "Home", result: "" },
            { opponent: "April 19th: Leicester City", venue: "Away", result: "" },
            { opponent: "April 26th: Tottenham Hotspur", venue: "Home", result: "" },
            { opponent: "May 3rd: Chelsea", venue: "Away", result: "" },
            { opponent: "May 10th: Arsenal", venue: "Home", result: "" },
            { opponent: "May 18th: Brighton and Hove Albion", venue: "Away", result: "" },
            { opponent: "May 25th: Crystal Palace", venue: "Home", result: "" },
        ],
    },
    {
        name: "Arsenal",
        currentPoints: 53,
        goalDifference: 29,
        fixtures: [
            { opponent: "February 22nd: West Ham United", venue: "Home", result: "" },
            { opponent: "February 26th: Nottingham Forest", venue: "Away", result: "" },
            { opponent: "March 9th: Manchester United", venue: "Away", result: "" },
            { opponent: "March 16th: Chelsea", venue: "Home", result: "" },
            { opponent: "April 1st: Fulham", venue: "Home", result: "" },
            { opponent: "April 5th: Everton", venue: "Away", result: "" },
            { opponent: "April 12th: Brentford", venue: "Home", result: "" },
            { opponent: "April 19th: Ipswich Town", venue: "Away", result: "" },
            { opponent: "April 26th: Crystal Palce", venue: "Home", result: "" },
            { opponent: "May 3rd: Bournemouth", venue: "Home", result: "" },
            { opponent: "May 10th: Liverpool", venue: "Away", result: "" },
            { opponent: "May 18th: Newcastle", venue: "Home", result: "" },
            { opponent: "May 18th: Southampton", venue: "Away", result: "" },
        ],
    },
];

// Simple Modal Component
function Modal({ children, onClose }) {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
            <div style={{
                padding: '20px',
                background: 'white',
                borderRadius: '5px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                minWidth: '300px',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
                {children}
                <button onClick={onClose} style={{
                    marginTop: '20px',
                    alignSelf: 'flex-end',
                    padding: '5px 10px',
                    background: 'lightgrey',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}>Close</button>
            </div>
        </div>
    );
}

const FixturePrediction = () => {

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


    const [teamsData, setTeamsData] = useState(teams.map(team => ({
        ...team,
        originalPoints: team.currentPoints, // Preserve the original points
        fixtures: team.fixtures.map(fixture => ({
            ...fixture,
            result: "" // Initialize all fixture results to an empty string
        })),
    })));

    const [winnerMessage, setWinnerMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    useEffect(() => {
        const allPredicted = teamsData.every(team => team.fixtures.every(fixture => fixture.result));
        if (allPredicted) {
            // Initially sort teams by points then by goal difference
            let sortedTeams = [...teamsData].sort((a, b) => 
                (b.currentPoints - a.currentPoints) || (b.goalDifference - a.goalDifference)
            );
    
            let winner = sortedTeams[0]; // Assume the top team is the winner
    
            // Check for points tie and apply tiebreaker rules
            if (sortedTeams[0].currentPoints === sortedTeams[1].currentPoints) {
                // Arsenal tiebreaker
                if (sortedTeams[0].name === "Arsenal" || sortedTeams[1].name === "Arsenal") {
                    winner = sortedTeams.find(team => team.name === "Arsenal");
                }
                // Liverpool and City tiebreaker
                else if (
                    (sortedTeams[0].name === "Liverpool" && sortedTeams[1].name === "Manchester City") ||
                    (sortedTeams[0].name === "Manchester City" && sortedTeams[1].name === "Liverpool")
                ) {
                    winner = sortedTeams.find(team => team.name === "Liverpool");
                }
            }
    
            setWinnerMessage(`You have picked ${winner.name} to win the 2024/2025 Premier League title!`);
            setIsModalOpen(true); // Open the modal with the winner message
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
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div>
            <button
                onClick={resetPredictions}
                style={{
                    position: 'absolute',
                    top: '9%',
                    left: '12%',
                    transform: 'translate(-50%, -50%)',
                    padding: '15px 30px',
                    fontSize: '18px',
                    cursor: 'pointer',
                    borderRadius: '15px',
                    zIndex: 1000,
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    fontWeight: "bold"
                }}>
                Reset Predictions
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                {teamsData.map((team, index) => (
                    <div key={index} style={{ margin: 20, textAlign: 'center' }}>
                        {team.name === "Manchester City" && (
                            <img src="/city.png" alt="Manchester City Logo" style={{ maxWidth: '250px', marginBottom: '10px', marginTop: '17px'}} />
                        )}
                        {team.name === "Liverpool" && (
                            <img src="/liverpool.png" alt="Liverpool Logo" style={{ maxWidth: '280px', marginBottom: '5px', marginTop: '1px' }} />
                        )}
                        {team.name === "Arsenal" && (
                            <img src="/arsenal.png" alt="Arsenal Logo" style={{ maxWidth: '207px', marginBottom: '30px', marginTop: '33px' }} />
                        )}
                        <h2>
        <span style={
            team.name === "Liverpool" ? { color: '#da1515' } :
                team.name === "Arsenal" ? { color: '#F50707' } :
                    team.name === "Manchester City" ? { color: '#86c5da' } : null
        }>
          {team.name}
        </span> &nbsp;- {team.currentPoints} Points
                        </h2>
                        {team.fixtures.map((fixture, fIndex) => (
                            <div key={fIndex} style={{ marginBottom: 10 }}>
                                <p className="bold-text">{fixture.opponent} ({fixture.venue})</p>
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
            </div>
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)}>
                    <div style={{ fontSize: '30px', color: 'black', fontWeight: 'bold' }}>{winnerMessage}</div>
                </Modal>
            )}

        </div>
    );
}

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src="/predictorlogo.png" alt="Predictor Logo" style={{ width: '200px', height: 'auto', verticalAlign: 'middle', marginTop: '20px' }} />
                <h1 style={{ display: 'inline', marginLeft: '10px', marginBottom: '25px', verticalAlign: 'middle'}}>FLAMEO PREDICTOR</h1>
            </header>
            <FixturePrediction />

        </div>
    );
}

export default App;


