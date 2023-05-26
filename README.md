# Karousel
KWin tiling script with scrolling. Works especially well with ultrawide screens.

https://github.com/peterfajdiga/karousel/assets/22796326/f5054bd7-3f82-48f2-bf2a-4da3bb697c69

Karousel works differently from most tiling window managers in that it does not maximize the width
of windows, as this can be undesirable with wider screens, where it results in excessively wide
windows that require large return sweeps when reading their content.
Instead, it leaves the width of windows to the user's control. This additionally prevents
unprompted reflow of window content.

Windows are automatically centered when possible. And when running out of width, windows can be
scrolled through horizontally.

Similar window managers include [Cardboard](https://gitlab.com/cardboardwm/cardboard) and
[PaperWM](https://github.com/paperwm/PaperWM).

## Limitations
- Doesn't support multiple screens
- Doesn't support windows on all desktops
- Doesn't support windows on multiple activities
