# WAVE accessibility review

## Issue 1: Link text was too generic
- Element affected: the social links in the contact section on the home page.
- WAVE reported that some links needed clearer context because the visible text was not descriptive enough.
- This matters because a screen reader user may not understand where a link will take them without extra context, which makes navigation less predictable.
- Fix applied: I added descriptive aria-label attributes to the email, LinkedIn, and GitHub links so the purpose of each link is clear.

## Issue 2: Form controls needed stronger labeling and input support
- Element affected: the contact form on the About page.
- WAVE commonly flags forms when labels and autocomplete support are weak or unclear for assistive technology users.
- This matters because users with cognitive or motor impairments may struggle to understand what information is required and may enter it less confidently.
- Fix applied: I preserved explicit label elements and added autocomplete attributes to the name and email fields to improve clarity and usability.

## Issue 3: The page needed a more robust skip-navigation experience
- Element affected: the top of each page before the main content.
- WAVE can flag missing skip links or weak keyboard navigation paths when a page has repeated navigation and no easy bypass.
- This matters because keyboard-only users can waste time tabbing through repeated headers and links before reaching the main content.
- Fix applied: I kept a visible skip link and ensured the main content target is clearly defined with a matching section anchor.

## Reflection
This project taught me that accessibility is not just about avoiding obvious errors; it is about making the experience feel calm, understandable, and welcoming for many kinds of users. I learned that small choices, like descriptive link names, stronger form labels, and a skip link, can dramatically reduce frustration for people using screen readers or keyboard navigation. What felt like a simple design adjustment often had a real human impact, especially for users who rely on assistive technology to move through content efficiently. I also saw how responsive design and accessibility work well together because both aim to create flexible, clear experiences across different devices and abilities. Overall, this assignment shifted my thinking from “does it look right?” to “does it work well for everyone?”