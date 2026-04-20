export async function fetchRepos(username) {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos`
  );
  return res.json();
}