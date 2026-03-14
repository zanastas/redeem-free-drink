import HomePageClient from "./components/HomePageClient";

type HomePageProps = {
  searchParams?: {
    c?: string | string[];
  };
};

export default function HomePage({ searchParams }: HomePageProps) {
  const rawCode = searchParams?.c;
  const initialCode = typeof rawCode === "string" ? rawCode : null;

  return <HomePageClient initialCode={initialCode} />;
}
