import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, FolderPlus, Layers3 } from "lucide-react";
import { usePortfolios, useUsers, useCreatePortfolio } from "@/hooks/use-api";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Select,
} from "@/components/ui";

const currencyOptions = [
  { value: "BRL", label: "BRL" },
  { value: "USD", label: "USD" },
];

export function Portfolios() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [baseCurrency, setBaseCurrency] = useState<"BRL" | "USD">("BRL");
  const [userId, setUserId] = useState("");

  const { data: portfolios, isLoading, error } = usePortfolios();
  const { data: users } = useUsers();
  const createMutation = useCreatePortfolio({
    onSuccess: () => {
      setShowForm(false);
      setName("");
      setUserId("");
    },
  });

  const userOptions =
    users?.map((u) => ({ value: u.id, label: `${u.name} (${u.email})` })) ?? [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !userId) return;
    createMutation.mutate({
      name: name.trim(),
      baseCurrency,
      userId,
    });
  };

  if (isLoading) {
    return (
      <div className="grid gap-5 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card
            key={item}
            className="glass-panel animate-pulse border-0 bg-transparent shadow-none"
          >
            <CardHeader>
              <div className="h-4 w-24 rounded-full bg-slate-200/80" />
              <div className="h-8 w-40 rounded-full bg-slate-200/80" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-20 rounded-[1.25rem] bg-white/60" />
              <div className="h-12 rounded-[1rem] bg-white/60" />
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

  const list = portfolios ?? [];

  return (
    <div className="flex flex-col gap-8">
      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/75 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Portfolio
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-4xl">
                Estruture os portfólios no novo painel visual.
              </h1>
              <p className="max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Crie, organize e navegue pelos portfólios com cards mais densos,
                indicadores rápidos e formulários integrados ao padrão glass da
                aplicação.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[1.35rem] border border-white/70 bg-white/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Portfólios
                </span>
                <span className="mt-1 block text-2xl font-semibold tracking-[-0.05em] text-slate-950">
                  {list.length}
                </span>
              </div>
              <div className="rounded-[1.35rem] border border-white/70 bg-white/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)]">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Usuários
                </span>
                <span className="mt-1 block text-2xl font-semibold tracking-[-0.05em] text-slate-950">
                  {users?.length ?? 0}
                </span>
              </div>
            </div>
            <Button
              onClick={() => setShowForm((v) => !v)}
              variant="primary"
              className="h-12 rounded-full bg-blue-600 px-6 text-white shadow-[0_18px_35px_rgba(37,99,235,0.22)] hover:bg-blue-700"
            >
              <FolderPlus className="h-4 w-4" />
              {showForm ? "Cancelar" : "Novo portfólio"}
            </Button>
          </div>
        </div>
      </section>

      {showForm ? (
        <Card className="glass-panel border-0 bg-transparent shadow-none">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                Novo portfólio
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-slate-600">
                Defina o nome, o responsável e a moeda base.
              </CardDescription>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <Layers3 className="h-3.5 w-3.5" />
              Configuração inicial
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.7fr)_auto]"
            >
              <Input
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Investimentos 2025"
                required
                disabled={createMutation.isPending}
                className="glass-input"
              />
              <Select
                label="Usuário"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                options={[
                  { value: "", label: "Selecione um usuário" },
                  ...userOptions,
                ]}
                required
                disabled={createMutation.isPending}
                className="glass-input"
              />
              <Select
                label="Moeda base"
                value={baseCurrency}
                onChange={(e) =>
                  setBaseCurrency(e.target.value as "BRL" | "USD")
                }
                options={currencyOptions}
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
              <BriefcaseBusiness className="h-6 w-6" />
            </span>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-slate-950">
                Nenhum portfólio cadastrado.
              </h2>
              <p className="max-w-md text-sm text-slate-600">
                Abra um novo portfólio para começar a organizar buckets,
                transações e consolidações.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((portfolio, index) => (
            <Link key={portfolio.id} to={`/portfolios/${portfolio.id}`} className="group">
              <Card className="glass-panel h-full border-0 bg-transparent shadow-none transition duration-300 group-hover:-translate-y-1">
                <CardHeader className="gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <span className="inline-flex rounded-full border border-white/75 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Portfolio {String(index + 1).padStart(2, "0")}
                      </span>
                      <CardTitle className="text-[1.65rem] font-semibold tracking-[-0.04em] text-slate-950">
                        {portfolio.name}
                      </CardTitle>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/75 bg-white/72 text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.96)] transition group-hover:text-blue-600">
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-[1.35rem] border border-white/70 bg-white/65 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Moeda base
                    </span>
                    <span className="mt-2 block text-3xl font-semibold tracking-[-0.05em] text-slate-950">
                      {portfolio.base_currency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-[1.15rem] border border-white/60 bg-white/55 px-4 py-3 text-sm text-slate-600">
                    <span>Navegue para os detalhes do portfólio</span>
                    <span className="font-semibold text-slate-900">Abrir</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
