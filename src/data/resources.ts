import type { CategoryKey, MatchedResource, NeedTag, Resource, ScoreSet } from "@/types";

/** The 16 counties of Maine, alphabetical. */
export const MAINE_COUNTIES: string[] = [
  "Androscoggin",
  "Aroostook",
  "Cumberland",
  "Franklin",
  "Hancock",
  "Kennebec",
  "Knox",
  "Lincoln",
  "Oxford",
  "Penobscot",
  "Piscataquis",
  "Sagadahoc",
  "Somerset",
  "Waldo",
  "Washington",
  "York",
];

/**
 * Maine Resource Database.
 * Websites and phone numbers were checked against each organization's own
 * site or official listings (September 2026). A phone number is only listed
 * when it could be confirmed.
 */
export const resources: Resource[] = [
  {
    id: "211-maine",
    name: "211 Maine",
    shortDescription:
      "A free, confidential helpline that connects you to local help anywhere in Maine, 24 hours a day, 7 days a week.",
    whatTheyHelpWith: [
      "Finding housing and emergency shelter",
      "Food, heating, and utility help",
      "Transportation and local services",
      "Mental health and substance use support",
    ],
    tags: ["housing", "basic-needs", "transportation", "support"],
    counties: "statewide",
    phone: "211 or 1-866-811-5695",
    phoneHref: "tel:211",
    website: "https://211maine.org",
    firstStep:
      "Call 211 and say: \"I'm getting ready for release and need help finding housing in my county.\" You can also text your ZIP code to 898-211.",
    basePriority: 5,
  },
  {
    id: "maine-dhhs-ofi",
    name: "Maine DHHS – Office for Family Independence",
    shortDescription:
      "The state office for food benefits (SNAP), MaineCare health coverage, and other help with basic needs.",
    whatTheyHelpWith: [
      "SNAP food benefits",
      "MaineCare (health coverage)",
      "TANF cash assistance for families",
      "Checking and renewing your benefits",
    ],
    tags: ["basic-needs", "health-coverage"],
    counties: "statewide",
    phone: "1-855-797-4357",
    phoneHref: "tel:+18557974357",
    website: "https://www.maine.gov/dhhs/ofi",
    firstStep:
      "Call 1-855-797-4357 (weekdays, 7am–4pm) and say: \"I'd like to apply for food benefits and MaineCare.\" You can also apply online at My Maine Connection.",
    basePriority: 4,
  },
  {
    id: "maine-careercenters",
    name: "Maine CareerCenters",
    shortDescription:
      "Free job help from the Maine Department of Labor, with offices around the state and staff who work with people who have a record.",
    whatTheyHelpWith: [
      "Job searching and applications",
      "Resume and interview help",
      "Job training and education programs",
      "Using Maine JobLink and computers to find work",
    ],
    tags: ["employment", "education", "technology"],
    counties: "statewide",
    phone: "1-888-457-8883",
    phoneHref: "tel:+18884578883",
    website: "https://www.mainecareercenter.gov",
    firstStep:
      "Call 1-888-457-8883 (weekdays, 8am–4:30pm) and say: \"I'm coming home soon and want to meet with someone about finding a job.\"",
    basePriority: 4,
  },
  {
    id: "mainehousing",
    name: "MaineHousing",
    shortDescription:
      "Maine's state housing agency. They run rental help programs like Housing Choice Vouchers and can point you to local housing resources.",
    whatTheyHelpWith: [
      "Housing Choice Vouchers (rental help)",
      "Finding affordable housing",
      "Connecting with homeless services",
      "Heating and energy assistance programs",
    ],
    tags: ["housing"],
    counties: "statewide",
    phone: "1-800-452-4668",
    phoneHref: "tel:+18004524668",
    website: "https://www.mainehousing.org",
    firstStep:
      "Call 1-800-452-4668 and say: \"I need help with rent and want to know which housing programs I can apply for.\"",
    basePriority: 4,
  },
  {
    id: "maine-prisoner-reentry-network",
    name: "Maine Prisoner Re-Entry Network",
    shortDescription:
      "A group that works across Maine to support people coming home. Since 2017, it has brought together community groups, corrections staff, employers, and people who have been there.",
    whatTheyHelpWith: [
      "Community re-entry meetings in towns across Maine",
      "Help finding recovery housing and work",
      "Mentoring from trained volunteers",
      "Rose's Room support group for families",
    ],
    tags: ["support", "housing", "employment"],
    counties: "statewide",
    website: "https://re-entrymaine.org",
    firstStep:
      "Visit re-entrymaine.org and find the community re-entry meeting closest to you. Go once, just to listen and meet people.",
    basePriority: 3,
  },
  {
    id: "maine-reentry-network",
    name: "Maine Reentry Network",
    shortDescription:
      "Reentry and recovery support run by peers. Everyone on the team has been through recovery or incarceration themselves.",
    whatTheyHelpWith: [
      "Reentry and recovery coaching",
      "Connecting you with local resources",
      "Support if you're in recovery or have a substance use history",
      "Peer support from people who have been there",
    ],
    tags: ["recovery", "support"],
    counties: "statewide",
    phone: "(207) 930-0659",
    phoneHref: "tel:+12079300659",
    website: "https://www.reentrymaine.org",
    firstStep:
      "Call (207) 930-0659 and say: \"I'd like to be matched with a reentry or recovery coach.\"",
    basePriority: 3,
  },
  {
    id: "reentry-sisters",
    name: "Reentry Sisters",
    shortDescription:
      "A Maine nonprofit led by formerly incarcerated women, building a community of support for women coming home from prison and jail.",
    whatTheyHelpWith: [
      "Peer mentorship from women who have been there",
      "Education support and college classes",
      "Help finding resources",
      "Community and emotional healing",
    ],
    tags: ["women", "support", "education"],
    counties: "statewide",
    website: "https://reentrysisters.org",
    firstStep:
      "Visit reentrysisters.org and use their contact page to say: \"I'm coming home soon and would like to connect with other women.\"",
    audience: "Women",
    basePriority: 3,
  },
  {
    id: "pine-tree-legal",
    name: "Pine Tree Legal Assistance",
    shortDescription:
      "Free civil legal help for people with low incomes in Maine. They do not handle criminal cases, but can help with housing, benefits, and other legal problems.",
    whatTheyHelpWith: [
      "Evictions and housing problems",
      "Problems with MaineCare or other benefits",
      "Family law and protection from abuse",
      "Free self-help guides and forms",
    ],
    tags: ["legal", "housing", "health-coverage"],
    counties: "statewide",
    phone: "(207) 774-8211",
    phoneHref: "tel:+12077748211",
    website: "https://www.ptla.org",
    firstStep:
      "Go to ptla.org and click \"Find Legal Help\" to check their phone and walk-in hours, then call and say: \"I have a legal problem and want to see if you can help.\"",
    basePriority: 4,
  },
  {
    id: "goodwill-workforce-services",
    name: "Goodwill Workforce Services",
    shortDescription:
      "Job and career help from Goodwill Northern New England. Some programs work with Maine prisons and jails.",
    whatTheyHelpWith: [
      "Career coaching and job placement",
      "Job training and work experience",
      "Help with things that get in the way, like rides or paperwork",
      "Paid work while you settle back in, and after",
    ],
    tags: ["employment", "education", "technology"],
    counties: "statewide",
    website: "https://goodwillnne.org/workforce-services/",
    firstStep:
      "Visit goodwillnne.org/workforce-services and reach out to say: \"I'm returning from incarceration and want help with a job plan.\"",
    basePriority: 3,
  },
  {
    id: "recovery-community-centers",
    name: "Recovery Community Centers",
    shortDescription:
      "Maine's network of free, peer-based recovery community centers, coordinated by the Portland Recovery Community Center as the Maine Recovery Hub.",
    whatTheyHelpWith: [
      "Free recovery coaching",
      "Drop-in hours and support groups",
      "Finding a recovery center near you",
      "Support for families and loved ones",
    ],
    tags: ["recovery", "support"],
    counties: "statewide",
    phone: "(207) 553-2575",
    phoneHref: "tel:+12075532575",
    website: "https://portlandrecovery.org/recovery-community-centers-in-maine/",
    firstStep:
      "Call (207) 553-2575 and say: \"Can you help me find the recovery community center closest to where I'll be living?\"",
    basePriority: 4,
  },
];

