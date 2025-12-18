# Stage 1: Builder
# Pin to latest patched Node 24 Alpine image to address known CVEs
FROM node:24-alpine AS builder

# Install dependencies needed for building
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Set npm registry for Next.js build process (Yarn 4 compatibility)
ENV npm_config_registry=https://registry.npmjs.org/

# Enable corepack for Yarn v4
RUN corepack enable

# Copy package files (including .yarnrc.yml for Yarn 4)
COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies using Yarn 4 (immutable flag instead of frozen-lockfile)
RUN yarn install --immutable

# Copy source code (including .env.production if it exists)
COPY . .

RUN yarn -v

# Next.js automatically reads .env.production during build
# No need to manually export - Next.js will load it automatically
# Verify .env.production exists (optional check)
RUN if [ -f .env.production ]; then \
      echo "✓ .env.production found - Next.js will load it during build"; \
      echo "  Found $(grep -c '^NEXT_PUBLIC_' .env.production 2>/dev/null || echo 0) NEXT_PUBLIC_ variables"; \
    else \
      echo "::warning::.env.production not found - build may fail if env vars are required"; \
    fi

# Build the Next.js application
# Next.js automatically reads .env.production and embeds NEXT_PUBLIC_* variables into client-side code
RUN yarn build

# Stage 2: Runner
# Use the same patched base image for runtime
FROM node:24-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3001

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output from builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "server.js"]
