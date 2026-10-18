# Бой стаи — веб-прототип

Играть: https://alanvoll.github.io/TD/ (страница GitHub Pages, выкладывается из папки `docs/` автоматически при каждом push).

- `src/` — исходники прототипа (`build.py` собирает один HTML-файл из `head.html`, `style.css`, `body.html`, `js/*.js`; `tools/` — проверки и балансные симуляции).
- `docs/index.html` — собранная игра, её и показывает GitHub Pages.

Обновить игру на сайте:

```
python3 make_site.py 0.37.0 127   # версия и номер сборки
git add -A && git commit -m "Сборка 0.37.0 · 127" && git push
```

## Landscape test page
`docs/landscape/` (alanvoll.github.io/TD/landscape/) is a sideways test of the battle screen, built from `src/` plus `landscape/zz-landscape.js`:
`python3 landscape/make_landscape.py VERSION BUILD`. `src/` is not changed by it; creature pictures come from `docs/cr/`.
