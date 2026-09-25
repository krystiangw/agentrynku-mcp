#!/usr/bin/env bash
# Adds the hosted Agent Rynku MCP server to Claude Code.
claude mcp add --transport http agentrynku https://agentrynku.pl/api/mcp \
  --header "Authorization: Bearer ${AGENTRYNKU_API_KEY:?set AGENTRYNKU_API_KEY}"
