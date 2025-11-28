"use client";

import GoogleButton from "@/components/google-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { loginAction } from "@/lib/server";
import { Eye, EyeClosed, GraduationCap, LockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await loginAction(password);

    if (res.success) {
      router.push("/classes");
    } else {
      setError("Mot de passe incorrect, veuillez réessayer.");
    }
  };

  return (
    <>
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <div className="bg-blue-600/10 h-16 w-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <GraduationCap className="h-10 w-10 text-blue-600 " />
            </div>
            <CardTitle className="text-3xl font-bold leading-tight text-center mb-2">
              CompoStudy
            </CardTitle>
            <CardDescription>
              Ce contenu est protégé, veuillez vous authentifier pour y accéder.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleButton />
            <p className="mt-2 text-justify text-muted-foreground text-xs">
              Seules les adresses en <code>@ejm.org</code> et{" "}
              <code>@ejm.net</code> sont autorisées.
            </p>
            <div className="flex items-center my-4">
              <div className="grow h-px bg-muted" />
              <span className="mx-4 text-muted-foreground text-xs uppercase font-medium">
                ou continuez en mode invité
              </span>
              <div className="grow h-px bg-muted" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputGroup className="py-5">
                <InputGroupInput
                  type={isVisible ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez le mot de passe..."
                  required
                />
                <InputGroupAddon>
                  <LockIcon />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    aria-label="Toggle visibility"
                    title=""
                    size="icon-xs"
                    onClick={() => setIsVisible(!isVisible)}
                  >
                    {isVisible ? <Eye /> : <EyeClosed />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>

              {error && (
                <p className="text-red-500 dark:text-red-400 text-sm text-center">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
              >
                Enter
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
