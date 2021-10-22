class PermissionException(Exception):
    def __init__(self, action: str):
        self.detail = f"User does not permission to {action}"


class ResourceNotFound(Exception):
    def __init__(self, resource: str, search_params: dict = None):
        self.resource = resource
        self.search_params = search_params or {}