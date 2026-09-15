#!/usr/bin/env bash
#
# Builds the site and mirrors dist/ onto the Hostinger webroot over SSH.
#
#   ./scripts/deploy.sh          # shows what would change, then asks
#   ./scripts/deploy.sh --yes    # no prompt (for CI)
#
# Connection details come from .env.deploy, which is gitignored. Copy
# .env.deploy.example and fill it in.
#
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env.deploy ]]; then
  echo "Missing .env.deploy — copy .env.deploy.example and fill it in." >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
source ./.env.deploy
set +a

: "${DEPLOY_HOST:?DEPLOY_HOST is not set}"
: "${DEPLOY_PORT:?DEPLOY_PORT is not set}"
: "${DEPLOY_USER:?DEPLOY_USER is not set}"
: "${DEPLOY_PATH:?DEPLOY_PATH is not set}"

# rsync --delete mirrors, so a wrong DEPLOY_PATH would empty a directory
# that is not the webroot. Refuse anything that is obviously not one.
case "$DEPLOY_PATH" in
  */ ) ;;
  * ) echo "DEPLOY_PATH must end in a slash, so rsync writes into it." >&2; exit 1 ;;
esac
if [[ "$DEPLOY_PATH" == "/" || "$DEPLOY_PATH" == "$HOME/" || ${#DEPLOY_PATH} -lt 12 ]]; then
  echo "DEPLOY_PATH ($DEPLOY_PATH) does not look like a webroot. Refusing." >&2
  exit 1
fi

REMOTE="${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
SSH="ssh -p ${DEPLOY_PORT}"

echo "==> Building"
npm run build

echo
echo "==> Dry run against ${REMOTE}"
rsync -az --delete --itemize-changes --dry-run -e "$SSH" dist/ "$REMOTE"

if [[ "${1:-}" != "--yes" ]]; then
  echo
  read -r -p "Apply the changes above? [y/N] " reply
  [[ "$reply" == "y" || "$reply" == "Y" ]] || { echo "Aborted."; exit 0; }
fi

echo
echo "==> Uploading"
rsync -az --delete --human-readable --progress -e "$SSH" dist/ "$REMOTE"

echo
echo "==> Done. Deployed $(git rev-parse --short HEAD) to ${DEPLOY_PATH}"
