import { useEffect, useState } from "react";
import { fetchRepos } from "../services/githubService";

export default function useGithub(username) {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetchRepos(username).then((data) => {
      const filtered = data.filter((r) => !r.fork);
      setRepos(filtered);
    });
  }, [username]);

  return repos;
}