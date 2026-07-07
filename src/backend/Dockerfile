# ── Build stage ─────────────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /build

COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ── Production stage ────────────────────────────────────────────
FROM python:3.12-slim

# Security: run as a non-root user
RUN addgroup --system app && adduser --system --ingroup app app

# Copy installed packages from the builder
COPY --from=builder /install /usr/local

WORKDIR /app
COPY . .

# Own everything by the app user
RUN chown -R app:app /app
USER app

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "wsgi:app"]
