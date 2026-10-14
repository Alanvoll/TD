# Бой стаи — веб-прототип

Играть: https://alanvoll.github.io/TD/ (страница GitHub Pages, выкладывается из папки `docs/` автоматически при каждом push).

- `src/` — исходники прототипа (`build.py` собирает один HTML-файл из `head.html`, `style.css`, `body.html`, `js/*.js`; `tools/` — проверки и балансные симуляции).
- `docs/index.html` — собранная игра, её и показывает GitHub Pages.

Обновить игру на сайте:

```
python3 make_site.py 0.37.0 127   # версия и номер сборки
git add -A && git commit -m "Сборка 0.37.0 · 127" && git push
```
