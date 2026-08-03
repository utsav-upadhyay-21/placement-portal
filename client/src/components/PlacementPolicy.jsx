function PlacementPolicy() {
  const sections = [
    {
      title: "Full-Time (FTE) Offer Policy",
      paragraphs: [
        "Students who secure a Full-Time (FTE) offer below 8 LPA are eligible to continue participating in campus placements only for companies offering packages above 10 LPA.",
        "Students who secure a Full-Time (FTE) offer of 8 LPA or above are considered placed and are not eligible to participate in any further campus placement drives.",
      ],
    },
    {
      title: "Internship-Only Offer Policy",
      paragraphs: [
        "Students who secure only an internship offer (with no PPO/PBC/FTE opportunity) are eligible to participate in subsequent placement opportunities under the following conditions:",
      ],
      conditions: [
        {
          text: "Eligible to apply for Full-Time (FTE) opportunities.",
          status: "ok",
        },
        {
          text: "Eligible to apply for Internship + PPO/PBC opportunities.",
          status: "ok",
        },
        {
          text: "Not eligible to apply for internship-only recruitment drives.",
          status: "no",
        },
        {
          text: "Participation is permitted only if there is no overlap or conflict between the internship timelines of the existing internship and the company they wish to apply for.",
          status: "ok",
          bold: true,
        },
      ],
    },
    {
      title: "Full-Time Offer + Internship Opportunity",
      paragraphs: [
        "Students who have already secured a Full-Time (FTE) offer may apply for internship-only opportunities, provided the internship schedule does not conflict with the full-time joining date.",
      ],
    },
    {
      title: "Internship + PPO/PBC/FTE Offer Policy",
      paragraphs: [
        "Students who secure an Internship + PPO/PBC/Full-Time Employment (FTE) offer are considered placed and are not eligible to participate in any further campus placement drives.",
      ],
    },
  ];

  return (
    <section className="placement-policy">
      <h2 className="placement-policy-title">Placement Policy</h2>
      <div className="placement-policy-body">
        {sections.map((section, index) => (
          <div className="placement-policy-section" key={index}>
            <h3>{section.title}</h3>
            {section.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
            {section.conditions && (
              <ul className="policy-list">
                {section.conditions.map((condition, i) => (
                  <li key={i} className="policy-item">
                    <span
                      className={`policy-dot ${condition.status}`}
                    ></span>
                    <span
                      className={`policy-text ${
                        condition.bold ? "policy-text-bold" : ""
                      }`}
                    >
                      {condition.text}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default PlacementPolicy;
