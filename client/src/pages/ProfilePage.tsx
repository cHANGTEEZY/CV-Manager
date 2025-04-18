import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

import { useAuth } from "@/contexts/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <section className="mx-auto mt-5 max-w-[800px] ">
      <div>
        <Card className="w-md">
          <CardContent>
            <div className="flex gap-5 items-center">
              <Avatar className="w-30 h-30">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>user</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-bold text-2xl">
                  {user?.user_metadata?.full_name}
                </h1>
                <p className="text-slate-600">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div></div>
    </section>
  );
};

export default ProfilePage;
