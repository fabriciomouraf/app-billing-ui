# Regra de UI Apple Liquid Glass

## Objetivo

Esta regra instrui agentes de IA a gerar componentes de interface utilizando o estilo **Apple Liquid Glass** (semelhante ao visual usado em visionOS e interfaces modernas da Apple).

Sempre que o usuário solicitar um componente com aparência **glass**, **glassmorphism** ou **liquid glass**, o agente deve implementar o design utilizando:

* transparência
* blur de fundo
* highlights em camadas
* sombras suaves
* bordas translúcidas

Essa regra garante consistência visual entre todos os componentes gerados.

---

# Princípios Visuais

Todos os componentes Liquid Glass devem seguir estes princípios.

## 1. Translucidez

Superfícies de vidro devem ser semi-transparentes.

Utilizar fundo com RGBA.

Exemplo:

```
background: rgba(255,255,255,0.55)
```

---

## 2. Blur de Fundo

O efeito glass deve desfocar o conteúdo atrás do componente.

CSS obrigatório:

```
backdrop-filter: blur(18px) saturate(160%);
-webkit-backdrop-filter: blur(18px) saturate(160%);
```

---

## 3. Vidro em Camadas

Todo componente deve possuir **duas camadas visuais**.

Camada 1
Container principal de vidro.

Camada 2
Overlay de highlights usando gradientes.

Isso cria o efeito de profundidade típico das interfaces da Apple.

---

## 4. Bordas Suaves

Elementos glass devem possuir borda translúcida.

Exemplo:

```
border: 1px solid rgba(255,255,255,0.35)
```

---

## 5. Highlight Interno

Adicionar um highlight interno sutil.

Exemplo:

```
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.18)
```

---

## 6. Sombra Suave

Componentes devem parecer flutuar sobre o fundo.

Exemplo:

```
box-shadow:
  0 10px 30px rgba(0,0,0,0.10)
```

---

## 7. Brilho nas Bordas (Edge Glow)

Adicionar highlight radial sutil para dar profundidade.

Exemplo:

```
radial-gradient(
  circle at 20% 10%,
  rgba(255,255,255,0.22),
  transparent 55%
)
```

---

# Tokens de Design

Os agentes devem utilizar sempre os seguintes valores padrão.

---

## Blur e Saturação

Blur padrão

```
18px
```

Blur grande

```
24px
```

Blur pequeno

```
12px
```

Saturação

```
160%
```

---

## Tema Claro (Light)

Background glass

```
rgba(255,255,255,0.55)
```

Borda

```
rgba(255,255,255,0.35)
```

Highlight

```
rgba(255,255,255,0.70)
```

Sombra

```
rgba(0,0,0,0.10)
```

Brilho de borda

```
rgba(255,255,255,0.22)
```

---

## Tema Escuro (Dark)

Background glass

```
rgba(20,20,20,0.45)
```

Borda

```
rgba(255,255,255,0.14)
```

Highlight

```
rgba(255,255,255,0.18)
```

Sombra

```
rgba(0,0,0,0.45)
```

Brilho de borda

```
rgba(255,255,255,0.12)
```

---

## Raio das Bordas

Cards

```
20px
```

Inputs

```
16px
```

Botões / Pills

```
999px
```

---

## Espaçamento Interno

Cards

```
16px – 20px
```

Inputs

```
10px – 12px
```

---

# CSS Base do Liquid Glass

Todos os componentes devem utilizar esta classe base.

```
:root {
  --lg-blur: 18px;
  --lg-sat: 160%;
  --lg-radius: 20px;

  --lg-bg: rgba(255,255,255,0.55);
  --lg-border: rgba(255,255,255,0.35);
  --lg-highlight: rgba(255,255,255,0.70);
  --lg-shadow: rgba(0,0,0,0.10);
  --lg-edge: rgba(255,255,255,0.22);
}

[data-theme="dark"] {
  --lg-bg: rgba(20,20,20,0.45);
  --lg-border: rgba(255,255,255,0.14);
  --lg-highlight: rgba(255,255,255,0.18);
  --lg-shadow: rgba(0,0,0,0.45);
  --lg-edge: rgba(255,255,255,0.12);
}

.liquid-glass {
  position: relative;
  border-radius: var(--lg-radius);
  background: var(--lg-bg);
  border: 1px solid var(--lg-border);

  box-shadow:
    0 10px 30px var(--lg-shadow),
    inset 0 1px 0 rgba(255,255,255,0.18);

  backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat));
  -webkit-backdrop-filter: blur(var(--lg-blur)) saturate(var(--lg-sat));

  overflow: hidden;
}

.liquid-glass::before {
  content: "";
  position: absolute;
  inset: 0;

  background:
    linear-gradient(
      to bottom,
      rgba(255,255,255,0.35),
      rgba(255,255,255,0.08) 35%,
      rgba(255,255,255,0.00) 65%
    );

  pointer-events: none;
}

.liquid-glass::after {
  content: "";
  position: absolute;
  inset: -40%;

  background:
    radial-gradient(
      circle at 20% 10%,
      var(--lg-edge),
      rgba(255,255,255,0.00) 55%
    );

  pointer-events: none;
}
```

---

# Implementação com Tailwind

Se o projeto utilizar Tailwind, os agentes devem criar classes reutilizáveis.

Exemplo:

```
@layer components {

  .lg-card {
    @apply relative overflow-hidden rounded-2xl
           border border-white/35 dark:border-white/15
           bg-white/55 dark:bg-neutral-900/45
           shadow-[0_10px_30px_rgba(0,0,0,0.10)]
           dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)];

    backdrop-filter: blur(18px) saturate(160%);
    -webkit-backdrop-filter: blur(18px) saturate(160%);
  }

}
```

Pseudo-elementos devem continuar sendo utilizados para highlights.

---

# Componentes que Devem Seguir Essa Regra

Os agentes devem ser capazes de gerar estes componentes:

Card Glass
Modal Glass
Navbar Glass
Sidebar Glass
Botão Glass
Input Glass
Select Glass
Notificação Glass
Painel Glass

---

# Requisitos de Acessibilidade

Os agentes devem garantir:

Contraste de texto adequado.

Exemplo:

```
text-neutral-900
```

para modo claro.

```
text-white
```

para modo escuro.

O foco deve ser visível.

Exemplo:

ring ou outline ao focar.

Evitar excesso de transparência que prejudique a leitura.

---

# Fallback para Navegadores

Caso o navegador não suporte `backdrop-filter`, deve existir fallback.

```
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {

  .liquid-glass {
    background: rgba(255,255,255,0.85);
  }

  [data-theme="dark"] .liquid-glass {
    background: rgba(20,20,20,0.80);
  }

}
```

---

# Requisitos de Saída da IA

Sempre que o usuário pedir um componente Liquid Glass, a IA deve:

1. Gerar um componente completo.

Incluindo:

HTML ou JSX
CSS ou Tailwind

2. Utilizar os tokens definidos nesta regra.

3. Aplicar blur e saturação.

4. Incluir highlights.

5. Incluir edge glow.

6. Suportar dark mode.

7. Incluir fallback sem blur.

---

# Checklist Final

Antes de gerar um componente, a IA deve verificar:

Blur aplicado
Saturação aplicada
Background glass aplicado
Borda suave aplicada
Highlight interno aplicado
Edge glow aplicado
Sombra aplicada
Dark mode suportado
Fallback incluído
