import QtQuick 2.15
import org.kde.kwin 3.0
import "./main.js" as Basalt

Item {
    id: qmlBase

    property var basaltInstance

    Component.onCompleted: {
        qmlBase.basaltInstance = Basalt.init();
        print("script started");
    }

    Component.onDestruction: {
        qmlBase.basaltInstance.destroy();
        print("script stopped");
    }
}
