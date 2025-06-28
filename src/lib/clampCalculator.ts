export interface ClampCalculatorInputs {
  minValue: number;
  maxValue: number;
  minViewport: number;
  maxViewport: number;
  unit: 'px' | 'rem';
}

export interface ClampCalculatorResult {
  clampValue: string;
  slope: number;
  yIntercept: number;
}

export function calculateClamp(inputs: ClampCalculatorInputs): ClampCalculatorResult {
  const { minValue, maxValue, minViewport, maxViewport, unit } = inputs;
  
  const toRem = (value: number) => +(value / 16)?.toFixed(3);
  
  // Convert input values to px if they're in rem
  const minValuePx = unit === 'rem' ? minValue * 16 : minValue;
  const maxValuePx = unit === 'rem' ? maxValue * 16 : maxValue;
  
  const variablePart = (maxValuePx - minValuePx) / (maxViewport - minViewport);
  const constant = parseFloat(((maxValuePx - maxViewport * variablePart) / 16).toFixed(3));
  
  const result = `clamp(${toRem(minValuePx)}rem,${constant ? ` ${constant}rem +` : ""} ${parseFloat((100 * variablePart).toFixed(2))}vw, ${toRem(maxValuePx)}rem)`;
  
  return {
    clampValue: result,
    slope: variablePart,
    yIntercept: constant
  };
}