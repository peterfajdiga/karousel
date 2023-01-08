import QtQuick 2.15
import org.kde.kwin 3.0
import "./main.js" as Basalt

Item {
    Component.onCompleted: {
        Basalt.init();
        print("script started");
    }

    Component.onDestruction: {
        Basalt.uninit();
        print("script stopped");
    }
}
