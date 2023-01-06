#!/bin/bash

# source: https://unix.stackexchange.com/a/517690

set -e

bash_source_absolute="$(pwd)/${BASH_SOURCE[0]}"
basalt_dir="$(dirname "$bash_source_absolute")"
kwin_script_path="$basalt_dir/contents/code/main.js"

num=$(dbus-send --print-reply --dest=org.kde.KWin \
    /Scripting org.kde.kwin.Scripting.loadScript \
    string:"$kwin_script_path" | awk 'END {print $2}' )

dbus-send --print-reply --dest=org.kde.KWin /$num \
    org.kde.kwin.Script.run

echo 'Press any key to stop the script'
read

dbus-send --print-reply --dest=org.kde.KWin /$num \
    org.kde.kwin.Script.stop
