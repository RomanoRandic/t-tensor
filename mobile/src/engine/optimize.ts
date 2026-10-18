/** Ports of scipy.optimize's bounded Brent (`minimize_scalar(method="bounded")`) and Nelder-Mead. */

export interface ScalarResult {
  x: number;
  fun: number;
}

export function minimizeScalarBounded(
  f: (x: number) => number,
  lo: number,
  hi: number,
  xatol = 1e-5,
  maxfun = 500,
): ScalarResult {
  const sqrtEps = Math.sqrt(2.2e-16);
  const goldenMean = 0.5 * (3.0 - Math.sqrt(5.0));
  let a = lo;
  let b = hi;
  let fulc = a + goldenMean * (b - a);
  let nfc = fulc;
  let xf = fulc;
  let rat = 0;
  let e = 0;
  let x = xf;
  let fx = f(x);
  let num = 1;
  let ffulc = fx;
  let fnfc = fx;
  let xm = 0.5 * (a + b);
  let tol1 = sqrtEps * Math.abs(xf) + xatol / 3.0;
  let tol2 = 2.0 * tol1;

  while (Math.abs(xf - xm) > tol2 - 0.5 * (b - a)) {
    let golden = true;
    if (Math.abs(e) > tol1) {
      golden = false;
      let r = (xf - nfc) * (fx - ffulc);
      let q = (xf - fulc) * (fx - fnfc);
      let p = (xf - fulc) * q - (xf - nfc) * r;
      q = 2.0 * (q - r);
      if (q > 0) p = -p;
      q = Math.abs(q);
      r = e;
      e = rat;
      if (Math.abs(p) < Math.abs(0.5 * q * r) && p > q * (a - xf) && p < q * (b - xf)) {
        rat = p / q;
        x = xf + rat;
        if (x - a < tol2 || b - x < tol2) {
          const si = Math.sign(xm - xf) + (xm - xf === 0 ? 1 : 0);
          rat = tol1 * si;
        }
      } else {
        golden = true;
      }
    }
    if (golden) {
      e = xf >= xm ? a - xf : b - xf;
      rat = goldenMean * e;
    }
    const si = Math.sign(rat) + (rat === 0 ? 1 : 0);
    x = xf + si * Math.max(Math.abs(rat), tol1);
    const fu = f(x);
    num++;
    if (fu <= fx) {
      if (x >= xf) a = xf;
      else b = xf;
      fulc = nfc; ffulc = fnfc;
      nfc = xf; fnfc = fx;
      xf = x; fx = fu;
    } else {
      if (x < xf) a = x;
      else b = x;
      if (fu <= fnfc || nfc === xf) {
        fulc = nfc; ffulc = fnfc;
        nfc = x; fnfc = fu;
      } else if (fu <= ffulc || fulc === xf || fulc === nfc) {
        fulc = x; ffulc = fu;
      }
    }
    xm = 0.5 * (a + b);
    tol1 = sqrtEps * Math.abs(xf) + xatol / 3.0;
    tol2 = 2.0 * tol1;
    if (num >= maxfun) break;
  }
  return { x: xf, fun: fx };
}

export interface NelderMeadOptions {
  xatol: number;
  fatol: number;
  maxiter: number;
  initialSimplex: number[][];
}

export interface VectorResult {
  x: number[];
  fun: number;
}

export function nelderMead(f: (x: number[]) => number, opts: NelderMeadOptions): VectorResult {
  const rho = 1;
  const chi = 2;
  const psi = 0.5;
  const sigma = 0.5;
  const n = opts.initialSimplex[0].length;
  let sim = opts.initialSimplex.map((v) => [...v]);
  let fsim = sim.map((v) => f(v));

  const sortSimplex = () => {
    const order = fsim.map((_, i) => i).sort((i, j) => fsim[i] - fsim[j]);
    sim = order.map((i) => sim[i]);
    fsim = order.map((i) => fsim[i]);
  };
  const combine = (ca: number, va: number[], cb: number, vb: number[]) => va.map((x, i) => ca * x + cb * vb[i]);

  sortSimplex();
  let iterations = 1;
  while (iterations < opts.maxiter) {
    let xSpread = 0;
    let fSpread = 0;
    for (let j = 1; j <= n; j++) {
      for (let i = 0; i < n; i++) xSpread = Math.max(xSpread, Math.abs(sim[j][i] - sim[0][i]));
      fSpread = Math.max(fSpread, Math.abs(fsim[0] - fsim[j]));
    }
    if (xSpread <= opts.xatol && fSpread <= opts.fatol) break;

    const xbar = new Array<number>(n).fill(0);
    for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) xbar[i] += sim[j][i] / n;
    const worst = sim[n];

    const xr = combine(1 + rho, xbar, -rho, worst);
    const fxr = f(xr);
    let shrink = false;
    if (fxr < fsim[0]) {
      const xe = combine(1 + rho * chi, xbar, -rho * chi, worst);
      const fxe = f(xe);
      if (fxe < fxr) {
        sim[n] = xe; fsim[n] = fxe;
      } else {
        sim[n] = xr; fsim[n] = fxr;
      }
    } else if (fxr < fsim[n - 1]) {
      sim[n] = xr; fsim[n] = fxr;
    } else if (fxr < fsim[n]) {
      const xc = combine(1 + psi * rho, xbar, -psi * rho, worst);
      const fxc = f(xc);
      if (fxc <= fxr) {
        sim[n] = xc; fsim[n] = fxc;
      } else {
        shrink = true;
      }
    } else {
      const xcc = combine(1 - psi, xbar, psi, worst);
      const fxcc = f(xcc);
      if (fxcc < fsim[n]) {
        sim[n] = xcc; fsim[n] = fxcc;
      } else {
        shrink = true;
      }
    }
    if (shrink) {
      for (let j = 1; j <= n; j++) {
        sim[j] = combine(1 - sigma, sim[0], sigma, sim[j]);
        fsim[j] = f(sim[j]);
      }
    }
    iterations++;
    sortSimplex();
  }
  return { x: sim[0], fun: fsim[0] };
}
