# Mathematical Specifications: Deterministic Engines

## 1. Role Match Formula

The Role Match engine calculates how well a student's current skill repertoire and academic background align with the industry requirements for a specific target role.

### Formula
$$\text{Skill Match Score} = \frac{\sum_{i=1}^{n} \left(\min(\text{student\_level}_i, \text{required\_level}_i) \times \text{weight}_i\right)}{\sum_{i=1}^{n} \left(\text{required\_level}_i \times \text{weight}_i\right)} \times 100$$

$$\text{Final Score} = \text{Skill Match Score} \times \text{Education Factor}$$

### Definitions & Constraints:
- $\text{student\_level}_i \in [0, 100]$: Proficiency level reported or assessed for skill $i$.
- $\text{required\_level}_i \in [0, 100]$: Benchmark industry expectation for skill $i$.
- $\text{weight}_i \in [1, 10]$: Relative weight of skill $i$ within this role.
- $\min(\text{student\_level}_i, \text{required\_level}_i)$: Capping mechanic ensuring that exceeding a required level does not artificially inflate or compensate for deficits in other critical skills.
- $\text{Education Factor} \in [0.5, 1.0]$: Deterministic multiplier based on degree alignment:
  - Exact Degree Alignment (e.g., Computer Science / IT for Software Roles): `1.0`
  - Allied STEM Degree (e.g., Mathematics, Statistics, Electrical Engineering): `0.9`
  - General STEM Degree: `0.8`
  - Non-STEM / Non-technical Degree: `0.7`

---

## 2. Skill Gap Formula

For every skill required by a role, the gap is determined strictly by:

### Formula
$$\text{Gap} = \max(0, \text{Required\_Level} - \text{Student\_Level})$$

### Categorization Tiers:
- **Strong**: $\text{Student\_Level} \ge \text{Required\_Level} \iff \text{Gap} = 0$
- **Developing**: $0 < \text{Gap} \le 20$
- **Major Gap**: $20 < \text{Gap} \le 50$
- **Critical Gap**: $\text{Gap} > 50$

---

## 3. Priority Engine Formula

The Priority engine mathematically ranks which gaps the student should bridge first. It prioritizes high-gap skills that carry both high market demand and high architectural importance to the role.

### Formula
$$\text{Priority Score} = \left(\frac{\text{Gap}}{100}\right) \times \text{Industry Demand} \times \text{Role Importance}$$

### Definitions:
- $\text{Gap} \in [0, 100]$: As calculated above.
- $\text{Industry Demand} \in [1, 10]$: Macro-economic indicator of market hiring volume.
- $\text{Role Importance} \in [1, 10]$: Criticality of this skill to daily job performance.

### Priority Tiers:
- **Critical Priority**: $\text{Priority Score} \ge 6.0$
- **High Priority**: $4.0 \le \text{Priority Score} < 6.0$
- **Medium Priority**: $2.0 \le \text{Priority Score} < 4.0$
- **Low Priority**: $\text{Priority Score} < 2.0$

### Transparency Affordance:
Every priority item dynamically outputs its calculation string, e.g.:
$$\text{Priority Score} = \left(\frac{60}{100}\right) \times 9.0 \times 9.5 = 5.13 \implies \text{High Priority}$$
