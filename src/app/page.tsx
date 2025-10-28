"use client";

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

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/classes");
    } else {
      setError("Mot de passe incorrect, veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="bg-blue-600/10 h-16 w-16 rounded-full flex items-center justify-center mb-4 mx-auto">
            <GraduationCap className="h-10 w-10 text-blue-600 " />
          </div>
          <CardTitle className="text-3xl font-bold leading-tight text-center mb-2">
            CompoStudy
          </CardTitle>
          <CardDescription>
            Ce contenu est protégé, veuillez indiquer le mot de passe ci-dessous
            pour y accéder.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
  );
}
