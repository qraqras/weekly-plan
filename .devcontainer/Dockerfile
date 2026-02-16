FROM rust:1-trixie

# Install dependencies for Tauri development (must be done as root)
RUN apt update && apt install -y \
    git \
    libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# Set working directory
WORKDIR /workspace

# Install Node.js and pnpm using nvm
ENV NVM_DIR=/root/.nvm PATH=/root/.nvm/versions/node/v24.0.0/bin:$PATH
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash \
    && \. "$NVM_DIR/nvm.sh" \
    && nvm install 24 \
    && corepack enable pnpm

# Install Tauri CLI globally using Cargo
RUN cargo install tauri-cli
