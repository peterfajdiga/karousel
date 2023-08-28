import QtQuick 2.15
import org.kde.kwin 3.0
import org.kde.notification 1.0
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

    Notification {
        id: notificationInvalidWindowRules
        componentName: "plasma_workspace"
        eventId: "notification"
        title: "Karousel"
        text: "Your Window Rules JSON is malformed, please review your Karousel configuration"
        flags: Notification.Persistent
        urgency: Notification.HighUrgency
    }
}
