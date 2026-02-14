import { useState } from "react";
import { useUsers, useCreateUser } from "@/hooks/use-api";
import {
  Button,
  Card,
  CardContent,
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

  const list = users ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Usuários</h1>
        <Button onClick={() => setShowForm((v) => !v)} variant="primary">
          {showForm ? "Cancelar" : "Novo usuário"}
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Novo usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
              <Input
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                required
                disabled={createMutation.isPending}
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplo.com"
                required
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
            <p className="text-slate-600">Nenhum usuário cadastrado.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-left font-medium text-slate-700">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left font-medium text-slate-700">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {list.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {u.name}
                    </td>
                    <td className="px-6 py-3 text-slate-600">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
