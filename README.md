# Karousel
KWin tiling script with scrolling. Works especially well with ultrawide screens.
Use with [this](https://github.com/peterfajdiga/kwin4_effect_geometry_change) for animations.

https://github.com/peterfajdiga/karousel/assets/22796326/2ab62d18-09c7-45f9-8fda-e5e36b8d7a02

Karousel works differently from most tiling window managers in that it does not maximize the width
of windows, as this can be undesirable with wider screens, where it results in excessively wide
windows that require large return sweeps when reading their content.
Instead, it leaves the width of windows to the user's control. This additionally prevents
unprompted reflow of window content.

Windows are automatically centered when possible. And when running out of width, windows can be
scrolled through horizontally.

Similar window managers include [PaperWM](https://github.com/paperwm/PaperWM) and
[Cardboard](https://gitlab.com/cardboardwm/cardboard).

## Limitations
- Doesn't support multiple screens
- Doesn't support windows on all desktops
- Doesn't support windows on multiple activities
