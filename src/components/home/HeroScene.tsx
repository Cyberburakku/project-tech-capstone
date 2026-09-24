import { useEffect, useRef, useState } from "react";
import { useShell } from "@/components/layout/ShellContext";
import { HERO_FRAGMENT, HERO_IMAGE, HERO_VERTEX, PAPER_RGB } from "@/components/home/heroShader";
import { cn } from "@/lib/utils";

/**
 * The painted Maine sunrise. Always renders the static <img> (the fallback and
 * the first paint); when WebGL is available a shader canvas fades in on top with
 * depth parallax, sea ripple, sun glitter, masked god rays, grain and a dusk grade
 * for dark mode. It pauses when offscreen, hidden, or when motion is paused.
 *
 * Fit: the painting spans the full width. A taller box gets extra sky on top;
 * a wider box crops the sky so the path stays in view.
 */
export function HeroScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, still } = useShell();
  const [ready, setReady] = useState(false);
  const live = useRef({ night: theme === "dark" ? 1 : 0, still, kick: () => {} });

  // Keep the render loop in sync with the theme / pause settings.
  useEffect(() => {
    live.current.still = still;
    live.current.kick();
  }, [still]);
  const nightTarget = theme === "dark" ? 1 : 0;
  const nightTargetRef = useRef(nightTarget);
  useEffect(() => {
    nightTargetRef.current = nightTarget;
    live.current.kick();
  }, [nightTarget]);

  useEffect(() => {
    const cv = canvasRef.current;
    const liveState = live.current;
    if (!cv) return;
    const gl = cv.getContext("webgl", { antialias: false, premultipliedAlpha: false, alpha: false });
    if (!gl) return; // static painting stays

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("[hero] shader:", gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, HERO_VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, HERO_FRAGMENT);
    if (!vs || !fs) return;
    const pr = gl.createProgram()!;
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
    gl.useProgram(pr);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const names = ["uImg", "uMap", "uRes", "uPtr", "uSun", "uTime", "uNight", "uAspect", "uHz", "uScroll", "uPaper", "uScaleY", "uBiasY"];
    const U = Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(pr, n)]));

    const texture = (img: HTMLImageElement, unit: number) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    };
    const load = (src: string) =>
      new Promise<HTMLImageElement>((res, rej) => {
        const i = new Image();
        i.onload = () => res(i);
        i.onerror = rej;
        i.src = src;
      });

    // Pointer / touch / tilt → smoothed −1..1
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      ptr.tx = (e.clientX / innerWidth) * 2 - 1;
      ptr.ty = (e.clientY / innerHeight) * 2 - 1;
      kick();
    };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      ptr.tx = Math.max(-1, Math.min(1, e.gamma / 25));
      ptr.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
      kick();
    };

    let raf = 0;
    let ready = false;
    let visible = true;
    let disposed = false;
    let shown = false;
    const t0 = performance.now();

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(cv.clientWidth * dpr);
      const h = Math.round(cv.clientHeight * dpr);
      if (w && h && (cv.width !== w || cv.height !== h)) {
        cv.width = w;
        cv.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!ready || disposed || !cv) return;
      const st = liveState.still;
      const t = st ? 8 : (now - t0) / 1000;
      ptr.x += (ptr.tx - ptr.x) * 0.06;
      ptr.y += (ptr.ty - ptr.y) * 0.06;
      const dx = st ? 0 : Math.sin(t * 0.33) * 0.45; // idle drift so the scene breathes
      const dy = st ? 0 : Math.cos(t * 0.27) * 0.3;
      const target = nightTargetRef.current;
      let n = liveState.night + (target - liveState.night) * (st ? 1 : 0.085);
      if (Math.abs(target - n) < 0.002) n = target;
      liveState.night = n;
      const paper = PAPER_RGB.light.map((v, i) => v + (PAPER_RGB.dark[i] - v) * n);

      const rect = cv.getBoundingClientRect();
      const scroll = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height)));
      size();
      const cw = cv.clientWidth || 1;
      const ch = cv.clientHeight || 1;
      const dispH = (cw * HERO_IMAGE.height) / HERO_IMAGE.width; // painting height at full width
      let scaleY: number;
      let biasY: number;
      if (dispH <= ch) {
        const off = (ch - dispH) / ch; // extra sky on top
        scaleY = 1 / (1 - off);
        biasY = -off / (1 - off);
      } else {
        const k = ch / dispH; // crop the sky, keep the path
        scaleY = k;
        biasY = 1 - k;
      }

      gl.uniform1i(U.uImg, 0);
      gl.uniform1i(U.uMap, 1);
      gl.uniform2f(U.uRes, cv.width, cv.height);
      gl.uniform2f(U.uPtr, (st ? 0 : ptr.x) + dx, (st ? 0 : ptr.y) * 0.6 + dy);
      gl.uniform2f(U.uSun, HERO_IMAGE.sun[0], HERO_IMAGE.sun[1]);
      gl.uniform1f(U.uTime, t);
      gl.uniform1f(U.uNight, n);
      gl.uniform1f(U.uAspect, HERO_IMAGE.width / HERO_IMAGE.height);
      gl.uniform1f(U.uHz, HERO_IMAGE.horizon);
      gl.uniform1f(U.uScroll, st ? 0 : scroll);
      gl.uniform3fv(U.uPaper, paper);
      gl.uniform1f(U.uScaleY, scaleY);
      gl.uniform1f(U.uBiasY, biasY);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        setReady(true);
      }

      const animating = !st || n !== target;
      if (animating && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(frame);
    };
    liveState.kick = kick;

    const io = new IntersectionObserver((es) => {
      visible = es[0].isIntersecting;
      kick();
    });
    io.observe(cv);
    const ro = new ResizeObserver(() => kick());
    ro.observe(cv);
    const onLost = (e: Event) => {
      e.preventDefault();
      disposed = true;
      setReady(false); // fall back to the static painting
    };
    cv.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", kick);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });

    Promise.all([load(HERO_IMAGE.src), load(HERO_IMAGE.depth)])
      .then(([img, map]) => {
        if (disposed) return;
        texture(img, 0);
        texture(map, 1);
        ready = true;
        kick();
      })
      .catch(() => {
        /* static painting stays */
      });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      cv.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", kick);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("deviceorientation", onTilt);
      liveState.kick = () => {};
    };
  }, []);

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <img
        src={HERO_IMAGE.src}
        alt=""
        width={900}
        height={1578}
        fetchPriority="high"
        className="absolute inset-x-0 bottom-0 h-auto w-full [mask-image:linear-gradient(to_bottom,transparent_0,#000_16%)] dark:[filter:brightness(.5)_saturate(.8)_hue-rotate(-10deg)]"
      />
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 size-full opacity-0 transition-opacity duration-700",
          ready && "opacity-100",
        )}
      />
    </div>
  );
}
