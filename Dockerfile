# Image version must match @playwright/test in package.json so the bundled browsers line up.
FROM mcr.microsoft.com/playwright:v1.65.1-noble

WORKDIR /app
ENV CI=true

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Default: full suite. Override, e.g. `docker run --rm pw-framework npm run test:smoke`.
CMD ["npx", "playwright", "test"]
