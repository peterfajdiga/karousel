import QtQuick 2.15
import org.kde.kwin 3.0
import "./main.js" as Basalt

Item {
    id: base

    property var basaltInstance

    Component.onCompleted: {
        base.basaltInstance = Basalt.init();
        print("script started");
    }

    Component.onDestruction: {
        base.basaltInstance.destroy();
        print("script stopped");
    }
}
