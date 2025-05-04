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
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem className="border-1 rounded-md mb-2 p-1" value="item-1">
        <AccordionTrigger className="text-gray-800">
          How do I create an ad campaign on Aditt?
        </AccordionTrigger>
        <AccordionContent className="text-gray-500">
          <li>
            Aditt offers advanced targeting options, including demographics
            (age, gender, location), user interests, and engagement history.
            This ensures your ads reach the most relevant audience.
          </li>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem className="border-1 rounded-md mb-2 p-1" value="item-2">
        <AccordionTrigger className="text-gray-800">
          What targeting options are available for advertisers?
        </AccordionTrigger>
        <AccordionContent className="text-gray-500">
          <li>
            Aditt offers advanced targeting options, including demographics
            (age, gender, location), user interests, and engagement history.
            This ensures your ads reach the most relevant audience.
          </li>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem className="border-1 rounded-md mb-2 p-1" value="item-3">
        <AccordionTrigger className="text-gray-800">
          Can I track the performance of my ads?{" "}
        </AccordionTrigger>
        <AccordionContent className="text-gray-500">
          <li>
            Aditt offers advanced targeting options, including demographics
            (age, gender, location), user interests, and engagement history.
            This ensures your ads reach the most relevant audience.
          </li>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem className="border-1 rounded-md mb-5 p-1" value="item-4">
        <AccordionTrigger className="text-gray-800">
          What types of ads can I run on Aditt?{" "}
        </AccordionTrigger>
        <AccordionContent className="text-gray-500">
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
