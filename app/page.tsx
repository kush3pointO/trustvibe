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
          <div className="flex w-full max-w-[1280px] flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-3">
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
              <span className="w-full font-['Afacad_Flux'] text-[42px] font-[700] leading-[48px] text-default-font text-center -tracking-[0.02em] mobile:text-heading-1 mobile:font-heading-1">
                End the interrogation. Start the conversation.
              </span>
            </div>
            <div className="flex w-full max-w-[768px] flex-col items-center gap-4 px-6 py-4 mobile:px-4 mobile:py-6">
              <span className="w-full font-['Afacad_Flux'] text-[18px] font-[500] leading-[26px] text-subtext-color text-center mobile:text-body mobile:font-body">
                From intrusive landlords to nosy stylists. From judgy doctors to
                snotty lawyers. From worthless dates to flirty bosses. Find out
                &quot;How it actually feels&quot; from real stories of the
                TrustVibe community.
              </span>
            </div>
            <div className="flex w-full max-w-[1024px] items-start gap-6 mobile:flex-col mobile:flex-nowrap mobile:gap-4">
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 rounded-xl border-2 border-solid border-brand-200 bg-white px-6 py-6 mobile:rounded-lg mobile:shadow-sm">
                <div className="flex w-full flex-col items-start gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" icon={<FeatherFileText />}>
                      Standard Review
                    </Badge>
                    <span className="text-caption-bold font-caption-bold text-subtext-color">
                      Doctor
                    </span>
                  </div>
                  <span className="text-body font-body text-neutral-600 mobile:text-subtext-color">
                    &quot;The doctor figured out the root cause and prescribed
                    medicines&quot;
                  </span>
                </div>
                <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
                <div className="flex w-full flex-col items-start gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand" icon={<FeatherHeart />}>
                      TrustVibe Review
                    </Badge>
                    <span className="text-caption-bold font-caption-bold text-brand-700">
                      Doctor
                    </span>
                  </div>
                  <span className="text-body-bold font-body-bold text-default-font mobile:text-subtext-color">
                    &quot;The doctor is experienced but kept asking me about my
                    personal choices. Was very much interested in giving me
                    unsolicited advice. Be strong if you plan to visit.&quot;
                  </span>
                </div>
              </div>
              <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 rounded-xl border-2 border-solid border-brand-200 bg-white px-6 py-6 mobile:rounded-lg mobile:shadow-sm">
                <div className="flex w-full flex-col items-start gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral" icon={<FeatherFileText />}>
                      Standard Review
                    </Badge>
                    <span className="text-caption-bold font-caption-bold text-subtext-color">
                      Attorney
                    </span>
                  </div>
                  <span className="text-body font-body text-neutral-600 mobile:text-subtext-color">
                    &quot;Knowledgeable attorney. Got the job done at reasonable
                    price&quot;
                  </span>
                </div>
                <div className="flex h-px w-full flex-none flex-col items-center gap-2 bg-neutral-200" />
                <div className="flex w-full flex-col items-start gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="brand" icon={<FeatherHeart />}>
                      TrustVibe Review
                    </Badge>
                    <span className="text-caption-bold font-caption-bold text-brand-700">
                      Attorney
                    </span>
                  </div>
                  <span className="text-body-bold font-body-bold text-default-font mobile:text-subtext-color">
                    &quot;Atty. Sharma handled my property dispute case well.
                    Didn&#39;t make me explain that I am a 40 year divorcee woman.
                    He gets work done but is biased and at times,
                    unprofessional.&quot;
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-[1024px] flex-col items-start gap-6 rounded-2xl px-8 py-8 shadow-sm bg-gradient-to-br from-brand-100 to-brand-50 mobile:rounded-lg mobile:px-6 mobile:py-6">
            <div className="flex items-center gap-3">
              <IconWithBackground
                variant="brand"
                size="large"
                icon={<FeatherUsers />}
                square={false}
              />
              <span className="text-heading-2 font-heading-2 text-default-font mobile:text-heading-3 mobile:font-heading-3">
                Who forms our community?
              </span>
            </div>
            <span className="text-body-bold font-body-bold text-default-font">
              Singles, Females, Divorcees, Widowed, LGBTQ+, Differently abled,
              minorities - anyone who doesn&#39;t want bad experiences to
              continue.
            </span>
          </div>
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
                    Share Your Story
                  </span>
                  <span className="text-body-bold font-body-bold text-brand-800">
                    How you felt with professionals, services, and people...
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
                    Read Real Experiences
                  </span>
                  <span className="text-body-bold font-body-bold text-success-800">
                    How others felt in similar situations...
                  </span>
                </div>
                <FeatherArrowRight className="font-['Afacad_Flux'] text-[32px] font-[500] leading-[32px] text-success-700 mobile:text-heading-2 mobile:font-heading-2" />
              </div>
            </div>
          </div>
          <div className="flex w-full max-w-[1024px] grow shrink-0 basis-0 flex-col items-start gap-6">
            <div className="flex w-full flex-col items-center justify-center gap-4 px-4 py-6 mobile:px-2 mobile:py-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <FeatherCoffee className="text-heading-2 font-heading-2 text-brand-600" />
                  <span className="text-heading-3 font-heading-3 text-default-font text-center">
                    Meet Tea, Your TrustVibe Assistant
                  </span>
                </div>
                <span className="text-body font-body text-subtext-color text-center">
                  Ask Tea about any doctor, lawyer, professional, or place
                </span>
              </div>
              <div className="flex h-16 w-full max-w-[768px] flex-none items-center justify-center gap-2 rounded-full border-2 border-solid border-brand-200 bg-white px-3 py-3 shadow-md mobile:h-14 mobile:w-full mobile:max-w-[768px] mobile:flex-none">
                <FeatherMessageCircle className="text-heading-2 font-heading-2 text-brand-600" />
                <TextFieldUnstyled className="h-auto grow shrink-0 basis-0">
                  <TextFieldUnstyled.Input
                    placeholder="Ask Tea about anything..."
                    value={teaQuery}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setTeaQuery(event.target.value)}
                    onKeyPress={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter') handleTeaSubmit();
                    }}
                  />
                </TextFieldUnstyled>
                <IconButton
                  variant="brand-primary"
                  size="large"
                  icon={<FeatherSend />}
                  onClick={handleTeaSubmit}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center gap-4 px-6 py-8 mobile:flex-col mobile:flex-nowrap mobile:gap-3 mobile:px-4 mobile:py-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-heading-3 font-heading-3 text-brand-600 text-center">
                Join TrustVibe community today
              </span>
              <span className="text-body font-body text-subtext-color text-center">
                Be part of a supportive community that values authentic
                experiences
              </span>
            </div>
            <Button
              variant="brand-primary"
              size="large"
              icon={<FeatherUserPlus />}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                // TODO: Open signup modal
                alert('Signup coming in Phase 1.5!');
              }}
            >
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
