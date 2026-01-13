"use client";

import React, { useState } from "react";
import { Badge } from "@/ui/components/Badge";
import { Button } from "@/ui/components/Button";
import { IconButton } from "@/ui/components/IconButton";
import { IconWithBackground } from "@/ui/components/IconWithBackground";
import { TextFieldUnstyled } from "@/ui/components/TextFieldUnstyled";
import { Navigation } from "@/ui/components/Navigation";
import { TeaModal } from "@/components/TeaModal";
import { FeatherArrowRight } from "@/subframe/core";
import { FeatherBookOpen } from "@/subframe/core";
import { FeatherCoffee } from "@/subframe/core";
import { FeatherEdit3 } from "@/subframe/core";
import { FeatherFileText } from "@/subframe/core";
import { FeatherHeart } from "@/subframe/core";
import { FeatherMessageCircle } from "@/subframe/core";
import { FeatherSend } from "@/subframe/core";
import { FeatherUserPlus } from "@/subframe/core";
import { FeatherUsers } from "@/subframe/core";
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isTeaModalOpen, setIsTeaModalOpen] = useState(false);
  const [teaQuery, setTeaQuery] = useState("");

  const handleTeaSubmit = () => {
    if (teaQuery.trim()) {
      setIsTeaModalOpen(true);
    }
  };

  // Vibe comparison examples
  const vibeExamples = [
    {
      type: "Doctor",
      standard: "\"Good doctor. Diagnosed my issue correctly. Recommended.\"",
      trustvibe: "\"Dr. Rao is skilled but asked why I'm 32 and unmarried. Twice. If you can handle auntie energy, she's good at her job tho 😅\""
    },
    {
      type: "Lawyer",
      standard: "\"Knowledgeable attorney. Got the job done at reasonable price.\"",
      trustvibe: "\"Atty. Sharma handled my divorce case well. Didn't make me explain myself 10 times. No weird comments. Rare W for a lawyer tbh.\""
    }
  ];

  return (
    <>
      <Navigation />
      <TeaModal
        isOpen={isTeaModalOpen}
        onClose={() => {
          setIsTeaModalOpen(false);
          setTeaQuery("");
        }}
        initialQuery={teaQuery}
      />
      <div className="container max-w-none flex w-full flex-col items-center bg-gradient-to-b from-brand-50 to-white mobile:items-start mobile:justify-start">
        <div className="flex w-full flex-col items-center gap-12 px-6 py-12 mobile:flex-col mobile:flex-nowrap mobile:gap-8 mobile:px-6 mobile:py-8">
          
          {/* Hero Section */}
          <div className="flex w-full max-w-[1280px] flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <IconWithBackground
                  variant="brand"
                  size="large"
                  icon={<FeatherHeart />}
                  square={false}
                />
                <span className="text-heading-1 font-heading-1 text-brand-600 mobile:text-heading-2 mobile:font-heading-2">
                  TrustVibe
                </span>
              </div>
              
              {/* New Tagline */}
              <div className="flex flex-col items-center gap-2">
                <span className="w-full font-['Afacad_Flux'] text-[42px] font-[700] leading-[48px] text-default-font text-center -tracking-[0.02em] mobile:text-heading-1 mobile:font-heading-1">
                  Reviews tell you what happened.
                </span>
                <span className="w-full font-['Afacad_Flux'] text-[42px] font-[700] leading-[48px] text-brand-600 text-center -tracking-[0.02em] mobile:text-heading-1 mobile:font-heading-1">
                  We tell you how it felt.
                </span>
              </div>
            </div>
            
            <div className="flex w-full max-w-[768px] flex-col items-center gap-4 px-6 py-4 mobile:px-4 mobile:py-6">
              <span className="w-full font-['Afacad_Flux'] text-[18px] font-[500] leading-[26px] text-subtext-color text-center mobile:text-body mobile:font-body">
                Google tells you the rating. Yelp tells you the wait time. 
                We tell you if the doctor was judgey, the landlord gave weird energy, 
                or the stylist actually got your vibe.
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 mobile:flex-col mobile:w-full">
              <Button
                variant="brand-primary"
                size="large"
                icon={<FeatherBookOpen />}
                onClick={() => router.push('/reviews')}
              >
                Check Vibes
              </Button>
              <Button
                variant="brand-secondary"
                size="large"
                icon={<FeatherEdit3 />}
                onClick={() => router.push('/write-review')}
              >
                Drop a Vibe
              </Button>
            </div>
          </div>

          {/* Vibe Comparison Cards */}
          <div className="flex w-full max-w-[1024px] flex-col items-center gap-4">
            <span className="text-heading-3 font-heading-3 text-default-font text-center">
              See the difference
            </span>
            
            <div className="flex w-full items-start gap-6 mobile:flex-col mobile:flex-nowrap mobile:gap-4">
              {vibeExamples.map((example, index) => (
                <div key={index} className="flex grow shrink-0 basis-0 flex-col items-start gap-6 rounded-xl border-2 border-solid border-brand-200 bg-white px-6 py-6 mobile:rounded-lg mobile:shadow-sm">
                  {/* Standard Review */}
                  <div className="flex w-full flex-col items-start gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral" icon={<FeatherFileText />}>
                        Standard Review
                      </Badge>
                      <span className="text-caption-bold font-caption-bold text-subtext-color">
                        {example.type}
                      </span>
                    </div>
                    <span className="text-body font-body text-neutral-600 mobile:text-subtext-color">
                      {example.standard}
                    </span>
                  </div>
                  
                  <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
                  
                  {/* TrustVibe Review */}
                  <div className="flex w-full flex-col items-start gap-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="brand" icon={<FeatherHeart />}>
                        TrustVibe
                      </Badge>
                      <span className="text-caption-bold font-caption-bold text-brand-700">
                        {example.type}
                      </span>
                    </div>
                    <span className="text-body-bold font-body-bold text-default-font mobile:text-subtext-color">
                      {example.trustvibe}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What's a Vibe Check Section */}
          <div className="flex w-full max-w-[1024px] flex-col items-center gap-6 rounded-2xl px-8 py-10 bg-brand-700 mobile:rounded-lg mobile:px-6 mobile:py-8">
            <span className="text-heading-2 font-heading-2 text-white text-center">
              What's a Vibe Check?
            </span>
            <span className="text-heading-3 font-heading-3 text-brand-200 text-center">
              You already know.
            </span>
            <span className="text-body font-body text-brand-100 text-center max-w-[600px]">
              Before you book that appointment, you wanna know:
            </span>
            
            <div className="flex flex-col items-start gap-3 max-w-[500px]">
              {[
                "Are they gonna be weird about my situation?",
                "Will I have to explain myself?",
                "Is this place actually chill or just \"professional\"?"
              ].map((question, i) => (
                <div key={i} className="flex items-start gap-3">
                  <FeatherArrowRight className="text-brand-300 mt-1 flex-shrink-0" />
                  <span className="text-body-bold font-body-bold text-white">{question}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col items-center gap-2 mt-4">
              <span className="text-body font-body text-brand-200">Standard reviews don't tell you that.</span>
              <span className="text-heading-3 font-heading-3 text-white">We do.</span>
            </div>
          </div>

          {/* Who's Dropping Vibes Section */}
          <div className="flex w-full max-w-[1024px] flex-col items-start gap-6 rounded-2xl px-8 py-8 shadow-sm bg-gradient-to-br from-brand-100 to-brand-50 mobile:rounded-lg mobile:px-6 mobile:py-6">
            <div className="flex items-center gap-3">
              <IconWithBackground
                variant="brand"
                size="large"
                icon={<FeatherUsers />}
                square={false}
              />
              <span className="text-heading-2 font-heading-2 text-default-font mobile:text-heading-3 mobile:font-heading-3">
                Who's Dropping Vibes?
              </span>
            </div>
            <span className="text-body font-body text-subtext-color">
              Everyone who's ever thought "wish I knew that before I went"
            </span>
            
            <div className="flex flex-col gap-3 w-full">
              {[
                "The girl who got the \"so when are you getting married?\" from her dentist",
                "The guy whose landlord interrogated him for living alone",
                "The person who just wants a haircut without unsolicited life advice",
                "Anyone who's walked out thinking \"that was... a lot\""
              ].map((person, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-lg px-4 py-3">
                  <span className="text-brand-600">•</span>
                  <span className="text-body font-body text-default-font">{person}</span>
                </div>
              ))}
            </div>
            
            <span className="text-body font-body text-subtext-color mt-2">
              Whether you're single, queer, divorced, a minority, neurodivergent, or just someone 
              who doesn't want to explain your whole life story to get a service done — 
              <span className="text-brand-700 font-body-bold"> this is your spot.</span>
            </span>
          </div>

          {/* Action Cards */}
          <div className="flex w-full max-w-[1024px] flex-col items-start gap-6 mobile:flex-col mobile:flex-nowrap mobile:gap-4">
            <div 
              onClick={() => router.push('/write-review')}
              className="flex w-full flex-col items-start gap-4 rounded-2xl px-8 py-8 shadow-md bg-gradient-to-br from-brand-200 to-brand-100 mobile:rounded-lg mobile:px-6 mobile:py-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex w-full items-center gap-4">
                <IconWithBackground
                  variant="brand"
                  size="x-large"
                  icon={<FeatherEdit3 />}
                  square={false}
                />
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                  <span className="font-['Afacad_Flux'] text-[24px] font-[700] leading-[28px] text-default-font mobile:text-heading-2 mobile:font-heading-2">
                    Drop Your Vibe
                  </span>
                  <span className="text-body-bold font-body-bold text-brand-800">
                    Had an experience? Share it. Not a review. Not a rating. Just: how did it feel?
                  </span>
                </div>
                <FeatherArrowRight className="font-['Afacad_Flux'] text-[32px] font-[500] leading-[32px] text-brand-700 mobile:text-heading-2 mobile:font-heading-2" />
              </div>
            </div>
            
            <div 
              onClick={() => router.push('/reviews')}
              className="flex w-full flex-col items-start gap-4 rounded-2xl px-8 py-8 shadow-md bg-gradient-to-br from-success-200 to-success-100 mobile:rounded-lg mobile:px-6 mobile:py-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex w-full items-center gap-4">
                <IconWithBackground
                  variant="success"
                  size="x-large"
                  icon={<FeatherBookOpen />}
                  square={false}
                />
                <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                  <span className="font-['Afacad_Flux'] text-[24px] font-[700] leading-[28px] text-default-font mobile:text-heading-2 mobile:font-heading-2">
                    Check the Vibe
                  </span>
                  <span className="text-body-bold font-body-bold text-success-800">
                    Search any professional or place. See how it actually felt for people like you.
                  </span>
                </div>
                <FeatherArrowRight className="font-['Afacad_Flux'] text-[32px] font-[500] leading-[32px] text-success-700 mobile:text-heading-2 mobile:font-heading-2" />
              </div>
            </div>
          </div>

          {/* Tea Section */}
          <div className="flex w-full max-w-[1024px] grow shrink-0 basis-0 flex-col items-start gap-6">
            <div className="flex w-full flex-col items-center justify-center gap-4 px-4 py-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 mobile:px-2 mobile:py-4">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[48px]">☕</span>
                <span className="text-heading-2 font-heading-2 text-default-font text-center">
                  Meet Tea
                </span>
                <span className="text-body font-body text-subtext-color text-center">
                  Your vibe-check bestie who's always online
                </span>
              </div>
              
              <div className="flex flex-col gap-2 text-center max-w-[500px]">
                <span className="text-body text-neutral-600">"yo what's the vibe at Dr. Mehta's clinic?"</span>
                <span className="text-body text-neutral-600">"any chill divorce lawyers in Mumbai?"</span>
                <span className="text-body text-neutral-600">"salons in Delhi that actually know curly hair?"</span>
              </div>
              
              <div className="flex h-14 w-full max-w-[600px] flex-none items-center justify-center gap-2 rounded-full border-2 border-solid border-amber-200 bg-white px-3 py-3 shadow-md mobile:h-14 mobile:w-full mobile:flex-none">
                <FeatherMessageCircle className="text-heading-2 font-heading-2 text-amber-600" />
                
                <div 
                  className="h-auto grow shrink-0 basis-0"
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === 'Enter') handleTeaSubmit();
                  }}
                >
                  <TextFieldUnstyled className="h-full">
                    <TextFieldUnstyled.Input
                      placeholder="ask tea something..."
                      value={teaQuery}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTeaQuery(event.target.value)}
                    />
                  </TextFieldUnstyled> 
                </div>  

                <IconButton
                  variant="brand-primary"
                  size="large"
                  icon={<FeatherSend />}
                  onClick={handleTeaSubmit}
                />
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="flex w-full flex-col items-center gap-4 px-6 py-12 bg-brand-700 rounded-2xl max-w-[1024px] mobile:flex-col mobile:flex-nowrap mobile:gap-3 mobile:px-4 mobile:py-8">
            <span className="text-heading-2 font-heading-2 text-white text-center">
              The vibe check the internet was missing.
            </span>
            <span className="text-body font-body text-brand-200 text-center">
              Join 10,000+ people who check vibes before they book.
            </span>
            <Button
              variant="neutral"
              size="large"
              icon={<FeatherUserPlus />}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                alert('Signup coming soon!');
              }}
            >
              Start Checking Vibes
            </Button>
          </div>

          {/* Footer tagline */}
          <div className="flex flex-col items-center gap-2 py-4">
            <span className="text-body-bold font-body-bold text-brand-600">
              Because vibes matter.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
