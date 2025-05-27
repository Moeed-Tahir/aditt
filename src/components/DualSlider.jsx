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

  // Custom label formatter
  const formatLabel = (val) => {
    if (val === max) return '65+';
    return val === min ? '13' : val;
  };

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
              <div className={cn(
                'absolute flex justify-center w-full',
                labelPosition === 'top' ? '-top-8' : 'top-[30px]',
                'transform -translate-x-1/2 left-1/2'
              )}>
                  {formatLabel(val)}
              </div>
            )}
          </SliderPrimitive.Thumb>
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  );
});

DualRangeSlider.displayName = 'DualRangeSlider';

export { DualRangeSlider };