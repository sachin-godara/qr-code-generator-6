#!/usr/bin/env python3
"""
Root Quality Gate Runner: Runs both Backend Pytest and Frontend Vitest suites.
Returns exit code 0 if all tests pass, or 1 if any fail.
"""
import subprocess
import sys
import os

def run_quality_gate():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")

    print("==================================================")
    print(" RUNNING QUALITY GATE: BACKEND & FRONTEND TEST SUITES")
    print("==================================================")

    # 1. Run Backend Pytest
    print("\n[1/2] Running Backend Pytest Suite...")
    pytest_bin = os.path.join(backend_dir, "venv", "Scripts", "pytest.exe")
    if not os.path.exists(pytest_bin):
        pytest_bin = "pytest"

    backend_res = subprocess.run([pytest_bin], cwd=backend_dir)
    if backend_res.returncode != 0:
        print("[FAIL] BACKEND PYTEST SUITE FAILED!")
        sys.exit(1)
    print("[PASS] BACKEND PYTEST SUITE PASSED!")

    # 2. Run Frontend Vitest
    print("\n[2/2] Running Frontend Vitest Suite...")
    frontend_res = subprocess.run(["npm", "test"], cwd=frontend_dir, shell=True)
    if frontend_res.returncode != 0:
        print("[FAIL] FRONTEND VITEST SUITE FAILED!")
        sys.exit(1)
    print("[PASS] FRONTEND VITEST SUITE PASSED!")

    print("\n==================================================")
    print(" [SUCCESS] ALL QUALITY GATES PASSED! READY TO COMMIT & DEPLOY.")
    print("==================================================")

if __name__ == "__main__":
    run_quality_gate()
