# -*- mode: python ; coding: utf-8 -*-

import os
import sys
from PyInstaller.utils.hooks import collect_all

block_cipher = None

# Get all FastAPI related modules
fastapi_modules = collect_all('fastapi')
uvicorn_modules = collect_all('uvicorn')
sqlalchemy_modules = collect_all('sqlalchemy')

# Combine all hidden imports and datas
hidden_imports = []
hidden_imports.extend(fastapi_modules[1])
hidden_imports.extend(uvicorn_modules[1])
hidden_imports.extend(sqlalchemy_modules[1])

# Add additional hidden imports for common libraries
hidden_imports.extend([
    'app.config.settings',
    'app.database',
    'app.models.base',
    'app.models.bot',
    'app.models.room',
    'app.models.user',
    'app.routes.auth',
    'app.routes.rooms',
    'app.routes.bots',
    'app.routes.ai',
    'pydantic_settings',
    'aiosqlite',
    'uvicorn.loops',
    'uvicorn.loops.auto',
    'uvicorn.loops.uvloop',
    'uvicorn.loops.asyncio',
    'uvicorn.protocols.http',
    'uvicorn.protocols.http.auto',
    'uvicorn.protocols.http.h11_impl',
    'uvicorn.protocols.http.httptools_impl',
    'uvicorn.protocols.websockets',
    'uvicorn.protocols.websockets.auto',
    'uvicorn.protocols.websockets.wsproto_impl',
    'uvicorn.lifespan',
    'uvicorn.lifespan.on',
    'websockets',
    'websockets.client',
    'websockets.server',
    'websockets.exceptions',
    'websockets.protocol',
    'websockets.legacy',
    'websockets.legacy.client',
    'websockets.legacy.server',
    'websockets.legacy.protocol',
    'websockets.legacy.exceptions',
    'websockets.legacy.auth',
    'websockets.legacy.framing',
    'websockets.legacy.handshake',
    'websockets.legacy.http',
    'websockets.extensions',
    'websockets.extensions.permessage_deflate',
    'websockets.datastructures',
    'websockets.typing',
    'websockets.uri',
    'websockets.headers',
    'websockets.version',
    'websockets.utils',
    'websockets.connection',
    'websockets.http',
    'websockets.framing',
    'websockets.handshake',
    'websockets.auth',
    'psycopg2',
    'psycopg2.pool',
    'psycopg2.extras',
    'psycopg2.extensions',
    'psycopg2._psycopg',
    'alembic',
    'alembic.context',
    'alembic.runtime',
    'alembic.migration',
    'alembic.command',
    'alembic.operations',
    'alembic.operations.ops',
    'alembic.util',
    'alembic.util.exc',
    'alembic.util.messaging',
    'alembic.version',
    'alembic.config',
    'alembic.environment',
    'alembic.script',
    'alembic.script.base',
    'alembic.script.revision',
    'alembic.ddl',
    'alembic.ddl.base',
    'alembic.ddl.postgresql',
    'alembic.ddl.mysql',
    'alembic.ddl.sqlite',
    'alembic.autogenerate',
    'alembic.autogenerate.compare',
    'alembic.autogenerate.render',
    'alembic.testing',
    'alembic.testing.fixtures',
    'alembic.testing.assertions',
    'redis',
    'redis.client',
    'redis.connection',
    'redis.exceptions',
    'redis.utils',
    'redis.commands',
    'redis.commands.core',
    'redis.commands.cluster',
    'redis.commands.sentinel',
    'redis.commands.connection',
    'redis.commands.server',
    'redis.commands.pubsub',
    'redis.commands.scripting',
    'redis.commands.json',
    'redis.commands.search',
    'redis.commands.timeseries',
    'redis.commands.bf',
    'redis.commands.graph',
    'redis.commands.ft',
    'redis.commands.tdigest',
    'redis.commands.cuckoo',
    'redis.commands.cms',
    'redis.commands.topk',
    'redis.sentinel',
    'redis.asyncio',
    'redis.asyncio.client',
    'redis.asyncio.connection',
    'redis.asyncio.commands',
    'redis.asyncio.sentinel',
    'redis.asyncio.utils',
    'redis.asyncio.exceptions',
    'openai',
    'openai.api_resources',
    'openai.api_resources.abstract',
    'openai.api_resources.abstract.engine_api_resource',
    'openai.api_resources.abstract.listable_api_resource',
    'openai.api_resources.abstract.deprecated_engine_api_resource',
    'openai.api_resources.audio',
    'openai.api_resources.chat_completion',
    'openai.api_resources.completion',
    'openai.api_resources.customer',
    'openai.api_resources.edit',
    'openai.api_resources.embedding',
    'openai.api_resources.engine',
    'openai.api_resources.error_object',
    'openai.api_resources.file',
    'openai.api_resources.fine_tune',
    'openai.api_resources.image',
    'openai.api_resources.model',
    'openai.api_resources.moderation',
    'openai.util',
    'openai.version',
    'anthropic',
    'anthropic.api',
    'anthropic.api.api',
    'anthropic.api.error',
    'anthropic.api.resource',
    'anthropic.api.resources',
    'anthropic.api.resources.completion',
    'anthropic.api.resources.message',
    'anthropic.api.resources.model',
    'anthropic.api.resources.usage',
    'anthropic.api.resources.rate_limit',
    'anthropic.client',
    'anthropic.version',
    'httpx',
    'httpx._api',
    'httpx._auth',
    'httpx._client',
    'httpx._config',
    'httpx._content',
    'httpx._exceptions',
    'httpx._models',
    'httpx._status_codes',
    'httpx._transports',
    'httpx._transports.base',
    'httpx._transports.default',
    'httpx._transports.urllib3',
    'httpx._transports.wsgi',
    'httpx._types',
    'httpx._url',
    'httpx._utils',
    'httpx._version',
])

# Data files to include
datas = []
datas.extend(fastapi_modules[0])
datas.extend(uvicorn_modules[0])
datas.extend(sqlalchemy_modules[0])

# Add any additional data files (like templates, static files, etc.)
additional_datas = [
    ('app', 'app'),
    ('config', 'config'),
    ('tests', 'tests'),
]

datas.extend(additional_datas)

a = Analysis(
    ['app/main.py'],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=hidden_imports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='VibeChat-AI-Service',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,  # Keep console=True for FastAPI apps
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='VibeChat-AI-Service-New',
)

# Clean up any existing dist directory before building
import shutil
import os
dist_dir = os.path.join(os.path.dirname(a.scripts[0][1]), 'dist', 'VibeChat-AI-Service-New')
if os.path.exists(dist_dir):
    shutil.rmtree(dist_dir)
