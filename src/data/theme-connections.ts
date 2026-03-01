// src/data/theme-connections.ts
// Cross-theme connection bridges for the Themes page.
// All themeId values must match the actual IDs in src/data/themes.json.
// Run: node -e "require('./src/data/themes.json').forEach(t => console.log(t.id))"
// to verify IDs before running Claude Code on this file.

export interface ThemeBridge {
  themeId: string;
  strength: 1 | 2 | 3;
  bridge: string;  // 1-3 sentences of analytical prose
}

export interface ThemeConnectionEntry {
  themeId: string;
  connects: ThemeBridge[];
}

// IMPORTANT: themeId values below use actual slugs from themes.json (verified via Phase 0).
// If an ID doesn't exist in themes.json, the component filters it out rather than creating a dead link.

export const themeConnections: ThemeConnectionEntry[] = [
  {
    themeId: 'the-trafficking-operation',
    connects: [
      {
        themeId: 'maxwell-role-legal-history-current-status',
        strength: 3,
        bridge: `Maxwell was not a peripheral figure in the trafficking operation — she was its operational director. Understanding the operation's mechanics (recruitment, management, logistics) requires understanding Maxwell's specific role, which is documented separately in Theme 6.`,
      },
      {
        themeId: 'the-co-conspirators-immunity-grantees',
        strength: 3,
        bridge: `The immunity provisions of the 2008 Non-Prosecution Agreement directly shaped who could be held accountable for the trafficking operation. Kellen, Ross, Groff, and Marcinkova — key operational figures — received blanket immunity, ending any federal accountability for their roles. The trafficking operation cannot be understood without understanding who was protected from prosecution for it.`,
      },
      {
        themeId: 'the-acosta-plea-deal-legal-history',
        strength: 3,
        bridge: `The 2008 plea deal that allowed the trafficking operation to continue for over a decade with minimal legal consequence is documented in detail in Theme 14. The Acosta NPA is the legal mechanism that transformed documented federal crimes into an 18-month state sentence with daily work release.`,
      },
      {
        themeId: 'international-consequences-fallout',
        strength: 2,
        bridge: `Brunel's MC2 Model Management served as the international recruitment infrastructure for the trafficking operation — particularly for victims from France, Eastern Europe, and Brazil. His operation extended the network's geographic reach well beyond Palm Beach and New York.`,
      },
    ],
  },

  {
    themeId: 'efta-release-framework-document-architecture',
    connects: [
      {
        themeId: 'community-research-tools-architecture',
        strength: 3,
        bridge: `The 3.5 million pages released under EFTA are largely navigable only through community-built tools — JMail.world (indexing Epstein's email archive), EpsteinExposed.com (cross-referencing the full document corpus), and the GitHub repositories built by citizen researchers. The release framework and the community tools for navigating it are effectively one investigation.`,
      },
      {
        themeId: 'epsteins-death-mcc-anomalies',
        strength: 2,
        bridge: `Dataset 8 and Dataset 9 of the EFTA release contain the MCC surveillance footage and prison records. The "infinite loop" anomaly in Dataset 9 and the confirmed destruction of footage from August 9–10, 2019 are part of the released document architecture — the gaps in the release are direct evidence in the death investigation.`,
      },
      {
        themeId: 'media-congressional-investigations',
        strength: 2,
        bridge: `The O'Keefe recording of an ABC News executive suppressing the Epstein story — surfaced through EFTA-adjacent document releases — is a primary document in the media investigation thread. Several congressional referrals and oversight requests cite EFTA compliance failures as the basis for further investigation.`,
      },
    ],
  },

  {
    themeId: 'trumpepstein-connections',
    connects: [
      {
        themeId: 'the-trafficking-operation',
        strength: 2,
        bridge: `Virginia Giuffre has stated she was first recruited at Mar-a-Lago, where she worked as a locker room attendant at age 16. The Trump-Epstein social and property relationship is directly relevant to how and where victim recruitment occurred.`,
      },
      {
        themeId: 'the-acosta-plea-deal-legal-history',
        strength: 3,
        bridge: `Alexander Acosta — who negotiated the 2008 NPA — told Trump transition officials that he had been informed Epstein "belonged to intelligence" and was directed to leave the case alone. He was confirmed as Secretary of Labor by the same administration and resigned only after Epstein's 2019 re-arrest. The Acosta appointment is a direct connection between this theme and the plea deal.`,
      },
      {
        themeId: 'maxwell-role-legal-history-current-status',
        strength: 2,
        bridge: `Reporting from The Guardian and subsequent EFTA document analysis indicates Maxwell made overtures to provide testimony implicating Trump in exchange for a sentence reduction, which was reportedly rejected. Maxwell's silence about the Trump relationship is a documented feature of the post-conviction legal landscape.`,
      },
      {
        themeId: 'political-intelligence-network',
        strength: 2,
        bridge: `The Trump-Epstein connection exists within a broader pattern of Epstein cultivating relationships with politically powerful figures across party lines. The political intelligence network theme contextualizes these relationships as systematic rather than incidental.`,
      },
    ],
  },

  {
    themeId: 'political-intelligence-network',
    connects: [
      {
        themeId: 'intelligence-connections',
        strength: 3,
        bridge: `The political network and intelligence dimensions of the Epstein operation are deeply entangled. The same figures who provided political cover — including Barak, whose connection to Israeli intelligence is documented — also appear in the intelligence thread. Several researchers argue the political network was the product of intelligence asset cultivation rather than organic social connection.`,
      },
      {
        themeId: 'financial-crimes-money-laundering',
        strength: 2,
        bridge: `Wexner's financial relationship with Epstein — the primary documented funding source for the political network's infrastructure — is analyzed in depth in the Financial Crimes theme. The movement of money through Epstein's foundations and LLCs is the mechanism that made the political network's hospitality infrastructure possible.`,
      },
      {
        themeId: 'the-acosta-plea-deal-legal-history',
        strength: 2,
        bridge: `The success of the 2008 NPA is widely attributed to Epstein's political connections. Acosta's reference to Epstein "belonging to intelligence" and his instruction to leave the case alone suggests that at least some of those connections operated at the level of national security rather than mere political influence.`,
      },
    ],
  },

  {
    themeId: 'maxwell-role-legal-history-current-status',
    connects: [
      {
        themeId: 'the-trafficking-operation',
        strength: 3,
        bridge: `Maxwell's conviction documents the core operational facts of the trafficking operation from her role as primary recruiter and trainer. Her trial record is the most authoritative single source for how the operation functioned day-to-day.`,
      },
      {
        themeId: 'the-co-conspirators-immunity-grantees',
        strength: 3,
        bridge: `Maxwell's ongoing refusal to name additional co-conspirators — and the reported rejection of her offer to implicate Trump in exchange for a reduced sentence — is the central unresolved thread in the immunity theme. Her testimony remains the most significant withheld evidence in the entire case.`,
      },
      {
        themeId: 'intelligence-connections',
        strength: 2,
        bridge: `Maxwell's father Robert was a confirmed Mossad asset who died in disputed circumstances weeks before Ghislaine joined Epstein in New York. The intelligence-connections theme examines whether she brought asset relationships or recruitment methodology with her from that context.`,
      },
    ],
  },

  {
    themeId: 'the-co-conspirators-immunity-grantees',
    connects: [
      {
        themeId: 'the-acosta-plea-deal-legal-history',
        strength: 3,
        bridge: `The immunity provisions are a product of the NPA — they exist because Acosta's office agreed to them. The full scope of who received immunity (named and unnamed), the illegal non-notification of victims, and the legal challenges to the agreement are all part of the plea deal theme.`,
      },
      {
        themeId: 'the-trafficking-operation',
        strength: 3,
        bridge: `Kellen, Ross, Groff, and Marcinkova — the four named NPA immunity recipients besides Epstein — were direct participants in the trafficking operation's daily management. Their immunity means the operation's infrastructure was legally insulated from federal prosecution even as its structure became publicly documented.`,
      },
      {
        themeId: 'maxwell-role-legal-history-current-status',
        strength: 2,
        bridge: `Maxwell was not included in the 2008 NPA (she was in the UK at the time) and was eventually prosecuted separately. Her eventual conviction — and her withholding of testimony about additional co-conspirators — is the primary outstanding accountability question following the NPA immunity grants.`,
      },
    ],
  },

  {
    themeId: 'financial-crimes-money-laundering',
    connects: [
      {
        themeId: 'political-intelligence-network',
        strength: 2,
        bridge: `The financial flows that funded the Epstein network — Wexner's transferred wealth, the Gratitude America and Epstein VI Foundation charitable entities, the BNY and JPMorgan accounts — are what made the political hospitality infrastructure possible. Money and influence are not separate systems in this operation; they are the same system.`,
      },
      {
        themeId: 'intelligence-connections',
        strength: 2,
        bridge: `Several forensic researchers have noted that the financial flows between Epstein-linked entities and figures with documented intelligence connections — including the Carbyne investment shared by Epstein and Barak — suggest the financial network may have had an intelligence facilitation dimension beyond simple money management.`,
      },
      {
        themeId: 'the-co-conspirators-immunity-grantees',
        strength: 2,
        bridge: `Darren Indyke, as Epstein's estate trustee, administered the post-death distributions — including $100 million to Marina Shuliak — from the 1953 Trust. His role as both defense-side attorney during the NPA negotiations and estate administrator creates an unresolved question about continuity between the legal protection structure and the financial distribution structure.`,
      },
      {
        themeId: 'international-consequences-fallout',
        strength: 2,
        bridge: `Several of the suspicious transactions in the financial record — particularly movements through Austrian entities and accounts linked to Brunel's operations — have international jurisdiction implications. German and French investigators have opened parallel financial investigations that are documented in the international consequences theme.`,
      },
    ],
  },

  {
    themeId: 'intelligence-connections',
    connects: [
      {
        themeId: 'political-intelligence-network',
        strength: 3,
        bridge: `The intelligence and political dimensions of the Epstein network are the hardest to disentangle. Acosta's reference to Epstein "belonging to intelligence" and the Wexner relationship's intelligence-adjacent dimensions both appear in this theme, but their full significance requires the political network context to interpret.`,
      },
      {
        themeId: 'epsteins-death-mcc-anomalies',
        strength: 2,
        bridge: `The circumstances of Epstein's death — the removed suicide watch, the sleeping guards, the destroyed surveillance footage, the contested autopsy findings — take on additional significance in the context of his alleged intelligence connections. If Epstein was an active or former intelligence asset, the question of who benefits from his death becomes a different kind of question.`,
      },
      {
        themeId: 'maxwell-role-legal-history-current-status',
        strength: 2,
        bridge: `Robert Maxwell's confirmed Mossad relationship, and Ghislaine's trajectory from her father's social world into Epstein's network within months of Robert Maxwell's death, is the most direct documented link between this investigation and intelligence services.`,
      },
      {
        themeId: 'financial-crimes-money-laundering',
        strength: 2,
        bridge: `The Carbyne investment — shared by Epstein and Ehud Barak, former Israeli Prime Minister — and the movement of funds through entities with intelligence-adjacent relationships is analyzed in the financial crimes theme. The forensic financial work provides the evidentiary foundation for claims made in this thread.`,
      },
    ],
  },

  {
    themeId: 'epsteins-death-mcc-anomalies',
    connects: [
      {
        themeId: 'efta-release-framework-document-architecture',
        strength: 3,
        bridge: `Dataset 8 and Dataset 9 of the EFTA release are the primary documentary source for the MCC death investigation. The destroyed footage, the "infinite loop" in Dataset 9, and the prison records are all part of the released document corpus — the release framework directly shapes what is and isn't available to researchers.`,
      },
      {
        themeId: 'intelligence-connections',
        strength: 2,
        bridge: `The circumstances of the death — multiple institutional failures occurring simultaneously while the most anticipated federal witness of the decade was in custody — are interpreted very differently depending on whether Epstein is understood as a private actor or as an intelligence-adjacent figure. This thread and the intelligence theme must be read together.`,
      },
      {
        themeId: 'media-congressional-investigations',
        strength: 2,
        bridge: `Media coverage of the death, and subsequent congressional inquiries into the MCC circumstances, are part of the institutional response documented in the media and congressional investigations theme. The Barr DOJ's handling of the death investigation is a specific subject of congressional scrutiny.`,
      },
    ],
  },

  {
    themeId: 'the-acosta-plea-deal-legal-history',
    connects: [
      {
        themeId: 'the-co-conspirators-immunity-grantees',
        strength: 3,
        bridge: `The NPA is the instrument that created the immunity structure. They are cause and effect: the plea deal theme documents how the NPA was negotiated; the co-conspirators theme documents what the immunity provisions protected and who received them.`,
      },
      {
        themeId: 'trumpepstein-connections',
        strength: 2,
        bridge: `Acosta's subsequent appointment as Secretary of Labor in the Trump administration, and his comment to transition officials that Epstein "belonged to intelligence," are direct threads linking the 2008 legal history to the Trump connection theme.`,
      },
      {
        themeId: 'political-intelligence-network',
        strength: 2,
        bridge: `The extraordinary terms of the 2008 NPA — federal immunity, state plea, daily work release — are difficult to explain without reference to Epstein's political connections. The political network theme provides the context for understanding why federal prosecutors agreed to terms that defense attorneys called unprecedented.`,
      },
      {
        themeId: 'media-congressional-investigations',
        strength: 2,
        bridge: `Congressional investigations into the NPA — particularly the House Judiciary Committee's examination of Acosta and the Biden DOJ's decision not to reopen the immunity question — are documented in the media and congressional investigations theme.`,
      },
    ],
  },

  {
    themeId: 'international-consequences-fallout',
    connects: [
      {
        themeId: 'financial-crimes-money-laundering',
        strength: 2,
        bridge: `The French and German financial investigations into Epstein-linked accounts are pursuing the same transaction records analyzed in the financial crimes theme. The international legal proceedings provide an alternative jurisdiction for evidence that U.S. investigators have not pursued.`,
      },
      {
        themeId: 'the-trafficking-operation',
        strength: 2,
        bridge: `Brunel's operations — the international recruitment networks centered in France, Brazil, and Eastern Europe — are the primary subject of French criminal proceedings. The trafficking operation's international dimensions are most extensively investigated outside the United States.`,
      },
      {
        themeId: 'intelligence-connections',
        strength: 2,
        bridge: `Israeli and British governmental responses to requests for cooperation with the U.S. investigation — particularly regarding Prince Andrew and Barak — are documented in this theme. The degree to which foreign intelligence relationships impede international cooperation is a specific research question this thread pursues.`,
      },
    ],
  },

  {
    themeId: 'media-congressional-investigations',
    connects: [
      {
        themeId: 'efta-release-framework-document-architecture',
        strength: 2,
        bridge: `The EFTA itself is a product of congressional action — passed with a veto-proof majority despite opposition from the executive branch. Congressional pressure is the mechanism through which the 3.5 million page release happened, and ongoing congressional investigation is the mechanism through which compliance gaps are being challenged.`,
      },
      {
        themeId: 'the-acosta-plea-deal-legal-history',
        strength: 2,
        bridge: `Congressional scrutiny of the NPA — including the House Judiciary Committee's 2019 investigation of Acosta and requests for underlying DOJ communications — is the primary accountability mechanism for the 2008 immunity grants. The media coverage and congressional investigations are the institutional response to the NPA that the plea deal theme documents.`,
      },
    ],
  },

  {
    themeId: 'community-research-tools-architecture',
    connects: [
      {
        themeId: 'efta-release-framework-document-architecture',
        strength: 3,
        bridge: `The community tools exist to navigate the EFTA releases. JMail.world indexes Epstein's email archive from the release; EpsteinExposed.com cross-references the 1.1+ million documents; the GitHub forensic repositories analyze the financial records. The tools and the document corpus are inseparable.`,
      },
    ],
  },

  {
    themeId: 'whoops-emails',
    connects: [
      {
        themeId: 'the-trafficking-operation',
        strength: 2,
        bridge: `The "whoops" email chain — in which Epstein forwarded nude photographs of a minor to Jean-Luc Brunel with the annotation "whoops" — is one of the most direct documentary pieces of evidence linking the email archive to the operational trafficking record. It appears in both this theme and the trafficking operation.`,
      },
      {
        themeId: 'efta-release-framework-document-architecture',
        strength: 2,
        bridge: `The "whoops" emails are part of the JMail email archive released under EFTA. Their discovery by community researchers — rather than by DOJ prosecutors — illustrates both the volume of material in the release and the limitations of official document review.`,
      },
      {
        themeId: 'community-research-tools-architecture',
        strength: 2,
        bridge: `The "whoops" email chain was surfaced by community researchers using JMail.world, not by official investigators. It exemplifies the community research methodology of systematic keyword and relationship searches through the email archive.`,
      },
    ],
  },

  {
    themeId: 'academic-scientific-network',
    connects: [
      {
        themeId: 'political-intelligence-network',
        strength: 2,
        bridge: `The academic network — MIT Media Lab, Harvard, Rockefeller University — served the same function as the political network: creating a constellation of relationships that provided social legitimacy and insulated Epstein from scrutiny. The donations to academic institutions followed the same pattern as political hospitality: money in exchange for access and credibility.`,
      },
      {
        themeId: 'financial-crimes-money-laundering',
        strength: 1,
        bridge: `Epstein's donations to academic institutions — including a $6.5 million gift to Harvard — were made through the same charitable entities analyzed in the financial crimes theme. Some researchers have examined whether these donations served an additional function in the financial architecture.`,
      },
    ],
  },
];

// Convenience lookup: given a themeId, return all themes it connects to
export function getConnections(themeId: string): ThemeBridge[] {
  return themeConnections.find((t) => t.themeId === themeId)?.connects ?? [];
}

// Build the full bidirectional connection map for the relationship diagram
export function getAllConnectionPairs(): Array<{
  sourceId: string;
  targetId: string;
  strength: 1 | 2 | 3;
}> {
  const pairs: Array<{ sourceId: string; targetId: string; strength: 1 | 2 | 3 }> = [];
  const seen = new Set<string>();
  for (const entry of themeConnections) {
    for (const conn of entry.connects) {
      const key = [entry.themeId, conn.themeId].sort().join('|');
      if (!seen.has(key)) {
        seen.add(key);
        pairs.push({
          sourceId: entry.themeId,
          targetId: conn.themeId,
          strength: conn.strength,
        });
      }
    }
  }
  return pairs;
}
