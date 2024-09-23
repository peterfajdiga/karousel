function initMocks() {
    const qtMock = new MockQt();
    const workspaceMock = new MockWorkspace();

    Qt = qtMock;
    Workspace = workspaceMock;

    return {qtMock, workspaceMock};
}
