# Projekt Końcowy

## 0. Założenia
___

Będzie to "symulator" nie istniejącego systemu operacyjnego.
Będzie się składał z kilku elementów takich jak:

- Menedżer okien pulpitu (większość plików w `windowManager`)
- System ładowania plików (`windowManager/assetManager.js`)
- Aplikacji (np. Kalkulator, Tetris, Odtwarzacz muzyki, DOOM)
- Własny system do tworzenia GUI (coś ala GTK lub QT) 

## 1. Funkcjonowanie
___

Wszystko opiera się na elemencie `canvas`. Wiekszość popularnych przeglądarek będzie wspierane (Chrome, Firefox, i pochodne).
Narazie projekt działa tylko na wyświetlaczach 1080p (Jest to spowodowane statycznymi rozmiarami) ale w przyszłości założeniem jest skalowalność pulpitu (tak aby działał na innych monitorach).


## 2. Zasady Działania
___

Wykorzystywanie elementu canvas i atrybutu css `position: absolute;`
"Łapanie" eventów typu: `mouseDown, mouseMove, itp.`.
Każda z aplikacji dostaję dostęp do własnego elementu np. `canvas, iframe`
Będą tagże wywoływane funkcje np. `windowClick(x,y)` który ma zastąpić eventu `mousedown`

## 3. Budowa
___

Modularność jest głownym założeniem tego projektu.
Każdy "moduł" jest w osobnym katalogu.
Wykorzystuję takie deklaracje jak: `import`, `export class`

## 4. Cele
___

Wykonanie w miare funkcjonalnego pulpitu "dla zabawy".
W tym:
- [x] Klon tetrisa
- [x] Port dooma
- [x] Początki pulpitu
- [x] Działające okienka (Można je: przesuwać, minimalizować, zamykać)
- [ ] Bardziej działające okienka (skalowanie)
- [ ] Poprawne indexowanie w osi z (css `z-index`)
- [ ] Odtwarzacz muzyki (html tag `audio`)
- [ ] Kalkulator
- [ ] Zegar + Kalendarz
- [ ] Pogoda (openweathermap)
- [ ] Klon Pasjansa
- [ ] Klon Snake
- [ ] Klon Painta
- [ ] Własny toolkit do tworzenia GUI z pomocą json
- [ ] Pseudo-Pliki zapisywane jako ciasteczka (zapisy gry z dooma, rysunki z painta, itp)
- [ ] Zestaw własnych narzędzi do ułatwienia tworzenia GUI (Coś jak narzędzie `glide` do GTK)
- [ ] Widgety do pulpitu
- [ ] Lepsze (tzn. Jakiekolwiek) wsparcie WCAG

## 5. Inne
___

Wszystko jak narazie jest przechowywane na githubie ze względu na możliwość synchronizacji pracy bez potrzeby manualnego kopiowania plików.
Projekt będzie testowany na Arch linuxie na tych przeglądarkach: `Chromium, Firefox`
Nie zabardzo wiem co do `WCAG` poniewarz ten projekt wykorzystuje elementy html rodzaju `cavnas,script,audio`