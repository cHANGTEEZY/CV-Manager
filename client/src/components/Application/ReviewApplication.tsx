import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Send } from "lucide-react";

const dummyUserData = {
  name: "Sushank Gurung",
  email: "Sushank@gmail.com",
  phoneNo: "123123123123123123",
  appliedPosition: "Junior React Developer"
};

const ReviewApplicationForm = () => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      setUserData(dummyUserData);
      setIsLoading(false);
    };
    getData();
  }, [userData]);

  return (
    <section>
      {isLoading ? (
        <div className="flex w-full items-center justify-center mt-50 text-muted-foreground">
          <h1 className="animate-pulse text-2xl">Loading user data...</h1>
        </div>
      ) : Object.keys(userData).length > 0 ? (
        <div>
          <div>
            <Card>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-17 w-17">
                      <AvatarFallback>
                        {userData.name?.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">{userData?.name || "NA"}</h2>
                      <p className="text-sm text-muted-foreground">{userData?.email || "NA"}</p>
                      <p className="text-sm text-muted-foreground">{userData?.phoneNo || "NA"}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="text-green-400 flex items-center gap-2">
                    <Send size={16} /> Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex">
            <Card>

                </Card>
            <Card>

            </Card>
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center mt-50 text-muted-foreground">
          <h1 className="text-2xl">No user data found for the given user</h1>
        </div>
      )}
    </section>
  );
};

export default ReviewApplicationForm;
