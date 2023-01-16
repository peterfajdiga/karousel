function initTimer() {
    return Qt.createQmlObject(
        `import QtQuick 2.15
        Timer {}`,
        qmlBase
    );
}
