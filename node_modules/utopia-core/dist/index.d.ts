type UtopiaRelativeTo = 'viewport' | 'container' | 'viewport-width';
type UtopiaLabelStyle = 'utopia' | 'tailwind' | 'tshirt';
export type UtopiaTypeConfig = {
    minWidth: number;
    maxWidth: number;
    minFontSize: number;
    maxFontSize: number;
    minTypeScale: number;
    maxTypeScale: number;
    negativeSteps?: number;
    positiveSteps?: number;
    relativeTo?: UtopiaRelativeTo;
    labelStyle?: UtopiaLabelStyle;
};
export type UtopiaStep = {
    step: number;
    label: string;
    minFontSize: number;
    maxFontSize: number;
    wcagViolation?: {
        from: number;
        to: number;
    } | null;
    clamp: string;
};
export type UtopiaSpaceConfig = {
    minWidth: number;
    maxWidth: number;
    minSize: number;
    maxSize: number;
    negativeSteps?: number[];
    positiveSteps?: number[];
    customSizes?: string[];
    relativeTo?: UtopiaRelativeTo;
};
export type UtopiaSize = {
    label: string;
    minSize: number;
    maxSize: number;
    clamp: string;
    clampPx: string;
    multiplier: number;
};
export type UtopiaSpaceScale = {
    sizes: UtopiaSize[];
    oneUpPairs: UtopiaSize[];
    customPairs: UtopiaSize[];
};
export type UtopiaClampsConfig = {
    minWidth: number;
    maxWidth: number;
    pairs: [number, number][];
    relativeTo?: UtopiaRelativeTo;
};
export type UtopiaClampConfig = {
    minWidth: number;
    maxWidth: number;
    minSize: number;
    maxSize: number;
    usePx?: boolean;
    relativeTo?: UtopiaRelativeTo;
};
export type UtopiaClamp = {
    label: string;
    clamp: string;
};
export declare const calculateClamp: ({ maxSize, minSize, minWidth, maxWidth, usePx, relativeTo }: UtopiaClampConfig) => string;
/**
 * checkWCAG
 * Check if the clamp confirms to WCAG 1.4.4
 * Many thanks to Maxwell Barvian, creator of fluid.style for this calculation
 * @link https://barvian.me
 * @returns number[] | null
 */
export declare function checkWCAG({ min, max, minWidth, maxWidth }: {
    min: number;
    max: number;
    minWidth: number;
    maxWidth: number;
}): number[] | null;
export declare const calculateClamps: ({ minWidth, maxWidth, pairs, relativeTo }: UtopiaClampsConfig) => UtopiaClamp[];
export declare const calculateTypeScale: (config: UtopiaTypeConfig) => UtopiaStep[];
export declare const calculateSpaceScale: (config: UtopiaSpaceConfig) => UtopiaSpaceScale;
export {};
