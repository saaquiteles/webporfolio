import { useEffect, useState } from "react";
import { fetchRepos } from "../services/githubService";

// A hook that fetches a GitHub user's public repositories and returns them, so a component can show real project data.
export default function useGithub(username) {
  // Holds the list of repos to hand back to the caller, starting as an empty array until the fetch resolves.
  const [repos, setRepos] = useState([]);

  // Re-fetches the repos whenever the username changes, then keeps only the ones that aren't forks of other people's projects.
  useEffect(() => {
    fetchRepos(username).then((data) => {
      const filtered = data.filter((r) => !r.fork);
      setRepos(filtered);
    });
  }, [username]);

  return repos;
}