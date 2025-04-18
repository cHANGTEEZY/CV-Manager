import { useAuth } from "@/contexts/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <section className="mx-auto mt-5 max-w-[800px] ">
      <h1>{user?.id}</h1>
    </section>
  );
};

export default HomePage;
