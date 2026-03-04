import { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#eef3f8] px-4 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),transparent_34%),linear-gradient(135deg,#edf4ff_0%,#f4f7fb_45%,#ebf7f2_100%)]" />
      <div className="absolute left-[-8%] top-[-10%] h-64 w-64 rounded-full bg-white/70 blur-3xl" />
      <div className="absolute right-[-12%] top-[18%] h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="absolute bottom-[-12%] left-[12%] h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

      <Card className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/60 bg-white/28 shadow-[0_24px_80px_rgba(148,163,184,0.22)] backdrop-blur-3xl">
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/80" />
        <div className="pointer-events-none absolute inset-x-10 top-3 h-24 rounded-full bg-white/45 blur-2xl" />

        <CardHeader className="space-y-2 px-8 pt-8 text-center">
          <div className="space-y-1">
            <CardTitle className="text-[2rem] font-semibold tracking-[-0.04em] text-slate-900">
              Billing
            </CardTitle>
            <CardDescription className="mx-auto max-w-xs text-[15px] leading-6 text-slate-600">
              Entre com seu email e senha para acessar sua conta.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-700/90">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                autoComplete="email"
                className="h-12 rounded-2xl border border-slate-300/70 bg-white/55 text-slate-900 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_8px_24px_rgba(255,255,255,0.2)] backdrop-blur-2xl focus-visible:border-slate-400 focus-visible:ring-white/70"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password" className="text-slate-700/90">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-12 rounded-2xl border border-slate-300/70 bg-white/55 text-slate-900 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_8px_24px_rgba(255,255,255,0.2)] backdrop-blur-2xl focus-visible:border-slate-400 focus-visible:ring-white/70"
                required
              />
            </div>

            {error ? (
              <div
                className="flex items-start gap-2 rounded-2xl border border-red-200/70 bg-red-50/75 px-4 py-3 text-sm text-red-700 backdrop-blur-xl"
                role="alert"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <Button
              type="submit"
              className="h-12 w-full rounded-2xl border border-white/70 bg-white/55 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_14px_30px_rgba(148,163,184,0.18)] backdrop-blur-2xl hover:bg-white/70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
