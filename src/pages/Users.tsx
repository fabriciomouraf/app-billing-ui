import { useState } from "react";
import { Mail, Plus, UserPlus, Users2 } from "lucide-react";
import { useUsers, useCreateUser } from "@/hooks/use-api";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";

export function Users() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { data: users, isLoading, error } = useUsers();
  const createMutation = useCreateUser({
    onSuccess: () => {
      setShowForm(false);
      setName("");
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    createMutation.mutate({ name: name.trim(), email: email.trim() });
  };

  if (isLoading) {
    return (
      <div className="grid gap-5 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            className="glass-panel animate-pulse border-0 bg-transparent shadow-none"
          >
            <CardContent className="space-y-3 p-6">
              <div className="h-14 w-14 rounded-[1.15rem] bg-white/65" />
              <div className="h-6 w-36 rounded-full bg-white/65" />
              <div className="h-4 w-48 rounded-full bg-white/65" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="glass-panel border border-red-200/80 bg-red-50/80 shadow-none">
        <CardContent className="p-6">
          <p className="text-red-700">Erro: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const list = users ?? [];

  return (
    <div className="flex flex-col gap-8">
      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/72 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              <Users2 className="h-3.5 w-3.5" />
              Usuários
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Gerencie responsáveis e acessos em um fluxo mais limpo.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                A interface foi reorganizada para destacar o cadastro e a lista
                de usuários dentro do mesmo padrão visual do restante do sistema.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-[1.35rem] border border-white/70 bg-white/70 px-5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Total cadastrado
              </span>
              <span className="mt-1 block text-2xl font-semibold tracking-[-0.05em] text-slate-950">
                {list.length}
              </span>
            </div>
            <Button
              onClick={() => setShowForm((v) => !v)}
              variant="primary"
              className="h-12 rounded-full bg-blue-600 px-6 text-white shadow-[0_18px_35px_rgba(37,99,235,0.22)] hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Cancelar" : "Novo usuário"}
            </Button>
          </div>
        </div>
      </section>

      {showForm ? (
        <Card className="glass-panel border-0 bg-transparent shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
              Novo usuário
            </CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Cadastre o nome completo e o e-mail para vincular portfólios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
            >
              <Input
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                required
                disabled={createMutation.isPending}
                className="glass-input"
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                required
                disabled={createMutation.isPending}
                className="glass-input"
              />
              <div className="flex flex-col justify-end gap-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
                >
                  {createMutation.isPending ? "Criando..." : "Criar"}
                </Button>
              </div>
            </form>
            {createMutation.error ? (
              <p className="mt-4 text-sm text-red-600">
                {createMutation.error.message}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {list.length === 0 ? (
        <Card className="glass-panel border-0 bg-transparent shadow-none">
          <CardContent className="flex flex-col items-start gap-3 p-8 text-left">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-[1.25rem] border border-white/70 bg-white/70 text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]">
              <UserPlus className="h-6 w-6" />
            </span>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-950">
                Nenhum usuário cadastrado.
              </h2>
              <p className="max-w-md text-sm text-slate-600">
                Crie usuários para associar portfólios e organizar o acesso aos
                dados financeiros.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {list.map((user, index) => (
            <Card
              key={user.id}
              className="glass-panel border-0 bg-transparent shadow-none"
            >
              <CardContent className="flex h-full flex-col gap-5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span className="inline-flex rounded-full border border-white/75 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Usuário {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                      {user.name}
                    </h2>
                  </div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/75 bg-white/72 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]">
                    <Users2 className="h-5 w-5" />
                  </span>
                </div>

                <div className="rounded-[1.25rem] border border-white/70 bg-white/65 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                  <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Contato
                  </span>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/75 bg-white/75 text-slate-500">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="break-all font-medium text-slate-800">
                      {user.email}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
