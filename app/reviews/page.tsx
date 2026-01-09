"use client";

import React, { useEffect, useState } from "react";
import { Avatar } from "@/ui/components/Avatar";
import { DefaultPageLayout } from "@/ui/layouts/DefaultPageLayout";
import { FeatherThumbsDown } from "@/subframe/core";
import { FeatherThumbsUp } from "@/subframe/core";
import { supabase } from "@/lib/supabase";

interface Service {
  id: string;
  name: string;
  category: string;
  location: string;
}

interface Review {
  id: string;
  title: string;
  content: string;
  is_recommended: boolean;
  created_at: string;
  service: Service;
}

interface GroupedReviews {
  [category: string]: Review[];
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          title,
          content,
          is_recommended,
          created_at,
          service:services (
            id,
            name,
            category,
            location
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  // Group reviews by category
  const groupedReviews: GroupedReviews = reviews.reduce((acc, review) => {
    const category = review.service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(review);
    return acc;
  }, {} as GroupedReviews);

  // Get initials from name
  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Format date
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  }

  if (loading) {
    return (
      <DefaultPageLayout>
        <div className="container max-w-none flex h-full w-full flex-col items-center justify-center bg-default-background py-12">
          <div className="text-heading-3 font-heading-3 text-subtext-color">
            Loading reviews...
          </div>
        </div>
      </DefaultPageLayout>
    );
  }

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-4 bg-default-background py-12 px-6">
        <div className="flex w-full flex-col items-start gap-12 max-w-[1200px] mx-auto">
          <div className="flex w-full flex-col items-start gap-2">
            <span className="text-heading-1 font-heading-1 text-default-font">
              Professional Reviews
            </span>
            <span className="text-body font-body text-subtext-color">
              Honest feedback about your experiences with professionals and services
            </span>
          </div>

          {Object.entries(groupedReviews).map(([category, categoryReviews]) => (
            <div key={category} className="flex w-full flex-col items-start gap-6">
              <span className="text-heading-2 font-heading-2 text-default-font">
                {category}
              </span>
              <div className="flex w-full flex-col items-start gap-4">
                {categoryReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex w-full flex-col items-start gap-4 overflow-hidden rounded-md border border-solid border-neutral-border bg-default-background px-6 py-6 shadow-sm"
                  >
                    <div className="flex w-full items-start gap-4">
                      <Avatar size="medium">
                        {getInitials(review.service.name)}
                      </Avatar>
                      <div className="flex grow shrink-0 basis-0 flex-col items-start gap-2">
                        <div className="flex w-full items-center gap-2">
                          <span className="grow shrink-0 basis-0 text-heading-3 font-heading-3 text-default-font">
                            {review.title}
                          </span>
                          <span className="text-caption font-caption text-subtext-color">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                        <span className="w-full text-body font-body text-default-font">
                          {review.content}
                        </span>
                        <div className="flex items-center gap-2">
                          {review.is_recommended ? (
                            <>
                              <FeatherThumbsUp className="text-body font-body text-success-600" />
                              <span className="text-body-bold font-body-bold text-success-600">
                                Recommended
                              </span>
                            </>
                          ) : (
                            <>
                              <FeatherThumbsDown className="text-body font-body text-error-600" />
                              <span className="text-body-bold font-body-bold text-error-600">
                                Not Recommended
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="flex w-full flex-col items-center justify-center py-12">
              <span className="text-heading-3 font-heading-3 text-subtext-color">
                No reviews yet. Be the first to share your experience!
              </span>
            </div>
          )}
        </div>
      </div>
    </DefaultPageLayout>
  );
}
