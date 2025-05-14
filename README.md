# Karousel
Scrollable tiling Kwin script. Works especially well with ultrawide screens.
Use with [this](https://github.com/peterfajdiga/kwin4_effect_geometry_change) for animations.

https://github.com/peterfajdiga/karousel/assets/22796326/2ab62d18-09c7-45f9-8fda-e5e36b8d7a02

A scrollable tiling window manager tiles windows, but it does not maximize their widths. Instead, it leaves the width of windows to the user's control.
Windows are automatically centered when possible. And when running out of width, windows can be scrolled through horizontally.

Similar window managers include [PaperWM](https://github.com/paperwm/PaperWM),
[Niri](https://github.com/YaLTeR/niri), and
[Cardboard](https://gitlab.com/cardboardwm/cardboard).

## Dependencies
Karousel requires the following QML modules:
- QtQuick 6.0
- org.kde.kwin 3.0
- org.kde.notification 1.0

## Limitations
- Doesn't support multiple screens
- Doesn't support windows on all desktops
- Doesn't support windows on multiple activities

## Installation
First install the _org.kde.notification_ QML module (_qml-module-org-kde-notifications_ package on Ubuntu).

Then download the [latest release](https://github.com/peterfajdiga/karousel/releases/latest) and extract it into _~/.local/share/kwin/scripts/_.

Or clone the repo and run `make install` (requires npm, node, and tsc).

## Key bindings
The key bindings can be configured in KDE System Settings among KWin's own keyboard shortcuts.
Here's the default ones:
| Shortcut                 | Action                                                                                                                         |
| ---                      | ---                                                                                                                            |
| Meta+Space               | Toggle floating                                                                                                                |
| Meta+A                   | Move focus left                                                                                                                |
| Meta+D                   | Move focus right (Clashes with default KDE shortcuts, may require manual remapping)                                            |
| Meta+W                   | Move focus up (Clashes with default KDE shortcuts, may require manual remapping)                                               |
| Meta+S                   | Move focus down (Clashes with default KDE shortcuts, may require manual remapping)                                             |
| (unassigned)             | Move focus to the next window in grid                                                                                          |
| (unassigned)             | Move focus to the previous window in grid                                                                                      |
| Meta+Home                | Move focus to start                                                                                                            |
| Meta+End                 | Move focus to end                                                                                                              |
| Meta+Shift+A             | Move window left (Moves window out of and into columns)                                                                        |
| Meta+Shift+D             | Move window right (Moves window out of and into columns)                                                                       |
| Meta+Shift+W             | Move window up                                                                                                                 |
| Meta+Shift+S             | Move window down                                                                                                               |
| (unassigned)             | Move window to the next position in grid                                                                                       |
| (unassigned)             | Move window to the previous position in grid                                                                                   |
| Meta+Shift+Home          | Move window to start                                                                                                           |
| Meta+Shift+End           | Move window to end                                                                                                             |
| Meta+X                   | Toggle stacked layout for focused column (Only the active window visible)                                                      |
| Meta+Ctrl+Shift+A        | Move column left                                                                                                               |
| Meta+Ctrl+Shift+D        | Move column right                                                                                                              |
| Meta+Ctrl+Shift+Home     | Move column to start                                                                                                           |
| Meta+Ctrl+Shift+End      | Move column to end                                                                                                             |
| Meta+Ctrl++              | Increase column width                                                                                                          |
| Meta+Ctrl+-              | Decrease column width                                                                                                          |
| Meta+R                   | Cycle through preset column widths                                                                                             |
| Meta+Shift+R             | Cycle through preset column widths in reverse                                                                                  |
| Meta+Ctrl+X              | Equalize widths of visible columns                                                                                             |
| Meta+Ctrl+A              | Squeeze left column onto the screen (Clashes with default KDE shortcuts, may require manual remapping)                         |
| Meta+Ctrl+D              | Squeeze right column onto the screen                                                                                           |
| Meta+Alt+Return          | Center focused window (Scrolls so that the focused window is centered in the screen)                                           |
| Meta+Alt+A               | Scroll one column to the left                                                                                                  |
| Meta+Alt+D               | Scroll one column to the right                                                                                                 |
| Meta+Alt+PgUp            | Scroll left                                                                                                                    |
| Meta+Alt+PgDown          | Scroll right                                                                                                                   |
| Meta+Alt+Home            | Scroll to start                                                                                                                |
| Meta+Alt+End             | Scroll to end                                                                                                                  |
| Meta+Ctrl+Return         | Move Karousel grid to the current screen                                                                                       |
| Meta+[N]                 | Move focus to column N (Clashes with default KDE shortcuts, may require manual remapping)                                      |
| Meta+Shift+[N]           | Move window to column N (Requires manual remapping according to your keyboard layout, e.g. Meta+Shift+1 -> Meta+!)             |
| Meta+Ctrl+Shift+[N]      | Move column to position N (Requires manual remapping according to your keyboard layout, e.g. Meta+Ctrl+Shift+1 -> Meta+Ctrl+!) |
| Meta+Ctrl+Shift+F[N]     | Move column to desktop N                                                                                                       |
| Meta+Ctrl+Shift+Alt+F[N] | Move this and all following columns to desktop N                                                                               |
