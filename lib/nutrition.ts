/**
 * Calorie and macro estimate.
 *   BMR   Mifflin-St Jeor: 10 x kg + 6.25 x cm - 5 x age + 5 (male) or - 161 (female)
 *   TDEE  BMR x activity factor
 *   Goal  lose: 20% deficit clamped to 300..600 kcal; build: 10% surplus clamped to 150..350 kcal
 *   Floor never below 1,500 kcal (male) or 1,200 kcal (female)
 *   Macros protein by g/kg of body weight, fat 25% of calories (at least 0.6 g/kg), carbs the rest
 */

export type Sex = "male" | "female";
export type Goal = "lose" | "build" | "maintain";

export type NutritionInput = {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activityFactor: number;
  goal: Goal;
};

export type NutritionResult = {
  bmr: number;
  maintenance: number;
  target: number;
  /** True when the goal adjustment would have gone under the safe floor. */
  floored: boolean;
  protein: number;
  carbs: number;
  fat: number;
};

export const FLOOR: Record<Sex, number> = { male: 1500, female: 1200 };
const DEFICIT = { share: 0.2, min: 300, max: 600 };
const SURPLUS = { share: 0.1, min: 150, max: 350 };
const PROTEIN_PER_KG: Record<Goal, number> = { lose: 2.0, build: 1.8, maintain: 1.6 };
const PROTEIN_CAP_G = 220;
const FAT_SHARE = 0.25;
const FAT_MIN_PER_KG = 0.6;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round = (n: number, to = 1) => Math.round(n / to) * to;

export function bmr({ sex, age, heightCm, weightKg }: Pick<NutritionInput, "sex" | "age" | "heightCm" | "weightKg">) {
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
}

export function estimate(input: NutritionInput): NutritionResult {
  const base = bmr(input);
  const maintenance = base * input.activityFactor;

  let target = maintenance;
  if (input.goal === "lose") target = maintenance - clamp(maintenance * DEFICIT.share, DEFICIT.min, DEFICIT.max);
  if (input.goal === "build") target = maintenance + clamp(maintenance * SURPLUS.share, SURPLUS.min, SURPLUS.max);

  const floor = FLOOR[input.sex];
  const floored = target < floor;
  target = round(Math.max(target, floor), 10);

  const protein = round(Math.min(input.weightKg * PROTEIN_PER_KG[input.goal], PROTEIN_CAP_G));
  const fat = round(Math.max((target * FAT_SHARE) / 9, input.weightKg * FAT_MIN_PER_KG));
  const carbs = round(Math.max(0, (target - protein * 4 - fat * 9) / 4));

  return { bmr: round(base), maintenance: round(maintenance, 10), target, floored, protein, carbs, fat };
}
