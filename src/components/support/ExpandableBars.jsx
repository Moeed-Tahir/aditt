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
        How do I create a campaign on Aditt?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 md:text-[16px] md:leading-6 text-[14px] leading-5">
          <li>
          Log into your Aditt advertiser dashboard, click "Create Campaign", and follow the step-by-step setup process. You’ll upload your video ad, define your verification question, choose targeting options, set your budget, and call-to-action.
          </li>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        className="border-[1px] rounded-[16px] md:px-[24px] px-[16px] md:py-2 py-1"
        value="item-2"
      >
        <AccordionTrigger className="text-gray-800 md:text-[16px] md:leading-6 text-[14px] leading-5 cursor-pointer">
        What targeting options are available on Aditt?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 md:text-[16px] md:leading-6 text-[14px] leading-5">
          <li>
          Aditt currently offers basic demographic targeting. More refined targeting based on real user behavior and attention metrics improve by the day!
          </li>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        className="border-[1px] rounded-[16px] md:px-[24px] px-[16px] md:py-2 py-1"
        value="item-3"
      >
        <AccordionTrigger className="text-gray-800 md:text-[16px] md:leading-6 text-[14px] leading-5 cursor-pointer">
        How does Aditt charge for campaigns?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 md:text-[16px] md:leading-6 text-[14px] leading-5">
          <li>
          Aditt uses a pay-for-engagement model. You’re only charged when a user watches your ad and correctly answers the verification question—proving they paid attention.Campaigns are billed daily using your connected business card.
          </li>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        className="border-[1px] rounded-[16px] md:px-[24px] px-[16px] md:py-2 py-1"
        value="item-4"
      >
        <AccordionTrigger className="text-gray-800 md:text-[16px] md:leading-6 text-[14px] leading-5 cursor-pointer">
        Can I track the performance of my campaigns?
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 md:text-[16px] md:leading-6 text-[14px] leading-5">
          <li>
          Absolutely. Your dashboard provides real-time analytics, including views, correct verification rates, attentive engagement percentage, call-to-action completions, and cost-per-result. This helps you optimize your ads and maximize ROI.

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
          Aditt supports short-form (&lt;30sec) vertical video ads, similar to TikTok or Reels, optimized for mobile viewing. Each ad should include a verification question and can optionally include a follow-up survey and a final call-to-action like a website visit, app install, or social follow.
          </li>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
