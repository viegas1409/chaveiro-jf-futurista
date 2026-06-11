# Chaveiro JF — Site

Projeto estático: site promocional do Chaveiro JF 24 Horas (HTML/CSS/JS).

## Como rodar localmente

- Com Live Server (recomendado): abra o workspace no VS Code e clique com o botão direito em `index.html` → *Open with Live Server*.
- Com Python:

```bash
python -m http.server 8000
# abra http://localhost:8000/
```

- Com Node (npx):

```bash
npx http-server . -p 8080
# abra http://localhost:8080/
```

## Subir para o GitHub
1. Crie um repositório no GitHub (por exemplo `chaveiro-jf-futurista` no usuário `viegas1409`).
2. No terminal do projeto rode:

```bash
git add .
git commit -m "Add README and initial project files"
git remote add origin https://github.com/viegas1409/chaveiro-jf-futurista.git
git push -u origin main
```

Ou, se tiver o GitHub CLI instalado:

```bash
gh auth login
gh repo create viegas1409/chaveiro-jf-futurista --public --source=. --remote=origin --push
```

## Observações
- Se usar SSH substitua a URL por `git@github.com:viegas1409/chaveiro-jf-futurista.git`.
- Se preferir, posso criar o repositório via `gh` se você autorizar e tiver `gh` autenticado.