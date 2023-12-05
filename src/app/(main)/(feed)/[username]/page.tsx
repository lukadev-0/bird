import { clerkClient } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const username = decodeURIComponent(params.username).slice(1);

  const [user] = await clerkClient.users.getUserList({
    username: [username],
    limit: 1,
  });

  if (!user) notFound();

  return (
    <main>
      <div>
        <div className="relative h-48 bg-muted/20">
          <Avatar className="absolute bottom-0 left-6 h-24 w-24 translate-y-1/2 border-4 border-background">
            <AvatarImage src={user.imageUrl} />
            <AvatarFallback asChild>
              <Skeleton />
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="mt-14 px-6">
          <h1 className="text-xl font-semibold">
            {user.firstName ?? user.username}
          </h1>
          <div className="-mt-1 text-muted-foreground">@{user.username}</div>

          <div className="mt-4 text-sm text-muted-foreground">
            Joined{" "}
            <span className="font-medium text-foreground">
              {new Date(user.createdAt).toLocaleDateString("en-us", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="mt-6 flex items-center space-x-4">
            {user.externalAccounts.map((externalAccount) => {
              const url =
                externalAccount.provider === "oauth_github"
                  ? `https://github.com/${externalAccount.username}`
                  : undefined;

              const Component = url ? "a" : "span";

              return (
                <Component
                  key={externalAccount.id}
                  className={cn(
                    "inline-flex items-center text-sm font-medium text-muted-foreground",
                    { "hover:text-foreground": !!url },
                  )}
                  href={url}
                  target="_blank"
                  rel="norefferer noopener"
                >
                  {externalAccount.provider === "oauth_github" && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1.5 h-4 w-4"
                    >
                      <path
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                        fill="currentColor"
                      />
                    </svg>
                  )}

                  {externalAccount.provider === "oauth_discord" && (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1.5 h-4 w-4"
                    >
                      <title>Discord</title>
                      <path
                        d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}

                  <span className="-mt-px">{externalAccount.username}</span>
                </Component>
              );
            })}
          </div>
        </div>

        <Tabs defaultValue="posts">
          <TabsList className="mt-8 w-full items-stretch rounded-none px-6">
            <TabsTrigger value="posts" className="w-full">
              Posts
            </TabsTrigger>
            <TabsTrigger value="replies" className="w-full">
              Replies
            </TabsTrigger>
            <TabsTrigger value="likes" className="w-full">
              Likes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="px-6 py-4">
            Hi
          </TabsContent>

          <TabsContent value="replies" className="px-6 py-4">
            Hey
          </TabsContent>

          <TabsContent value="likes" className="px-6 py-4">
            Hello
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
