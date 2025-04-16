import { Search } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const data = [
  { email: "sushankgurung30@gmail.com" },
  { email: "alexmaharjan30@gmail.com" },
  { email: "soemthing@gmail.com" },
];

const EmailControls = () => {
  const [applicantName, setApplicantName] = useState("");
  const [applicantResults, setApplicantResults] = useState(data);

  const filteredApplicants = applicantResults.filter((applicant) =>
    applicant.email.toLowerCase().includes(applicantName.toLowerCase()),
  );

  return (
    <section className="w-full  mt-11 space-y-10">
      <Card>
        <CardHeader className="flex items-center border-b">
          <Search />
          <Input
            value={applicantName}
            onChange={(e) => setApplicantName(e.target.value)}
            type="text"
            placeholder="Search applicant via email"
          />
        </CardHeader>
        <CardContent>
          <ul>
            {filteredApplicants.map((applicant) => (
              <li className="flex items-center gap-2 mb-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="">
                    {applicant.email
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {applicant.email}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>Typography</CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-4 ">
            <div>
              <h3>Select Font</h3>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={"Select font you like"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="poppins">Poppins</SelectItem>
                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                    <SelectItem value="sf-pro">SF Pro</SelectItem>
                    <SelectItem value="roboto">Roboto</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3>Select Weight</h3>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={"Select font you like"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="thin">Thin</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="semi-bold">Semi Bold</SelectItem>
                    <SelectItem value="extra-bold">Extra Bold</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3>Spacing</h3>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={"Select spacing size "} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value=".6">.6 rem</SelectItem>
                    <SelectItem value=".7">.7 rem</SelectItem>
                    <SelectItem value=".8">.8 rem</SelectItem>
                    <SelectItem value=".9">.9 rem</SelectItem>
                    <SelectItem value="1.1">1.1 rem</SelectItem>
                    <SelectItem value="1.2">1.2 rem</SelectItem>
                    <SelectItem value="1.3">1.3 rem</SelectItem>
                    <SelectItem value="1.4">1.4 rem</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3>Letter Spacing</h3>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder={"Select spacing "} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="-2">-2%</SelectItem>
                    <SelectItem value="-3">-3%</SelectItem>
                    <SelectItem value="-4">-4%</SelectItem>
                    <SelectItem value="-5">-5%</SelectItem>
                    <SelectItem value="2">2%</SelectItem>
                    <SelectItem value="3">3%</SelectItem>
                    <SelectItem value="4">4%</SelectItem>
                    <SelectItem value="5">5%</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default EmailControls;
