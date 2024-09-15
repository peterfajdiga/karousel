function initMocks() {
    Qt = new MockQt();
    const workspaceMock = new MockWorkspace();
    Workspace = workspaceMock;
    return workspaceMock;
}
