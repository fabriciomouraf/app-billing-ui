# AGENTS.md

## Objetivo

Este documento define como **agentes de IA devem operar dentro deste repositório**.

Ele descreve:

* regras obrigatórias de desenvolvimento
* design system do projeto
* padrões de arquitetura de componentes
* regras de interface
* comportamento esperado da IA ao gerar código

Todos os agentes devem ler este arquivo antes de gerar qualquer código.

---

# Estrutura de Regras

As regras do projeto estão organizadas na pasta:

```
/rules
```

Cada arquivo define um conjunto específico de padrões.

## Regras disponíveis

### UI Design System

Arquivo:

```
rules/ui-design-system.md
```

Define:

* tokens de design
* tipografia
* cores
* espaçamento
* sombras
* componentes base
* responsividade
* acessibilidade

Todos os componentes visuais devem seguir esta regra.

---

### Liquid Glass UI

Arquivo:

```
rules/liquid-glass-ui.md
```

Define o padrão visual **Apple Liquid Glass** utilizado no projeto.

Inclui:

* blur e saturação
* transparência
* highlights
* edge glow
* dark mode
* fallback para navegadores sem suporte

Sempre que a interface utilizar vidro ou superfícies translúcidas, esta regra deve ser aplicada.

---

# Prioridade das Regras

Quando múltiplas regras forem aplicáveis, seguir a ordem de prioridade:

1. `ui-design-system.md`
2. `liquid-glass-ui.md`

O design system sempre define a base.

O Liquid Glass é aplicado como camada visual.

---

# Stack Tecnológica

Este projeto utiliza o seguinte stack padrão:

Frontend

* React
* Next.js
* TypeScript
* Tailwind CSS

Os agentes devem gerar código compatível com esse stack.

---

# Estrutura de Componentes

Componentes devem seguir a seguinte organização:

```
/components
    /ui
    /layout
    /forms
    /feedback
```

## components/ui

Componentes visuais reutilizáveis.

Exemplos:

Button
Input
Card
Badge
Select

---

## components/layout

Componentes estruturais da aplicação.

Exemplos:

Navbar
Sidebar
PageContainer
DashboardLayout

---

## components/forms

Componentes relacionados a formulários.

Exemplos:

FormField
FormSection
CheckboxGroup
InputGroup

---

## components/feedback

Componentes de feedback para o usuário.

Exemplos:

Toast
Alert
Modal
LoadingSpinner

---

# Regras de Implementação de Componentes

Quando gerar um componente, a IA deve:

1. Usar TypeScript.
2. Criar componentes reutilizáveis.
3. Utilizar Tailwind para estilos.
4. Utilizar tokens definidos no design system.
5. Garantir suporte a dark mode.
6. Garantir acessibilidade básica.

---

# Convenções de Código

## Nome de componentes

Componentes devem usar PascalCase.

Exemplo:

```
GlassCard
UserAvatar
DashboardPanel
```

---

## Estrutura de arquivo

Cada componente deve ter seu próprio diretório.

Exemplo:

```
components/ui/button/
    Button.tsx
```

---

# Padrões de Interface

A interface deve seguir:

* minimalismo visual
* consistência de espaçamento
* tipografia padronizada
* estados de interação claros

Estados obrigatórios:

hover
focus
disabled
loading

---

# Responsividade

Interfaces devem ser responsivas.

Breakpoints recomendados:

Mobile
Tablet
Desktop
Large desktop

---

# Acessibilidade

Os agentes devem garantir:

Contraste adequado entre texto e fundo.

Inputs devem possuir labels.

Elementos clicáveis devem ter área mínima adequada.

Componentes devem ser navegáveis por teclado.

---

# Regras para Geração de UI

Ao gerar componentes visuais, a IA deve:

1. Seguir o design system.
2. Utilizar tokens definidos nas regras.
3. Criar componentes reutilizáveis.
4. Implementar estados de interação.
5. Garantir responsividade.

---

# Integração com Liquid Glass

Quando o usuário solicitar:

* glass
* glassmorphism
* liquid glass
* interface estilo Apple

A IA deve aplicar automaticamente a regra:

```
rules/liquid-glass-ui.md
```

---

# Checklist para Agentes

Antes de finalizar qualquer geração de UI, verificar:

Componentes seguem o design system
Tokens foram utilizados
Dark mode suportado
Responsividade implementada
Acessibilidade considerada
Componentes reutilizáveis criados

---

# Comportamento Esperado da IA

Os agentes devem:

Preferir reutilização de componentes.

Evitar duplicação de estilos.

Gerar código limpo e organizado.

Seguir sempre as regras deste repositório.

Quando houver dúvida, priorizar consistência com o design system.
