import { Button } from "@/components/ui/button";
import Link from "next/dist/client/link";

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const { error } = await searchParams;
  console.log(error);
  return (
    <div className="flex-1 text-center">
      <h1 className="text-2xl font-semibold leading-tight pb-4">
        Erreur lors de l&apos;authentification :
      </h1>
      <p className="text-muted-foreground pb-8">
        {decodeURIComponent(error).replaceAll("_", " ")}
      </p>
      <Button variant={"outline"} asChild>
        <Link href={"/"}>Retour à l&apos;accueil</Link>
      </Button>
    </div>
  );
}
