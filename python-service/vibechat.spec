# -*- mode: python ; coding: utf-8 -*-

import os
import sys

block_cipher = None

# Essential hidden imports for FastAPI and related libraries
hidden_imports = [
    'fastapi',
    'uvicorn',
    'uvicorn.loops',
    'uvicorn.loops.auto',
    'uvicorn.protocols.http',
    'uvicorn.protocols.http.auto',
    'uvicorn.protocols.websockets',
    'uvicorn.protocols.websockets.auto',
    'uvicorn.lifespan',
    'uvicorn.lifespan.on',
    'websockets',
    'websockets.client',
    'websockets.server',
    'websockets.protocol',
    'websockets.connection',
    'websockets.http',
    'websockets.framing',
    'websockets.handshake',
    'websockets.auth',
    'sqlalchemy',
    'sqlalchemy.orm',
    'sqlalchemy.ext',
    'sqlalchemy.ext.declarative',
    'alembic',
    'alembic.context',
    'alembic.command',
    'alembic.config',
    'alembic.runtime',
    'alembic.migration',
    'alembic.operations',
    'alembic.script',
    'alembic.version',
    'pydantic',
    'pydantic.v1',
    'pydantic_settings',
    'aiosqlite',
    'redis',
    'redis.client',
    'redis.connection',
    'redis.commands',
    'openai',
    'anthropic',
    'httpx',
    'httpx._client',
    'httpx._config',
    'httpx._content',
    'httpx._exceptions',
    'httpx._models',
    'httpx._status_codes',
    'httpx._transports',
    'httpx._types',
    'httpx._url',
    'httpx._utils',
    'psycopg2',
    'psycopg2.pool',
    'psycopg2.extras',
    'psycopg2.extensions',
]

# Data files to include
datas = [
    ('app', 'app'),
    ('config', 'config'),
    ('tests', 'tests'),
]

a = Analysis(
    ['app/main.py'],
    pathex=[],
    binaries=[],
    datas=datas,
    hiddenimports=hidden_imports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'tkinter',
        'matplotlib',
        'PIL',
        'cv2',
        'numpy',
        'pandas',
        'scipy',
        'torch',
        'torchvision',
        'PyQt5',
    ],
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
    console=True,
    disable_windowed_traceback=False,
    argv_emulation=False,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='VibeChat-AI-Service',
)
