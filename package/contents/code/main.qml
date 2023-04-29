import QtQuick 2.15
import org.kde.kwin 3.0
import "./main.js" as Karousel

Item {
    id: qmlBase

    property var karouselInstance

    Component.onCompleted: {
        qmlBase.karouselInstance = Karousel.init();
        print("script started");
    }

    Component.onDestruction: {
        qmlBase.karouselInstance.destroy();
        print("script stopped");
    }
}
