# UI Design System

## Objetivo

Este documento define o **design system padrão do projeto** que deve ser seguido por todos os agentes de IA ao gerar componentes de interface.

O objetivo é garantir:

* consistência visual
* reutilização de componentes
* padronização de estilos
* acessibilidade
* facilidade de manutenção

Sempre que um agente gerar qualquer interface (UI), ele deve seguir este design system.

---

# Filosofia do Design

O design do sistema segue os princípios:

**Minimalista**
Interfaces limpas e sem excesso de elementos.

**Consistente**
Componentes devem compartilhar o mesmo estilo e tokens.

**Escalável**
O sistema deve permitir criação de novas telas sem quebrar padrões.

**Acessível**
Textos devem ser legíveis e interações claras.

**Baseado em componentes**
Interfaces devem ser compostas por componentes reutilizáveis.

---

# Estrutura do Design System

O sistema é composto por:

Tokens
Componentes base
Componentes compostos
Layouts
Padrões de interação

---

# Design Tokens

Os tokens definem os valores globais usados na interface.

Eles devem ser reutilizados em todos os componentes.

---

# Cores

## Cores primárias

Primary

```
#2563eb
```

Primary hover

```
#1d4ed8
```

Primary light

```
#3b82f6
```

---

## Cores neutras

Background

```
#ffffff
```

Background dark

```
#0f172a
```

Surface

```
#f8fafc
```

Border

```
#e2e8f0
```

Text primary

```
#0f172a
```

Text secondary

```
#475569
```

Text muted

```
#94a3b8
```

---

# Cores de estado

Success

```
#22c55e
```

Warning

```
#f59e0b
```

Error

```
#ef4444
```

Info

```
#3b82f6
```

---

# Tipografia

A tipografia padrão deve ser simples e legível.

Fonte principal:

```
Inter
```

Fallback:

```
system-ui
sans-serif
```

---

## Escala tipográfica

Heading XL

```
32px
```

Heading LG

```
24px
```

Heading MD

```
20px
```

Body

```
16px
```

Small

```
14px
```

Caption

```
12px
```

---

# Peso da fonte

Regular

```
400
```

Medium

```
500
```

Semibold

```
600
```

Bold

```
700
```

---

# Espaçamento

Sistema de espaçamento baseado em múltiplos de 4.

```
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

---

# Raio de borda

Small

```
6px
```

Medium

```
10px
```

Large

```
16px
```

Extra Large

```
20px
```

Pill

```
999px
```

---

# Sombras

Shadow Small

```
0 1px 2px rgba(0,0,0,0.05)
```

Shadow Medium

```
0 4px 12px rgba(0,0,0,0.10)
```

Shadow Large

```
0 10px 30px rgba(0,0,0,0.15)
```

---

# Componentes Base

Os seguintes componentes são obrigatórios no design system.

## Button

Deve suportar:

Primary
Secondary
Ghost
Outline

Estados:

Default
Hover
Active
Disabled
Loading

---

## Input

Deve possuir:

Label
Placeholder
Helper text
Error state

---

## Select

Dropdown padrão do sistema.

Deve suportar:

* seleção simples
* estado disabled
* estado error

---

## Card

Container padrão para conteúdos.

Propriedades:

padding padrão
border
shadow leve
radius médio

---

## Modal

Janela sobreposta ao conteúdo.

Deve possuir:

overlay escuro
container centralizado
botão de fechar

---

## Badge

Indicador pequeno para status.

Exemplos:

success
warning
error
info

---

# Componentes Compostos

Componentes que utilizam componentes base.

Exemplos:

Navbar
Sidebar
Dashboard cards
Forms
Tables
Notifications

---

# Layouts

Layouts devem ser construídos usando grid ou flex.

---

## Layout padrão

Estrutura recomendada:

Header
Sidebar opcional
Main content
Footer opcional

---

## Grid

Usar grid responsivo.

Exemplo:

2 colunas
3 colunas
4 colunas

---

# Responsividade

Breakpoints recomendados:

Mobile

```
640px
```

Tablet

```
768px
```

Desktop

```
1024px
```

Large desktop

```
1280px
```

---

# Padrões de Interação

Interfaces devem seguir padrões previsíveis.

---

## Hover

Elementos interativos devem responder ao hover.

Exemplo:

* mudar background
* mudar sombra
* mudar cor do texto

---

## Focus

Inputs e botões devem ter foco visível.

Exemplo:

outline ou ring.

---

## Feedback visual

Ações do usuário devem gerar feedback.

Exemplos:

loading spinner
success toast
error message

---

# Acessibilidade

O sistema deve respeitar princípios básicos de acessibilidade.

Regras:

Texto deve possuir contraste suficiente.

Elementos clicáveis devem ter área mínima adequada.

Inputs devem possuir labels.

Teclado deve navegar corretamente.

---

# Padrões de Código

Ao gerar UI, os agentes devem:

Utilizar componentes reutilizáveis.

Evitar estilos inline.

Preferir classes utilitárias ou tokens.

Separar lógica de layout.

---

# Integração com Liquid Glass

Quando o projeto usar o estilo **Liquid Glass**, os componentes devem combinar:

design system
tokens de espaçamento
tipografia
efeitos glass

Utilizando a regra:

```
liquid-glass-ui.md
```

---

# Checklist para Agentes de IA

Antes de gerar UI, verificar:

Componentes seguem o design system
Tokens foram utilizados
Tipografia correta
Espaçamento consistente
Componentes reutilizáveis
Estados de interação implementados
Responsividade considerada
