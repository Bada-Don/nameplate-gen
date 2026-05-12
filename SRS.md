# Nameplate Gen Engine

## 1. Project Vision: The "Virtual Typesetter"

The goal is to move from manual design mockups to a **Generative Design System**. Instead of a human designer moving elements in CorelDraw, a set of **Heuristic Rules** (Design Intelligence) will automatically arrange text, borders, and religious icons into "production-ready" layouts.

**The Value Prop:**

* **Customer Side:** Instant, high-quality visual gratification with 6 varied styles.
* **Shop Side:** Automation of the "Drafting" phase, exporting clean vector files (SVG/PDF) directly for the plotter/CNC.

---

## 2. Technical Stack

We chose **JavaScript (Fabric.js)** as the primary engine because it bridges the gap between web-previews and vector-perfect manufacturing.

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | **React + Fabric.js** | Handling real-time canvas manipulation, object grouping, and Z-index management. |
| **Styling** | **CSS3 (@font-face)** | Mapping local TTF/OTF shop fonts to the web browser for accurate typesetting. |
| **Data** | **JSON Manifest** | A directory map for borders, fonts (cursive vs. simple), and logo metadata. |
| **Logic** | **Custom Layout Class** | The "Brain" that calculates bounding boxes, prevents overlaps, and handles icon compounds. |
| **Output** | **SVG/PDF (Node.js)** | Converting the finalized JSON canvas state into high-resolution production files. |

---

## 3. The "Brain" Logic (The Rules Engine)

The engine operates on a hierarchy of constraints to ensure "Near Perfect" suggestions:

1. **Spatial Allocation:** Uses "Safe Zones" derived from the border design to ensure no text hits decorative corner elements.
2. **Dynamic Scaling:** A "Fit-to-Box" algorithm that shrinks text based on character count and font width rather than using fixed font sizes.
3. **Cultural Compounds:** Specific logic for religious iconography:
* *Single Logo:* Center-Top.
* *Trio Logic:* Logical grouping (e.g., [Khanda] + [Ek Onkar] + [Khanda]) treated as a single centered unit.


4. **Aesthetic Permutations:** Generating 6 variants by mixing font pairings (Cursive Name + Sans-Serif Address) and logo placements.

---

## 4. Operational Assets

You have successfully organized your local directory into a production-ready structure:

* **Borders:** SVGs exported as outlined paths to maintain aspect ratio.
* **Logos:** High-contrast, single-color compound paths (Om, Swastik, Khanda, etc.).
* **Fonts:** Categorized into `cursive` and `simple` for smart pairing logic.

---

## 5. Development Phases

* **Phase 1 (Current):** Perfecting the **Sandbox**. Solving asynchronous loading, font rendering, and proportional scaling issues.
* **Phase 2:** Building the **JSON Manifest Editor**. A way to quickly add new borders or fonts to the system without changing the code.
* **Phase 3:** **UI/UX Wrapper**. Creating the user-facing site where they enter their name/address and see the 6-suggestion grid.
* **Phase 4:** **Production Bridge**. Coding the "Export" button to generate a clean, scaled SVG for your plotter.

---

## 6. Current Technical Focus

We are currently refining the **Fabric.js Canvas Logic**. We’ve moved away from simple "top-down" drawing to an **Async/Await Sequence** to ensure that borders load first, icons load second, and text renders last (on top). We are also implementing **CSS @font-face** to bridge your local shop fonts into the browser.

