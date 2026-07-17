import QtQuick 6.0
import org.kde.kwin 3.0
import org.kde.notification 1.0
import "../code/main.js" as Karousel

Item {
    id: qmlBase

    property var karouselInstance
    Component.onCompleted: {
        qmlBase.karouselInstance = Karousel.init();
    }

    Component.onDestruction: {
        qmlBase.karouselInstance.destroy();
    }

    Notification {
        id: notificationInvalidTiledDesktops
        componentName: "plasma_workspace"
        eventId: "notification"
        title: "Karousel"
        text: "Your Tiled Desktops regex is malformed, please review your Karousel configuration"
        flags: Notification.Persistent
        urgency: Notification.HighUrgency
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

    Notification {
        id: notificationInvalidPresetWidths
        componentName: "plasma_workspace"
        eventId: "notification"
        title: "Karousel"
        text: "Your preset widths are malformed, please review your Karousel configuration"
        flags: Notification.Persistent
        urgency: Notification.HighUrgency
    }

    SwipeGestureHandler {
        direction: SwipeGestureHandler.Direction.Left
        fingerCount: 3
        onActivated: qmlBase.karouselInstance.gestureScrollFinish()
        onCancelled: qmlBase.karouselInstance.gestureScrollFinish()
        onProgressChanged: qmlBase.karouselInstance.gestureScroll(-progress)
    }

    SwipeGestureHandler {
        direction: SwipeGestureHandler.Direction.Right
        fingerCount: 3
        onActivated: qmlBase.karouselInstance.gestureScrollFinish()
        onCancelled: qmlBase.karouselInstance.gestureScrollFinish()
        onProgressChanged: qmlBase.karouselInstance.gestureScroll(progress)
    }

    ScreenEdgeHandler {
        edge: ScreenEdgeHandler.LeftEdge
        enabled: qmlBase.karouselInstance !== undefined && qmlBase.karouselInstance.screenEdgeScrollColumns
        onActivated: screenEdgeScrollLeftDelay.restart()
    }

    ScreenEdgeHandler {
        edge: ScreenEdgeHandler.RightEdge
        enabled: qmlBase.karouselInstance !== undefined && qmlBase.karouselInstance.screenEdgeScrollColumns
        onActivated: screenEdgeScrollRightDelay.restart()
    }

    Timer {
        id: screenEdgeScrollLeftDelay
        interval: qmlBase.karouselInstance !== undefined ? qmlBase.karouselInstance.screenEdgeScrollDelay : 200
        repeat: true
        onTriggered: {
            if (!qmlBase.karouselInstance.triggerScreenEdgeLeftIfCursorStillAtEdge()) {
                stop()
            }
        }
    }

    Timer {
        id: screenEdgeScrollRightDelay
        interval: qmlBase.karouselInstance !== undefined ? qmlBase.karouselInstance.screenEdgeScrollDelay : 200
        repeat: true
        onTriggered: {
            if (!qmlBase.karouselInstance.triggerScreenEdgeRightIfCursorStillAtEdge()) {
                stop()
            }
        }
    }

    DBusCall {
        id: moveCursorToFocus

        service: "org.kde.kglobalaccel"
        path: "/component/kwin"
        method: "invokeShortcut"
        arguments: ["MoveMouseToFocus"]
    }

}
