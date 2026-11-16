"use client";

import { useEffect, useMemo, useState } from "react";
import { LazyMotion, MotionConfig, domAnimation, m, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { calculator, whatsappLink } from "@/lib/content";
import { estimate, FLOOR, type Goal, type NutritionResult, type Sex } from "@/lib/nutrition";

type Field = "age" | "height" | "weight";
const UNITS: Record<Field, string> = { age: "years", height: "cm", weight: "kg" };
const LABELS: Record<Field, string> = { age: "Age", height: "Height", weight: "Weight" };
const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

function fieldError(name: Field, raw: string) {
  if (raw.trim() === "") return "Required.";
  const n = Number(raw);
  const [lo, hi] = calculator.limits[name];
  if (!Number.isFinite(n) || n < lo || n > hi) return `Enter ${lo} to ${hi} ${UNITS[name]}.`;
  return null;
}

/** A number that springs to its new value (instant under reduced motion). */
function Tween({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const spring = useSpring(value, { stiffness: 140, damping: 26 });
  const text = useTransform(spring, fmt);
  useEffect(() => {
    if (reduced) spring.jump(value);
    else spring.set(value);
  }, [value, reduced, spring]);
  return <m.span>{text}</m.span>;
}

export function Calculator() {
  const reduced = useReducedMotion();
  const [sex, setSex] = useState<Sex | "">("");
  const [values, setValues] = useState<Record<Field, string>>({ age: "", height: "", weight: "" });
  const [touched, setTouched] = useState<Record<Field, boolean>>({ age: false, height: false, weight: false });
  const [activity, setActivity] = useState(calculator.activity[2].id);
  const [goal, setGoal] = useState<Goal | "">("");

  const errors = useMemo(
    () => Object.fromEntries((Object.keys(values) as Field[]).map((k) => [k, fieldError(k, values[k])])) as Record<Field, string | null>,
    [values],
  );

  const result: NutritionResult | null = useMemo(() => {
    if (!sex || !goal || errors.age || errors.height || errors.weight) return null;
    const factor = calculator.activity.find((a) => a.id === activity)!.factor;
    return estimate({ sex, goal, age: Number(values.age), heightCm: Number(values.height), weightKg: Number(values.weight), activityFactor: factor });
  }, [sex, goal, activity, values, errors]);

  // Screen-reader summary, announced once the numbers settle.
  const [announce, setAnnounce] = useState("");
  useEffect(() => {
    const t = setTimeout(() => {
      setAnnounce(
        result
          ? `Estimated target ${fmt(result.target)} kilocalories a day: protein ${result.protein} grams, carbs ${result.carbs} grams, fat ${result.fat} grams.${result.floored ? " Raised to the minimum estimate." : ""}`
          : "",
      );
    }, 700);
    return () => clearTimeout(t);
  }, [result]);

  const activityLabel = calculator.activity.find((a) => a.id === activity)!.label;
  const goalLabel = calculator.goals.find((g) => g.id === goal)?.label ?? "";
  const message = result
    ? `Hi FitPro, I used the calculator on your site.\n${sex === "male" ? "Male" : "Female"}, ${values.age} years, ${values.height} cm, ${values.weight} kg. Activity: ${activityLabel.toLowerCase()}.\nGoal: ${goalLabel.toLowerCase()}.\nTarget: about ${fmt(result.target)} kcal a day (protein ${result.protein} g, carbs ${result.carbs} g, fat ${result.fat} g).\nI'd like a coach to build this plan with me.`
    : "";

  // Ring: target as a share of 1.2x maintenance, so every goal leaves visible headroom.
  const ring = result ? Math.min(1, result.target / (result.maintenance * 1.2)) : 0;
  const macros = result
    ? [
        { key: "Protein", g: result.protein, kcal: result.protein * 4 },
        { key: "Carbs", g: result.carbs, kcal: result.carbs * 4 },
        { key: "Fat", g: result.fat, kcal: result.fat * 9 },
      ]
    : [
        { key: "Protein", g: 0, kcal: 0 },
        { key: "Carbs", g: 0, kcal: 0 },
        { key: "Fat", g: 0, kcal: 0 },
      ];
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 120, damping: 22 };

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <section className="section theme-bone calc" id="calculator" aria-labelledby="calc-title">
          <div className="container">
            <div className="section__head">
              <h2 id="calc-title" className="display h-section">
                {calculator.heading}
              </h2>
              <p className="lead">{calculator.lede}</p>
            </div>

            <div className="calc__grid">
              <form className="form calc__form" noValidate onSubmit={(e) => e.preventDefault()}>
                <fieldset className="seg">
                  <legend>Sex</legend>
                  {(["female", "male"] as Sex[]).map((s) => (
                    <span key={s}>
                      <input type="radio" name="sex" id={`sex-${s}`} value={s} checked={sex === s} onChange={() => setSex(s)} />
                      <label htmlFor={`sex-${s}`}>{s === "female" ? "Female" : "Male"}</label>
                    </span>
                  ))}
                </fieldset>

                <div className="calc__numbers">
                  {(Object.keys(values) as Field[]).map((k) => {
                    const show = touched[k] && errors[k];
                    return (
                      <div className="field" key={k}>
                        <label htmlFor={`calc-${k}`}>
                          {LABELS[k]} <span className="calc__unit">({UNITS[k]})</span>
                        </label>
                        <input
                          id={`calc-${k}`}
                          name={k}
                          type="number"
                          inputMode={k === "weight" ? "decimal" : "numeric"}
                          min={calculator.limits[k][0]}
                          max={calculator.limits[k][1]}
                          step={k === "weight" ? 0.1 : 1}
                          value={values[k]}
                          aria-invalid={show ? true : undefined}
                          aria-describedby={`calc-${k}-help`}
                          onChange={(e) => setValues((v) => ({ ...v, [k]: e.target.value }))}
                          onBlur={() => setTouched((t) => ({ ...t, [k]: true }))}
                        />
                        <p className="field__help" id={`calc-${k}-help`} data-error={!!show}>
                          {show ? errors[k] : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="field">
                  <label htmlFor="calc-activity">Activity level</label>
                  <select id="calc-activity" value={activity} onChange={(e) => setActivity(e.target.value)}>
                    {calculator.activity.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>

                <fieldset className="seg">
                  <legend>Goal</legend>
                  {calculator.goals.map((g) => (
                    <span key={g.id}>
                      <input type="radio" name="goal" id={`goal-${g.id}`} value={g.id} checked={goal === g.id} onChange={() => setGoal(g.id as Goal)} />
                      <label htmlFor={`goal-${g.id}`}>{g.label}</label>
                    </span>
                  ))}
                </fieldset>
              </form>

              <div className="calc__result" aria-labelledby="calc-result-title">
                <h3 id="calc-result-title" className="visually-hidden">
                  Your daily estimate
                </h3>
                <div className="kcal-ring">
                  <svg viewBox="0 0 200 200" aria-hidden="true">
                    <circle className="kcal-ring__track" cx="100" cy="100" r="86" />
                    <m.circle
                      className="kcal-ring__fill"
                      cx="100"
                      cy="100"
                      r="86"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: ring }}
                      transition={spring}
                    />
                  </svg>
                  <p className="kcal-ring__value">
                    {result ? <Tween value={result.target} /> : <span>0</span>}
                    <span className="kcal-ring__unit">kcal a day</span>
                  </p>
                </div>

                {result ? (
                  <p className="small calc__maint">
                    Maintenance about {fmt(result.maintenance)} kcal.
                    {result.floored && ` Raised to the ${fmt(FLOOR[sex as Sex])} kcal minimum this calculator will suggest.`}
                  </p>
                ) : (
                  <p className="small calc__maint">Fill in all six fields to see your numbers.</p>
                )}

                <dl className="macros">
                  {macros.map((x) => (
                    <div key={x.key} className="macro">
                      <dt>{x.key}</dt>
                      <dd className="num">{result ? <Tween value={x.g} /> : "0"} g</dd>
                      <div className="macro__track" aria-hidden="true">
                        <m.div
                          className="macro__fill"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: result ? Math.min(1, x.kcal / result.target) : 0 }}
                          transition={spring}
                        />
                      </div>
                    </div>
                  ))}
                </dl>

                {result ? (
                  <a className="btn" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
                    <span className="btn__label">{calculator.cta}</span>
                    <span className="visually-hidden"> (opens WhatsApp)</span>
                  </a>
                ) : (
                  <button type="button" className="btn" disabled>
                    <span className="btn__label">{calculator.cta}</span>
                  </button>
                )}
                <p className="small calc__note">{calculator.note}</p>
                <p className="visually-hidden" aria-live="polite">
                  {announce}
                </p>
              </div>
            </div>
          </div>
        </section>
      </LazyMotion>
    </MotionConfig>
  );
}
