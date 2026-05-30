---
title: "CISA Urges Security Teams to Audit Software Development Pipelines After Megalodon Supply‑Chain Attack"
date: 2026-05-30T10:00:00Z
description: "CISA warns about Megalodon supply-chain attack injecting malicious GitHub Actions into 5,500+ repositories and compromise via poisoned Nx Console VS Code extension, urging security teams to audit workflows and rotate credentials."
tags:
  - cybersecurity
  - supply-chain
  - GitHub
  - CISA
  - Megalodon
  - Nx Console
  - vulnerability
thumbnail: "thumbnail.jpg"
---

## CISA Urges Security Teams to Audit Software Development Pipelines After Megalodon Supply‑Chain Attack
*By David Jones | Cybersecurity Dive | Published May 30, 2026*

The Cybersecurity and Infrastructure Security Agency (CISA) issued an urgent advisory on Thursday warning that recent campaigns have infiltrated software development environments to steal credentials, API tokens, SSH keys and other secrets.

CISA highlighted two interconnected threats:

1. **The “Megalodon” supply‑chain attack** – On May 18, threat actors injected malicious GitHub Action workflows into more than 5,500 open‑source repositories. The exploit targeted projects with weak branch‑protection rules, allowing unauthorized commits that exfiltrated cloud credentials, API tokens, SSH keys and similar secrets from compromised build environments. Step Security’s analysis, referenced by CISA, notes that the stolen secrets could be used to pivot into corporate cloud accounts and internal systems.

2. **Compromise of a GitHub employee device** – A separate campaign leveraged a poisoned third‑party Visual Studio Code extension. On May 19, a malicious version of **Nx Console 18.95.0** was published to the Visual Studio Marketplace and remained available for approximately 18 minutes before being removed. The extension, which had been previously linked to a breach of NX developer systems, was used to compromise a GitHub employee’s device, granting attackers access to internal GitHub resources. The vulnerability has been tracked as **CVE‑2026‑48027**, and GitHub has issued a related security advisory.

**CISA’s recommendations**
- Audit all workflow files (e.g., GitHub Actions, GitLab CI) for unauthorized or suspicious changes, especially those originating from automated accounts.
- Review contributor activity since May 18 and revert any unapproved pull requests or direct commits.
- If a compromise is tied to the Nx Console extension or a breached GitHub account, rotate all exposed credentials, API tokens and SSH keys, and enforce multi‑factor authentication on affected accounts.
- Enable strict branch‑protection rules (required reviews, status checks) and restrict workflow permissions to the least privilege necessary.

CISA urges organizations to treat these incidents as a reminder that software supply chains are a high‑value target. Continuous monitoring, least‑privilege CI/CD configurations, and rapid credential rotation are essential to mitigate the risk of similar attacks.

*For further details, see CISA’s advisory and the Step Security blog post on the Megalodon campaign.*