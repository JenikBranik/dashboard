"""Custom business exceptions.

These are raised in the Core layer and caught by the Server layer
to produce the appropriate HTTP responses.
"""


class AppException(Exception):
    """Base application exception with a human-readable message."""

    def __init__(self, message: str = "An unexpected error occurred.", status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class ValidationError(AppException):
    """Raised when input data fails validation."""

    def __init__(self, message: str = "Validation failed."):
        super().__init__(message, status_code=400)


class DuplicateEmailError(AppException):
    """Raised when a registration attempt uses an existing email."""

    def __init__(self, message: str = "Email is already registered."):
        super().__init__(message, status_code=409)


class InvalidCredentialsError(AppException):
    """Raised when login credentials do not match."""

    def __init__(self, message: str = "Invalid email or password."):
        super().__init__(message, status_code=401)


class NotFoundError(AppException):
    """Raised when a requested resource cannot be found."""

    def __init__(self, message: str = "Resource not found."):
        super().__init__(message, status_code=404)
