# Projeto Shape Max

Miniapp de treino mobile-first. Abra na academia, marque exercício por exercício, registre carga/reps, marque o cardio e acompanhe seu histórico. Tudo salvo localmente no celular (localStorage), sem login, sem backend.

## Stack

- React 18 + Vite
- Tailwind CSS
- localStorage (sem backend)
- 100% mobile-first, otimizado para iPhone

## Rodar localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`. Pra acessar do celular na mesma rede:

```bash
npm run dev -- --host
```

E acesse o IP local que o Vite mostrar (ex: `http://192.168.0.10:5173`).

## Build

```bash
npm run build
npm run preview
```

## Deploy na Vercel

1. Suba o projeto pro GitHub.
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório.
3. A Vercel detecta Vite automaticamente. Não precisa configurar nada.
4. Clique em Deploy. Pronto — você terá um link `https://projeto-shape-max.vercel.app` (ou similar) pra abrir direto no celular.

Dica: depois de aberto no Safari/Chrome do celular, use "Adicionar à Tela de Início" pra ficar como um app.

## Como usa

- **Treino A/B/C/D** — escolha o treino do dia no topo
- **Checkbox grande** — toca pra marcar exercício feito
- **Carga / Reps / Obs** — preenche os números enquanto treina
- **Cardio** — marca quando terminou (fica azul)
- **Métricas do dia** — peso, cintura, observações gerais
- **Histórico** — últimos 10 dias com qualquer registro
- **Estatísticas** — sessões, frequência, progresso
- **Sessão completa** — quando ≥70% dos itens estão marcados
- **Limpar treino de hoje** — zera só o dia atual; não mexe no histórico

Os dados ficam salvos automaticamente conforme você marca/digita.

## Estrutura

```
projeto-shape-max/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── App.jsx
    └── index.css
```
