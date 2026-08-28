// Calls GitHub's public REST API to get a user's list of repositories and returns the parsed JSON response.
export async function fetchRepos(username) {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos`
  );
  return res.json();
}