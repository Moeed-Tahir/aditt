'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

const DualRangeSlider = React.forwardRef((props, ref) => {
  const {
    className,
    label,
    labelPosition = 'top',
    value,
    min = 0,
    max = 100,
    ...rest
  } = props;

  const initialValue = Array.isArray(value) ? value : [min, max];

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      value={value}
      min={min}
      max={max}
      {...rest}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-blue-600" />
      </SliderPrimitive.Track>

      {initialValue.map((val, index) => (
        <React.Fragment key={index}>
          <SliderPrimitive.Thumb className="relative block h-5 w-5 rounded-full border-2 border-blue-600 bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            {label && (
              <span
                className={cn(
                  'absolute flex w-full justify-center',
                  labelPosition === 'top' ? '-top-7' : 'top-4'
                )}
              >
                {label(val)}
              </span>
            )}
          </SliderPrimitive.Thumb>
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  );
});

DualRangeSlider.displayName = 'DualRangeSlider';

export { DualRangeSlider };