/** Assessment categories mapped to the resource tags that help strengthen them. */
const CATEGORY_TAGS: Record<CategoryKey, NeedTag[]> = {
  technology: ["technology"],
  employment: ["employment"],
  support: ["support"],
  hope: ["support", "recovery"],
  resources: ["basic-needs"],
};

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  technology: "technology skills",
  employment: "employment confidence",
  support: "support network",
  hope: "hope and recovery",
  resources: "access to basic resources",
};

const NEED_LABELS: Record<NeedTag, string> = {
  housing: "housing",
  employment: "finding work",
  technology: "technology",
  legal: "legal help",
  recovery: "recovery",
  support: "support",
  "basic-needs": "basic needs like food",
  "health-coverage": "health coverage",
  "id-documents": "ID and documents",
  transportation: "transportation",
  education: "education",
  women: "women's support",
};

const CATEGORY_ORDER: CategoryKey[] = ["technology", "support", "employment", "hope", "resources"];

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function matchResources(
  input: { scores: ScoreSet; county: string; needTags: NeedTag[] },
  limit = 3,
): MatchedResource[] {
  const { scores, county, needTags } = input;
  const firstNeed = needTags[0];

  const scored = resources.map((resource) => {
    let score = resource.basePriority * 2;

    // Direct need matches
    const matchedNeeds = resource.tags.filter((tag) => needTags.includes(tag));
    for (const tag of matchedNeeds) {
      score += tag === firstNeed ? 18 : 10;
    }

    // Category weakness boosts
    let weakest: { category: CategoryKey; boost: number } | null = null;
    for (const category of CATEGORY_ORDER) {
      if (CATEGORY_TAGS[category].some((tag) => resource.tags.includes(tag))) {
        const raw = scores[category];
        const value = Number.isFinite(raw) ? Math.min(100, Math.max(0, raw)) : 100;
        const boost = (100 - value) / 10;
        score += boost;
        if (boost > 0 && (!weakest || boost > weakest.boost)) {
          weakest = { category, boost };
        }
      }
    }

    // Location
    let localMatch = false;
    if (resource.counties === "statewide") {
      score += 2;
    } else if (resource.counties.includes(county)) {
      score += 4;
      localMatch = true;
    }

    // Audience-specific resources
    if (resource.audience === "Women" && !needTags.includes("women")) {
      score -= 6;
    }

    // Human-readable reason
    let reason: string;
    if (firstNeed && matchedNeeds.includes(firstNeed)) {
      reason = `Recommended because you said ${NEED_LABELS[firstNeed]} is your first need`;
    } else if (matchedNeeds.length > 0) {
      reason = `Recommended because you mentioned needing help with ${joinList(matchedNeeds.map((t) => NEED_LABELS[t]))}`;
    } else if (weakest && weakest.boost >= 3) {
      reason = `Recommended because ${CATEGORY_LABELS[weakest.category]} was identified as an area to focus on next`;
    } else if (resource.counties === "statewide") {
      reason = "Recommended as a trusted place to start, available anywhere in Maine";
    } else {
      reason = "Recommended as a trusted place to start near you";
    }
    if (localMatch) {
      reason += `, and they serve ${county} County.`;
    } else {
      reason += ".";
    }

    return { resource, score: Math.round(score * 100) / 100, reason };
  });

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      b.resource.basePriority - a.resource.basePriority ||
      a.resource.name.localeCompare(b.resource.name, "en"),
  );

  const count = Math.max(0, Math.min(Math.floor(limit), scored.length));
  const top = scored.slice(0, count);

  // Guarantee the best match for the learner's first need is always shown.
  if (firstNeed && count > 0 && !top.some((m) => m.resource.tags.includes(firstNeed))) {
    const bestForNeed = scored.find((m) => m.resource.tags.includes(firstNeed));
    if (bestForNeed) top[count - 1] = bestForNeed;
  }
  return top;
}

export function getResource(id: string): Resource | undefined {
  return resources.find((resource) => resource.id === id);
}
