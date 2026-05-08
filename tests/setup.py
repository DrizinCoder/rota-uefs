from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path
from setuptools import setup
from setuptools.command.develop import develop as _develop
from setuptools.command.install import install as _install

ROOT = Path(__file__).resolve().parent
FRONTEND_DIR = ROOT.parent / "frontend"
TESTS_FRONTEND_DIR = ROOT / "tests-frontend"
NODEENV_DIR = ROOT / ".nodeenv"


def run(cmd: list[str], cwd: Path | None = None, env: dict[str, str] | None = None) -> None:
    print("$", " ".join(cmd))
    subprocess.run(cmd, cwd=cwd, env=env, check=True)


def ensure_nodeenv() -> None:
    if NODEENV_DIR.exists():
        print(f"Nodeenv já existe em: {NODEENV_DIR}")
        return

    print("Criando ambiente Node local com nodeenv...")
    run([sys.executable, "-m", "nodeenv", "--prebuilt", "--npm", str(NODEENV_DIR)])


def npm_path() -> str:
    if sys.platform == "win32":
        return str(NODEENV_DIR / "Scripts" / "npm.cmd")
    return str(NODEENV_DIR / "bin" / "npm")


def npx_path() -> str:
    if sys.platform == "win32":
        return str(NODEENV_DIR / "Scripts" / "npx.cmd")
    return str(NODEENV_DIR / "bin" / "npx")


def install_frontend_dependencies() -> None:
    env = os.environ.copy()
    env["PATH"] = str(NODEENV_DIR / ("Scripts" if sys.platform == "win32" else "bin")) + os.pathsep + env.get("PATH", "")

    print("Instalando dependências do frontend...")
    run([npm_path(), "install"], cwd=FRONTEND_DIR, env=env)

    print("Instalando dependências dos testes frontend...")
    run([npm_path(), "install"], cwd=TESTS_FRONTEND_DIR, env=env)

    print("Instalando navegadores Playwright...")
    run([npx_path(), "playwright", "install", "--with-deps"], cwd=TESTS_FRONTEND_DIR, env=env)


def run_frontend_setup() -> None:
    ensure_nodeenv()
    install_frontend_dependencies()
    print("Configuração de testes frontend concluída.")


class InstallCommand(_install):
    def run(self):
        super().run()
        run_frontend_setup()


class DevelopCommand(_develop):
    def run(self):
        super().run()
        run_frontend_setup()


setup(
    name="rota-uefs-tests-setup",
    version="0.0.1",
    install_requires=["nodeenv==1.12.0"],
    packages=[],
    cmdclass={
        "install": InstallCommand,
        "develop": DevelopCommand,
    },
)
