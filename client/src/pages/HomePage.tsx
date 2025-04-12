import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <section className="">
      <h1>{user?.id}</h1>
    </section>
  );
};

export default HomePage;
