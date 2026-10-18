"""
Run the original Python Thyrosim port (numba/scipy stubbed out, pure numpy RK4) and print
TSH/FT4 samples, so they can be diffed against the TypeScript engine (scripts/compare-python.ts).

    python scripts/compare_python.py <path-to-thyrosim_model.py>
"""
import importlib.util
import json
import sys
import types

numba = types.ModuleType("numba")
numba.njit = lambda *a, **k: (lambda f: f)
sys.modules["numba"] = numba
scipy = types.ModuleType("scipy")
scipy_integrate = types.ModuleType("scipy.integrate")
scipy_integrate.solve_ivp = None
sys.modules["scipy"] = scipy
sys.modules["scipy.integrate"] = scipy_integrate

spec = importlib.util.spec_from_file_location("thyrosim_model", sys.argv[1])
m = importlib.util.module_from_spec(spec)
sys.modules["thyrosim_model"] = m
spec.loader.exec_module(m)

dial2 = 0.88 * (1 - 0.78) / (0.12 * 0.78)
ic, p = m.initialize(1.68, 72.0, False, (0.12, dial2, 0.12, 0.88))
ic = m.run_fast(p, m.IC_DEFAULT.copy(), [], 24.0 * 30, 1, 0.1)[1][:, -1].copy()
doses = [m.DoseEvent(24.0 * d + 7.0, 100.0, 0.0) for d in range(20)]
t, q = m.run_fast(p, ic, doses, 24.0 * 20, 4, 0.1)
out = m.outputs(q, p)
print(json.dumps({"t": t[::8].tolist(), "TSH": out["TSH"][::8].tolist(), "FT4": out["FT4"][::8].tolist()}))
