export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const username = decodeURIComponent(params.username).slice(1);

  return <div>{username}&apos;s amazing profile page</div>;
}
