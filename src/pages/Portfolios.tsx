import { useState } from "react";
import { Link } from "react-router-dom";
import { usePortfolios, useUsers, useCreatePortfolio } from "@/hooks/use-api";
import {
  Button,
  Card,
  CardContent,
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
    return <p className="text-slate-600">Carregando...</p>;
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent>
          <p className="text-red-700">Erro: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const list = portfolios ?? [];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Portfólios</h1>
        <Button onClick={() => setShowForm((v) => !v)} variant="primary">
          {showForm ? "Cancelar" : "Novo portfólio"}
        </Button>
      </div>

      {showForm ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Novo portfólio</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
              <Input
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Investimentos 2025"
                required
                disabled={createMutation.isPending}
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
              />
              <Select
                label="Moeda base"
                value={baseCurrency}
                onChange={(e) =>
                  setBaseCurrency(e.target.value as "BRL" | "USD")
                }
                options={currencyOptions}
                disabled={createMutation.isPending}
              />
              {createMutation.error ? (
                <p className="text-sm text-red-600">
                  {createMutation.error.message}
                </p>
              ) : null}
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Criando..." : "Criar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {list.length === 0 ? (
        <Card>
          <CardContent>
            <p className="text-slate-600">Nenhum portfólio cadastrado.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <Link key={p.id} to={`/portfolios/${p.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-500">
                    Moeda base: {p.base_currency}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
