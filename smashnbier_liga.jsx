import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LigaApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [teams, setTeams] = useState([
    { name: "Team A", points: 6, games: 3, logo: "" },
    { name: "Team B", points: 4, games: 3, logo: "" },
  ]);
  const [newTeam, setNewTeam] = useState("");
  const [newLogo, setNewLogo] = useState("");
  const [password, setPassword] = useState("");

  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [games, setGames] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [comments, setComments] = useState({});
  const [darkMode, setDarkMode] = useState(false);

  const login = () => {
    if (password === "smashbier2025") {
      setLoggedIn(true);
    } else {
      alert("Falsches Passwort!");
    }
  };

  const addTeam = () => {
    if (newTeam.trim() !== "") {
      setTeams([...teams, { name: newTeam, points: 0, games: 0, logo: newLogo, wins: 0, losses: 0 }]);
      setNewTeam("");
      setNewLogo("");
    }
  };

  const updatePoints = (game, action = "add") => {
    return teams.map((t) => {
      if (t.name === game.team1) {
        const result = {
          ...t,
          games: t.games + (action === "add" ? 1 : -1),
          points:
            t.points +
            (action === "add"
              ? game.score1 > game.score2
                ? 3
                : game.score1 === game.score2
                ? 1
                : 0
              : -(game.score1 > game.score2
                  ? 3
                  : game.score1 === game.score2
                  ? 1
                  : 0)),
          wins: t.wins + (action === "add" && game.score1 > game.score2 ? 1 : action === "remove" && game.score1 > game.score2 ? -1 : 0),
          losses: t.losses + (action === "add" && game.score1 < game.score2 ? 1 : action === "remove" && game.score1 < game.score2 ? -1 : 0),
        };
        return result;
      } else if (t.name === game.team2) {
        const result = {
          ...t,
          games: t.games + (action === "add" ? 1 : -1),
          points:
            t.points +
            (action === "add"
              ? game.score2 > game.score1
                ? 3
                : game.score1 === game.score2
                ? 1
                : 0
              : -(game.score2 > game.score1
                  ? 3
                  : game.score1 === game.score2
                  ? 1
                  : 0)),
          wins: t.wins + (action === "add" && game.score2 > game.score1 ? 1 : action === "remove" && game.score2 > game.score1 ? -1 : 0),
          losses: t.losses + (action === "add" && game.score2 < game.score1 ? 1 : action === "remove" && game.score2 < game.score1 ? -1 : 0),
        };
        return result;
      }
      return t;
    });
  };

  const saveGame = () => {
    if (team1 === team2 || team1 === "" || team2 === "") return;

    const newGame = { team1, score1, team2, score2, date: new Date() };

    if (editingIndex !== null) {
      setTeams(updatePoints(games[editingIndex], "remove"));
      setTeams((prev) => updatePoints(newGame, "add"));
      const updatedGames = [...games];
      updatedGames[editingIndex] = newGame;
      setGames(updatedGames);
      setEditingIndex(null);
    } else {
      setTeams(updatePoints(newGame, "add"));
      setGames([...games, newGame]);
    }

    setTeam1("");
    setTeam2("");
    setScore1(0);
    setScore2(0);
  };

  const editGame = (index) => {
    const g = games[index];
    setTeam1(g.team1);
    setScore1(g.score1);
    setTeam2(g.team2);
    setScore2(g.score2);
    setEditingIndex(index);
  };

  const deleteGame = (index) => {
    const gameToRemove = games[index];
    setTeams(updatePoints(gameToRemove, "remove"));
    setGames(games.filter((_, i) => i !== index));
    const updatedComments = { ...comments };
    delete updatedComments[index];
    setComments(updatedComments);
  };

  const addComment = (index, text) => {
    setComments({ ...comments, [index]: text });
  };

  return (
    <div className={darkMode ? "min-h-screen bg-gray-900 text-white p-6" : "min-h-screen bg-yellow-100 p-6"}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-center flex-1">🍻 Smash’n’Bier Liga 🍻</h1>
        <Button onClick={() => setDarkMode(!darkMode)}>{darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</Button>
      </div>

      {/* Rangliste */}
      <Card className="max-w-2xl mx-auto mb-8">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">🏆 Rangliste & Statistiken</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-yellow-300">
                <th className="border p-2">Logo</th>
                <th className="border p-2">Team</th>
                <th className="border p-2">Spiele</th>
                <th className="border p-2">Punkte</th>
                <th className="border p-2">Siege</th>
                <th className="border p-2">Niederlagen</th>
              </tr>
            </thead>
            <tbody>
              {teams.sort((a, b) => b.points - a.points).map((team, i) => (
                <tr key={i} className="odd:bg-yellow-50 even:bg-yellow-100">
                  <td className="border p-2">{team.logo && <img src={team.logo} alt={team.name} className="w-10 h-10 object-cover rounded-full" />}</td>
                  <td className="border p-2">{team.name}</td>
                  <td className="border p-2 text-center">{team.games}</td>
                  <td className="border p-2 text-center">{team.points}</td>
                  <td className="border p-2 text-center">{team.wins || 0}</td>
                  <td className="border p-2 text-center">{team.losses || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Rest der Seite (Spielhistorie, Kommentare, Login/Adminbereich) bleibt wie vorher */}
    </div>
  );
}
