"use client";
// beui.dev/components/motion/select

import { Check, ChevronDown } from "lucide-react";
import {
  motion,
  type Transition,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";

import { EASE_OUT } from "@/lib/ease";
import { haptic } from "@/lib/haptic";
import { cn } from "@/lib/utils";

const INSTANT_TRANSITION: Transition = { duration: 0 };

const CHEVRON_TRANSITION: Transition = {
  type: "spring",
  duration: 0.4,
  bounce: 0.3,
};

const LIST_VARIANTS: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
};
const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: -6, filter: "blur(3px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

type Placement = "bottom" | "top";

interface SelectContextValue {
  value: string | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
  select: (value: string) => void;
  register: (value: string, label: string) => void;
  unregister: (value: string) => void;
  labelFor: (value: string | undefined) => string | undefined;
  reduce: boolean;
  triggerId: string;
  listId: string;
  disabled: boolean;
  placement: Placement;
  setPlacement: (p: Placement) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext(component: string) {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error(`${component} must be used within <Select>`);
  return ctx;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * BeUI Select root — controlled or uncontrolled listbox with an animated panel.
 *
 * @param value - Controlled selected value.
 * @param onValueChange - Fires when an option is chosen.
 * @example
 * <Select value={city} onValueChange={setCity}>
 *   <SelectTrigger aria-label={label}><SelectValue /></SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="all">الكل</SelectItem>
 *   </SelectContent>
 * </Select>
 */
export function Select({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  className,
  children,
}: SelectProps) {
  const reduce = useReducedMotion() ?? false;
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const [labels, setLabels] = useState<Map<string, string>>(new Map());
  const [placement, setPlacement] = useState<Placement>("bottom");

  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const select = useCallback(
    (next: string) => {
      if (!controlled) setInternal(next);
      onValueChange?.(next);
      setOpen(false);
    },
    [controlled, onValueChange],
  );

  const register = useCallback((v: string, label: string) => {
    setLabels((m) => (m.get(v) === label ? m : new Map(m).set(v, label)));
  }, []);
  const unregister = useCallback((v: string) => {
    setLabels((m) => {
      if (!m.has(v)) return m;
      const next = new Map(m);
      next.delete(v);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    const listId = `${baseId}-list`;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (document.getElementById(listId)?.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open, baseId]);

  const ctx = useMemo<SelectContextValue>(() => {
    const labelFor = (v: string | undefined) =>
      v === undefined ? undefined : labels.get(v);
    return {
      value: current,
      open,
      setOpen,
      select,
      register,
      unregister,
      labelFor,
      reduce,
      triggerId: `${baseId}-trigger`,
      listId: `${baseId}-list`,
      disabled,
      placement,
      setPlacement,
    };
  }, [
    current,
    open,
    select,
    register,
    unregister,
    labels,
    reduce,
    baseId,
    disabled,
    placement,
  ]);

  return (
    <SelectContext.Provider value={ctx}>
      <div ref={rootRef} className={cn("relative", className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export type SelectTriggerProps = {
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

export function SelectTrigger({
  className,
  children,
  "aria-label": ariaLabel,
}: SelectTriggerProps) {
  const ctx = useSelectContext("SelectTrigger");
  const isTop = ctx.placement === "top";
  const kf = ctx.open ? [0, 0, 12] : [12, 0, 12];
  const kfT: Transition = ctx.reduce
    ? { duration: 0 }
    : ctx.open
      ? { duration: 0.6, times: [0, 0.4, 1], ease: EASE_OUT }
      : { duration: 0.42, times: [0, 0.5, 1], ease: EASE_OUT };
  return (
    <motion.button
      type="button"
      id={ctx.triggerId}
      disabled={ctx.disabled}
      aria-label={ariaLabel}
      aria-haspopup="listbox"
      aria-expanded={ctx.open}
      aria-controls={ctx.listId}
      onClick={() => {
        haptic();
        ctx.setOpen(!ctx.open);
      }}
      initial={false}
      animate={{
        borderTopLeftRadius: isTop ? kf : 12,
        borderTopRightRadius: isTop ? kf : 12,
        borderBottomLeftRadius: isTop ? 12 : kf,
        borderBottomRightRadius: isTop ? 12 : kf,
      }}
      transition={{
        borderTopLeftRadius: isTop ? kfT : INSTANT_TRANSITION,
        borderTopRightRadius: isTop ? kfT : INSTANT_TRANSITION,
        borderBottomLeftRadius: isTop ? INSTANT_TRANSITION : kfT,
        borderBottomRightRadius: isTop ? INSTANT_TRANSITION : kfT,
      }}
      className={cn(
        "relative z-10 flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors",
        "hover:border-border focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      {children}
      <motion.span
        aria-hidden
        animate={{ rotate: ctx.open ? 180 : 0 }}
        transition={ctx.reduce ? { duration: 0 } : CHEVRON_TRANSITION}
        className="text-muted-foreground"
      >
        <ChevronDown className="h-4 w-4" />
      </motion.span>
    </motion.button>
  );
}

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export function SelectValue({ placeholder, className }: SelectValueProps) {
  const ctx = useSelectContext("SelectValue");
  const label = ctx.labelFor(ctx.value);
  return (
    <span
      className={cn(
        "truncate",
        label ? "text-foreground" : "text-muted-foreground",
        className,
      )}
    >
      {label ?? placeholder ?? "Select"}
    </span>
  );
}

export interface SelectContentProps {
  className?: string;
  children: ReactNode;
}

type TriggerCoords = {
  left: number;
  width: number;
  top: number;
  bottom: number;
};

const subscribeNoop = () => () => {};
const getClientTrue = () => true;
const getServerFalse = () => false;

function sameCoords(a: TriggerCoords | null, b: TriggerCoords): boolean {
  return (
    a != null &&
    a.left === b.left &&
    a.width === b.width &&
    a.top === b.top &&
    a.bottom === b.bottom
  );
}

export function SelectContent({ className, children }: SelectContentProps) {
  const ctx = useSelectContext("SelectContent");
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [coords, setCoords] = useState<TriggerCoords | null>(null);
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getClientTrue,
    getServerFalse,
  );
  const open = ctx.open;
  const { setPlacement, triggerId, placement } = ctx;

  useLayoutEffect(() => {
    if (!mounted) return;
    const node = innerRef.current;
    if (!node) return;

    const measure = () => {
      const next = node.offsetHeight;
      setHeight((prev) => (prev === next ? prev : next));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [mounted, open]);

  useLayoutEffect(() => {
    if (!mounted) return;

    const syncPosition = () => {
      const trigger = document.getElementById(triggerId);
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const nextCoords: TriggerCoords = {
        left: rect.left,
        width: rect.width,
        top: rect.top,
        bottom: rect.bottom,
      };
      setCoords((prev) =>
        sameCoords(prev, nextCoords) ? prev : nextCoords,
      );

      const h = innerRef.current?.offsetHeight ?? 0;
      const below = window.innerHeight - rect.bottom;
      const above = rect.top;
      const next: Placement =
        below < h + 16 && above > below ? "top" : "bottom";
      if (next !== placement) setPlacement(next);
    };

    const frame = requestAnimationFrame(syncPosition);
    if (!open) {
      return () => cancelAnimationFrame(frame);
    }

    window.addEventListener("resize", syncPosition);
    window.addEventListener("scroll", syncPosition, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", syncPosition);
      window.removeEventListener("scroll", syncPosition, true);
    };
  }, [mounted, open, triggerId, setPlacement, placement, height]);

  const isTop = placement === "top";  const nearGap = open ? 8 : 0;
  const nearRadius = open ? 12 : 0;

  const gapT: Transition = open
    ? { type: "spring", duration: 0.6, bounce: 0.5, delay: 0.12 }
    : { type: "spring", duration: 0.3, bounce: 0.1 };
  const radiusT: Transition = open
    ? { duration: 0.3, ease: EASE_OUT, delay: 0.14 }
    : { duration: 0.16, ease: EASE_OUT };

  if (!mounted) return null;

  return createPortal(
    <motion.div
      id={ctx.listId}
      role="listbox"
      aria-labelledby={ctx.triggerId}
      aria-hidden={!open}
      inert={!open}
      initial={false}
      animate={
        ctx.reduce
          ? { opacity: open ? 1 : 0, height: open ? height : 0 }
          : {
              opacity: open ? 1 : 0,
              height: open ? height : 0,
              marginTop: isTop ? 0 : nearGap,
              marginBottom: isTop ? nearGap : 0,
              borderTopLeftRadius: isTop ? 12 : nearRadius,
              borderTopRightRadius: isTop ? 12 : nearRadius,
              borderBottomLeftRadius: isTop ? nearRadius : 12,
              borderBottomRightRadius: isTop ? nearRadius : 12,
            }
      }
      transition={
        ctx.reduce
          ? { duration: 0.12 }
          : {
              opacity: open
                ? { duration: 0.18 }
                : { duration: 0.16, delay: 0.12 },
              height: open
                ? { type: "spring", duration: 0.42, bounce: 0.14 }
                : { duration: 0.26, ease: EASE_OUT, delay: 0.14 },
              marginTop: isTop ? INSTANT_TRANSITION : gapT,
              marginBottom: isTop ? gapT : INSTANT_TRANSITION,
              borderTopLeftRadius: isTop ? INSTANT_TRANSITION : radiusT,
              borderTopRightRadius: isTop ? INSTANT_TRANSITION : radiusT,
              borderBottomLeftRadius: isTop ? radiusT : INSTANT_TRANSITION,
              borderBottomRightRadius: isTop ? radiusT : INSTANT_TRANSITION,
            }
      }
      style={{
        position: "fixed",
        left: coords?.left,
        width: coords?.width,
        minWidth: coords?.width,
        top: coords ? (isTop ? undefined : coords.bottom) : undefined,
        bottom: coords
          ? isTop
            ? window.innerHeight - coords.top
            : undefined
          : undefined,
        zIndex: 100,
        transformOrigin: isTop ? "bottom" : "top",
        overflow: "hidden",
        pointerEvents: open ? "auto" : "none",
        visibility: coords ? undefined : "hidden",
      }}
      className={cn(
        "z-100 rounded-xl border border-border bg-background shadow-lg",
        className,
      )}
    >
      <motion.div
        ref={innerRef}
        variants={ctx.reduce ? undefined : LIST_VARIANTS}
        initial={false}
        animate={open ? "show" : "hidden"}
        className="p-1"
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body,
  );
}

export interface SelectItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  /**
   * Trigger / accessible text when `children` are not a plain string
   * (e.g. flag + dial-code markup). Defaults to string children, else `value`.
   */
  label?: string;
}

export function SelectItem({
  value,
  disabled = false,
  className,
  children,
  label: labelProp,
}: SelectItemProps) {
  const ctx = useSelectContext("SelectItem");
  const selected = ctx.value === value;
  const label =
    labelProp ?? (typeof children === "string" ? children : value);

  useLayoutEffect(() => {
    ctx.register(value, label);
    return () => ctx.unregister(value);
    // register/unregister are stable; omit full ctx to avoid re-register churn
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional
  }, [ctx.register, ctx.unregister, value, label]);

  return (
    <motion.div variants={ctx.reduce ? undefined : ITEM_VARIANTS}>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        disabled={disabled}
        onClick={() => {
          haptic();
          ctx.select(value);
        }}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-start text-sm outline-none transition-colors",
          selected
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:bg-muted",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
      >
        {children}
        {selected ? <Check className="h-3.5 w-3.5 shrink-0" /> : null}
      </button>
    </motion.div>
  );
}
