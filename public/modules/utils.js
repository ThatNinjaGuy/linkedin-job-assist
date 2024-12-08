export function getJobDescriptionClassNames(url) {
  const linkedinListViewUrl = "https://www.linkedin.com/jobs/collections";
  //   const linkedinDetailViewUrl = "https://www.linkedin.com/jobs/view";

  console.log(url);
  if (url.startsWith(linkedinListViewUrl)) {
    return {
      descriptionClass: "jobs-unified-description__content",
      companyNameClass: "job-details-jobs-unified-top-card__company-name",
      roleNameClass: "job-details-jobs-unified-top-card__job-title", // Replace with actual class
    };
  } else {
    return {
      descriptionClass: "jobs-description-content__text",
      companyNameClass: "job-details-jobs-unified-top-card__company-name",
      roleNameClass: "job-details-jobs-unified-top-card__job-title", // Replace with actual class
    };
  }
}
