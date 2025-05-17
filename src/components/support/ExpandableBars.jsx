"use client";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ExpandableBars() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full gap-[8px] flex flex-col"
    >
      <AccordionItem
        className="border-[1px] rounded-[16px] md:px-[24px] px-[16px] md:py-2 py-1"
        value="item-1"
      >
        <AccordionTrigger className="text-gray-800 md:text-[16px] md:leading-6 text-[14px] leading-5 cursor-pointer">
          How do I create an ad campaign on Aditt?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 md:text-[16px] md:leading-6 text-[14px] leading-5">
          <li>
            Aditt offers advanced targeting options, including demographics
            (age, gender, location), user interests, and engagement history.
            This ensures your ads reach the most relevant audience.
          </li>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        className="border-[1px] rounded-[16px] md:px-[24px] px-[16px] md:py-2 py-1"
        value="item-2"
      >
        <AccordionTrigger className="text-gray-800 md:text-[16px] md:leading-6 text-[14px] leading-5 cursor-pointer">
          What targeting options are available for advertisers?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 md:text-[16px] md:leading-6 text-[14px] leading-5">
          <li>
            Aditt offers advanced targeting options, including demographics
            (age, gender, location), user interests, and engagement history.
            This ensures your ads reach the most relevant audience.
          </li>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        className="border-[1px] rounded-[16px] md:px-[24px] px-[16px] md:py-2 py-1"
        value="item-3"
      >
        <AccordionTrigger className="text-gray-800 md:text-[16px] md:leading-6 text-[14px] leading-5 cursor-pointer">
          How does Aditt charge for ad campaigns?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 md:text-[16px] md:leading-6 text-[14px] leading-5">
          <li>
            Aditt offers advanced targeting options, including demographics
            (age, gender, location), user interests, and engagement history.
            This ensures your ads reach the most relevant audience.
          </li>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        className="border-[1px] rounded-[16px] md:px-[24px] px-[16px] md:py-2 py-1"
        value="item-4"
      >
        <AccordionTrigger className="text-gray-800 md:text-[16px] md:leading-6 text-[14px] leading-5 cursor-pointer">
          Can I track the performance of my ads?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 md:text-[16px] md:leading-6 text-[14px] leading-5">
          <li>
            Aditt offers advanced targeting options, including demographics
            (age, gender, location), user interests, and engagement history.
            This ensures your ads reach the most relevant audience.
          </li>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        className="border-[1px] rounded-[16px] md:px-[24px] px-[16px] md:py-2 py-1"
        value="item-5"
      >
        <AccordionTrigger className="text-gray-800 md:text-[16px] md:leading-6 text-[14px] leading-5 cursor-pointer">
          What types of ads can I run on Aditt?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 md:text-[16px] md:leading-6 text-[14px] leading-5">
          <li>
            Aditt offers advanced targeting options, including demographics
            (age, gender, location), user interests, and engagement history.
            This ensures your ads reach the most relevant audience.
          </li>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
