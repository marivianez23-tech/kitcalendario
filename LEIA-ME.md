# Calendário Pro 2027

Página estática em HTML, CSS e JavaScript. Não precisa instalar dependências, rodar build ou contratar servidor.

## Ativar os checkouts

Abra `config.js` em um editor de texto e preencha os três endereços:

```js
checkout: {
  basico: "https://SEU-CHECKOUT-DE-10-REAIS",
  premium: "https://SEU-CHECKOUT-DE-27-REAIS",
  promocional: "https://SEU-CHECKOUT-DE-19-90"
}
```

Cada checkout deve cobrar exatamente o preço anunciado. A LP apenas redireciona: o valor é configurado na sua plataforma de pagamentos.

Preencha também `suporteEmail`, `vendedor` e `documento` com os seus dados públicos. A garantia padrão é de 30 dias e pode ser alterada em `garantiaDias`.

Os campos vazios mantêm a página em modo demonstrativo: ao clicar em comprar, aparece um aviso de configuração. Nenhum checkout do concorrente ou da sua oferta anterior foi reutilizado.

## Conferir a prévia

- Abra `index.html` na pasta extraída. Mantenha os demais arquivos e a pasta `assets` juntos.
- O arquivo separado `PREVIA-CALENDARIO-2027.html` é uma cópia autossuficiente: imagens, fontes e código estão embutidos. Basta abrir no navegador. Ele está em modo demonstrativo e não é o arquivo recomendado para editar ou publicar.
- A página funciona sem internet para visualizar modelos e interações. Só o checkout exige conexão.

## Subir no GitHub e na Vercel

1. Extraia o ZIP.
2. Crie um repositório no GitHub e envie **o conteúdo da pasta**, com `index.html` na raiz. Inclua `assets` e todos os arquivos JS/CSS.
3. Na Vercel, escolha **Add New → Project**, importe o repositório e selecione o preset **Other**, se solicitado.
4. Não configure comando de build ou instalação. O projeto é estático e inclui `vercel.json`.
5. Publique e teste seus três links de checkout.

Não é necessário enviar a prévia autossuficiente para a Vercel. `LEIA-ME.md` e `ANALISE-DA-LP.md` são documentação de apoio e também podem ficar fora da publicação.

## Fluxos implementados

| Ação | Resultado |
| --- | --- |
| Clicar no Básico de R$10 | Abre upgrade para Premium por R$19,90 |
| Aceitar o upgrade | Abre `checkout.promocional` |
| Continuar com o Básico | Abre `checkout.basico` |
| Clicar no Premium de R$27 | Abre `checkout.premium` |
| Mouse saindo pelo topo no desktop | Oferece a roleta uma vez por sessão, após 10 segundos e alguma rolagem |
| Retorno rápido perto do topo no mobile | Oferece a roleta após rolar mais de 1.200 px e retornar para a faixa de 250–700 px |
| Botão “Ver minha condição especial” no rodapé | Permite abrir a roleta manualmente para demonstrar/testar |
| Girar a roleta | Revela sempre Premium por R$19,90, informado como desconto garantido |
| Escape, botão fechar ou clique fora | Fecha a janela e permite continuar navegando |

Browsers não permitem abrir uma roleta no fechamento real de uma aba. Por isso, a recuperação usa sinais de intenção de saída. No celular não há detecção universal de saída; o retorno de rolagem é uma alternativa. A página não prende o botão Voltar.

## Ajustes simples

- Cores: variáveis no começo de `styles.css`, principalmente `--pink`, `--pink-light` e `--bg`.
- Textos, benefícios e preços exibidos: `index.html`. Se alterar valores, confira também os textos dos dois modais e os rótulos da roleta.
- Segmentos e filtros: lista `segments` no começo de `app.js`.
- Desativar roleta: `roletaAtiva: false` em `config.js`.
- Parâmetros de campanhas são preservados nos checkouts: UTMs, `fbclid`, `gclid`, `ttclid`, `src` e `sck`. Parâmetros existentes no checkout têm prioridade. Desative com `preservarUTMs: false`.
- Para campanhas que abrem diretamente nos planos, use `?secao=planos` ou `#planos`.
- Não há pixels, ferramentas de sessão nem códigos de rastreamento do concorrente. O evento JavaScript `lp:checkout` informa o plano selecionado quando um checkout válido é acionado.

## Conferir antes de publicar sua oferta

O conteúdo comercial foi modelado a partir da LP de referência porque seu entregável não foi anexado. Confira se o que você entrega inclui os 60 modelos, 27 modelos em pé, 15 segmentos, 4 estilos, bônus, licença de produção, acesso vitalício e garantia descritos. Ajuste o texto se seu pacote for diferente.

As imagens foram baixadas da página indicada e estão locais. Use-as na sua publicação com a autorização/licença correspondente; confira se representam o seu entregável. Não foram utilizados os depoimentos de clientes do concorrente.

## Arquivos

- `index.html`: página e textos.
- `styles.css`: tema e responsividade.
- `app.js`: catálogo, filtros, modais e redirecionamento.
- `config.js`: checkouts e dados públicos.
- `fonts.css` e `assets/`: fontes e imagens locais.
- `vercel.json`: configuração da hospedagem estática.
- `favicon.svg`: ícone da marca.
- `ANALISE-DA-LP.md`: análise e decisões de conteúdo.
