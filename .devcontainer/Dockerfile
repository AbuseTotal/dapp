FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-22.04

# Core
RUN apt-get update \
  && apt-get install -y build-essential git dnsutils net-tools iputils-ping netcat libcurl4-openssl-dev libssl-dev

# Backend
# RUN apt-get install -y python3 python3-pip python3-dev python3-venv python-is-python3
# RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=/home/vscode/.poetry python -
# RUN cp /home/vscode/.poetry/bin/poetry /usr/local/bin/
# RUN mkdir -p /home/vscode/.config/pypoetry && echo "[virtualenvs]\nin-project = true" > /home/vscode/.config/pypoetry/config.toml
# ENV PATH="abusetotal/backend/.venv/bin:$PATH"
# RUN pip install invoke

# RUN curl -1sLf 'https://dl.cloudsmith.io/public/evilmartians/lefthook/setup.deb.sh' | sudo -E bash \
#   && sudo apt install lefthook

RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
  && apt-get install -y nodejs \
  && corepack enable

# Wrap up
RUN chown -R vscode.vscode /home/vscode